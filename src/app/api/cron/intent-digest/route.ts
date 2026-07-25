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

    // Find the projects that actually got responses this week (one compact row each),
    // instead of pulling every tenant's responses into memory at once.
    const active = await prisma.intentResponse.groupBy({
        by: ["projectId"],
        where: { createdAt: { gte: weekAgo } },
        _count: { _all: true },
    });

    let sent = 0;
    let skipped = 0;

    for (const { projectId } of active) {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                settings: true,
                lastIntentDigestAt: true,
                user: { select: { name: true, email: true } },
            },
        });

        if (!project?.user?.email) { skipped++; continue; }

        // Idempotency: skip if a digest already went out for this project this week
        // (guards against cron retries / re-invocations re-emailing everyone).
        if (project.lastIntentDigestAt && project.lastIntentDigestAt >= weekAgo) {
            skipped++;
            continue;
        }

        // Only send the weekly digest to projects that chose it. "instant" is handled
        // in the widget route; "off" gets no emails.
        if (readIntentSettings(project.settings).notifyFrequency !== "weekly") {
            skipped++;
            continue;
        }

        // Bounded per-project read (last 14 days for the week-over-week comparison)
        const rows = await prisma.intentResponse.findMany({
            where: { projectId, createdAt: { gte: twoWeeksAgo } },
            select: { optionId: true, optionLabel: true, country: true, text: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: MAX_ROWS_PER_PROJECT,
        });

        const thisWeek = rows.filter((r) => r.createdAt >= weekAgo);
        const prevWeekCount = rows.length - thisWeek.length;
        if (thisWeek.length === 0) { skipped++; continue; }

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

        const total = thisWeek.length;
        const options: DigestOption[] = Array.from(optionCounts.values())
            .map((o) => ({ label: o.label, count: o.count, percent: Math.round((o.count / total) * 100) }))
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
