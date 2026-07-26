import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readIntentSettings } from "@/lib/intent";
import { resend, FROM_EMAIL, isEmailConfigured } from "@/lib/email";
import IntentWeeklyDigest, {
    type DigestOption,
    type DigestCountry,
} from "@/emails/intent-weekly-digest";

export const dynamic = "force-dynamic";

// Resend allows ~2 requests/sec; stay under it with a delay between sends.
const SEND_INTERVAL_MS = 600;
const SEND_TIMEOUT_MS = 10_000;
// Cap responses read per project so one busy project can't blow up memory.
const MAX_ROWS_PER_PROJECT = 2000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendWithTimeout(payload: Parameters<typeof resend.emails.send>[0]) {
    return Promise.race([
        resend.emails.send(payload),
        new Promise((_, reject) => setTimeout(() => reject(new Error("send timeout")), SEND_TIMEOUT_MS)),
    ]);
}

// GET /api/cron/intent-digest - send weekly exit-intent digests, one per project.
// Protected by CRON_SECRET (Vercel Cron sends it as `Authorization: Bearer <secret>`).
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
    }
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Don't fire doomed requests with the placeholder key
    if (!isEmailConfigured) {
        return NextResponse.json({ ok: false, reason: "email not configured" }, { status: 200 });
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const weekRange = `${fmt(weekAgo)} - ${fmt(now)}`;

    // Projects that got responses this week (one compact row each).
    const MAX_PROJECTS_PER_RUN = 100;
    const active = await prisma.intentResponse.groupBy({
        by: ["projectId"],
        where: { createdAt: { gte: weekAgo } },
        _count: { _all: true },
    });
    const activeIds = active.map((a) => a.projectId);

    // Load the fields the loop needs in a single query (no per-project findUnique),
    // oldest-digested first so unprocessed projects roll over predictably, and
    // bounded per invocation so a large backlog can't run unboundedly.
    const projects = await prisma.project.findMany({
        where: { id: { in: activeIds } },
        select: {
            id: true,
            settings: true,
            lastIntentDigestAt: true,
            user: { select: { name: true, email: true } },
        },
        orderBy: { lastIntentDigestAt: { sort: "asc", nulls: "first" } },
        take: MAX_PROJECTS_PER_RUN,
    });

    let sent = 0;
    let skipped = 0;

    for (const project of projects) {
        if (!project?.user?.email) { skipped++; continue; }
        const projectId = project.id;

        // Idempotency: skip if a digest already went out for this project within the
        // last 6 days. The 1-day grace (vs a strict 7) means a cron run that fires a
        // little early doesn't get skipped for another whole week, while genuine
        // same-period retries are still deduped.
        const digestCooldown = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        if (project.lastIntentDigestAt && project.lastIntentDigestAt >= digestCooldown) {
            skipped++;
            continue;
        }

        // Only send the weekly digest to projects that chose it. "instant" is handled
        // in the widget route; "off" gets no emails.
        if (readIntentSettings(project.settings).notifyFrequency !== "weekly") {
            skipped++;
            continue;
        }

        // Accurate week-over-week totals via count() so the row cap can't skew them.
        const [total, prevWeekCount] = await Promise.all([
            prisma.intentResponse.count({ where: { projectId, createdAt: { gte: weekAgo } } }),
            prisma.intentResponse.count({
                where: { projectId, createdAt: { gte: twoWeeksAgo, lt: weekAgo } },
            }),
        ]);
        if (total === 0) { skipped++; continue; }

        // Bounded read of this week's rows for the breakdown + quote sampling only.
        const thisWeek = await prisma.intentResponse.findMany({
            where: { projectId, createdAt: { gte: weekAgo } },
            select: { optionId: true, optionLabel: true, country: true, text: true },
            orderBy: { createdAt: "desc" },
            take: MAX_ROWS_PER_PROJECT,
        });

        // Label map from THIS project's configured options only (ids like option_1
        // are positional and collide across projects, so never merge across projects).
        const settings = project.settings as { intentWidget?: { options?: { id: string; label: string }[] } };
        const labelById = new Map<string, string>();
        for (const opt of settings?.intentWidget?.options || []) {
            if (opt?.id) labelById.set(opt.id, opt.label);
        }

        const optionCounts = new Map<string, { label: string; count: number }>();
        const countryCounts = new Map<string, number>();
        const quotes: string[] = [];

        for (const r of thisWeek) {
            const oid = r.optionId || "unknown";
            const label = labelById.get(oid) || r.optionLabel || "Unknown";
            const existing = optionCounts.get(oid);
            if (existing) existing.count += 1;
            else optionCounts.set(oid, { label, count: 1 });

            if (r.country) countryCounts.set(r.country, (countryCounts.get(r.country) || 0) + 1);
            if (r.text && quotes.length < 6) quotes.push(r.text);
        }

        // Percentages are relative to the sampled rows so they stay coherent even if
        // the row cap truncated a very busy week; the headline `total` stays accurate.
        const sampleTotal = thisWeek.length || 1;
        const options: DigestOption[] = Array.from(optionCounts.values())
            .map((o) => ({ label: o.label, count: o.count, percent: Math.round((o.count / sampleTotal) * 100) }))
            .sort((a, b) => b.count - a.count);
        const countries: DigestCountry[] = Array.from(countryCounts.entries())
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count);

        const dashboardUrl = `${baseUrl}/projects/${project.id}?tab=intent`;

        try {
            await sendWithTimeout({
                from: FROM_EMAIL,
                to: project.user.email,
                subject: `Why-Not-Buy digest · ${total} ${total === 1 ? "response" : "responses"} this week`,
                react: IntentWeeklyDigest({
                    ownerName: project.user.name || "there",
                    weekRange,
                    total,
                    previousTotal: prevWeekCount,
                    options,
                    countries,
                    quotes,
                    dashboardUrl,
                }),
            });
            // Mark only after a successful send so failures retry next run
            await prisma.project.update({
                where: { id: project.id },
                data: { lastIntentDigestAt: now },
            });
            sent++;
        } catch (error) {
            console.error("Failed to send intent digest for project", project.id, error);
            skipped++;
        }

        await sleep(SEND_INTERVAL_MS); // throttle to respect Resend's rate limit
    }

    return NextResponse.json({ ok: true, sent, skipped, projectsConsidered: active.length });
}

function fmt(d: Date): string {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
