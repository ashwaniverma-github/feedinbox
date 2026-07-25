import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/email";
import IntentWeeklyDigest, {
    type DigestOption,
    type DigestCountry,
} from "@/emails/intent-weekly-digest";

export const dynamic = "force-dynamic";

// GET /api/cron/intent-digest - send weekly exit-intent digests.
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

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Pull the last 14 days of responses with owner + project info, grouped in memory.
    const rows = await prisma.intentResponse.findMany({
        where: { createdAt: { gte: twoWeeksAgo } },
        select: {
            optionId: true,
            optionLabel: true,
            country: true,
            text: true,
            createdAt: true,
            project: {
                select: {
                    id: true,
                    settings: true,
                    user: { select: { id: true, name: true, email: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Group by owner user id
    type Row = (typeof rows)[number];
    const byUser = new Map<string, Row[]>();
    for (const r of rows) {
        const uid = r.project.user?.id;
        if (!uid) continue;
        const list = byUser.get(uid) || [];
        list.push(r);
        byUser.set(uid, list);
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const weekRange = `${fmt(weekAgo)} – ${fmt(now)}`;

    let sent = 0;
    let skipped = 0;

    for (const [, userRows] of byUser) {
        const owner = userRows[0].project.user;
        if (!owner?.email) {
            skipped++;
            continue;
        }

        const thisWeek = userRows.filter((r) => r.createdAt >= weekAgo);
        const prevWeek = userRows.filter((r) => r.createdAt < weekAgo);
        if (thisWeek.length === 0) {
            skipped++; // no new responses this week -> no email
            continue;
        }

        // Build a label lookup from each project's configured options
        const labelById = new Map<string, string>();
        for (const r of thisWeek) {
            const settings = r.project.settings as { intentWidget?: { options?: { id: string; label: string }[] } };
            for (const opt of settings?.intentWidget?.options || []) {
                if (opt?.id) labelById.set(opt.id, opt.label);
            }
        }

        // Per-option counts
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

        // Link to the first project's dashboard (Exit-Intent tab)
        const projectId = thisWeek[0].project.id;
        const dashboardUrl = `${baseUrl}/projects/${projectId}?tab=intent`;

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: owner.email,
                subject: `Why-Not-Buy digest · ${total} ${total === 1 ? "response" : "responses"} this week`,
                react: IntentWeeklyDigest({
                    ownerName: owner.name || "there",
                    weekRange,
                    total,
                    previousTotal: prevWeek.length,
                    options,
                    countries,
                    quotes,
                    dashboardUrl,
                }),
            });
            sent++;
        } catch (error) {
            console.error("Failed to send intent digest to", owner.email, error);
            skipped++;
        }
    }

    return NextResponse.json({ ok: true, sent, skipped, usersConsidered: byUser.size });
}

function fmt(d: Date): string {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
