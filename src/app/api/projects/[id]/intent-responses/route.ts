import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readIntentSettings } from "@/lib/intent";

// GET /api/projects/[id]/intent-responses - List responses + aggregate breakdown
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await prisma.project.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Pagination params, guarded against NaN before applying bounds
        const pageRaw = parseInt(searchParams.get("page") || "1", 10);
        const page = Number.isFinite(pageRaw) ? Math.max(1, pageRaw) : 1;
        const limitRaw = parseInt(searchParams.get("limit") || "20", 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, limitRaw)) : 20;
        const daysRaw = parseInt(searchParams.get("days") || "30", 10);
        const days = Number.isFinite(daysRaw) ? Math.min(90, Math.max(7, daysRaw)) : 30;

        // UTC day boundaries so buckets/labels don't shift with the server timezone
        const dayMs = 24 * 60 * 60 * 1000;
        const nowDate = new Date();
        const startUtc = new Date(
            Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate()) - (days - 1) * dayMs
        );

        // Bounded reads: paginated page + counts via groupBy + series only within the window
        const [responses, total, byOptionRaw, byCountryRaw, seriesRows] = await Promise.all([
            prisma.intentResponse.findMany({
                where: { projectId: id },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.intentResponse.count({ where: { projectId: id } }),
            prisma.intentResponse.groupBy({
                by: ["optionId"],
                where: { projectId: id },
                _count: { _all: true },
            }),
            prisma.intentResponse.groupBy({
                by: ["country"],
                where: { projectId: id, country: { not: null } },
                _count: { _all: true },
            }),
            prisma.intentResponse.findMany({
                where: { projectId: id, createdAt: { gte: startUtc } },
                select: { createdAt: true },
            }),
        ]);

        // Option labels from this project's configured options
        const settings = readIntentSettings(project.settings);
        const labelById = new Map<string, string>();
        for (const opt of settings.options) labelById.set(opt.id, opt.label);

        const byOption = byOptionRaw
            .map((g) => {
                const oid = g.optionId || "unknown";
                return { optionId: oid, label: labelById.get(oid) || oid || "Unknown", count: g._count._all };
            })
            .sort((a, b) => b.count - a.count);

        const byCountry = byCountryRaw
            .map((g) => ({ country: g.country as string, count: g._count._all }))
            .sort((a, b) => b.count - a.count);

        // Daily time series (UTC) for the requested window
        const buckets = new Map<string, number>();
        for (let i = 0; i < days; i++) {
            const key = new Date(startUtc.getTime() + i * dayMs).toISOString().split("T")[0];
            buckets.set(key, 0);
        }
        for (const r of seriesRows) {
            const key = new Date(r.createdAt).toISOString().split("T")[0];
            if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
        }
        const series = Array.from(buckets.entries()).map(([date, count]) => ({
            date,
            label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
                new Date(`${date}T00:00:00Z`)
            ),
            count,
        }));

        return NextResponse.json({
            responses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            aggregate: {
                total,
                byOption,
                byCountry,
                series,
            },
        });
    } catch (error) {
        console.error("Error fetching intent responses:", error);
        return NextResponse.json(
            { error: "Failed to fetch intent responses" },
            { status: 500 }
        );
    }
}
