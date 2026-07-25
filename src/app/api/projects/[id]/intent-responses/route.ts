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

        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

        const [responses, total, all] = await Promise.all([
            prisma.intentResponse.findMany({
                where: { projectId: id },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.intentResponse.count({ where: { projectId: id } }),
            prisma.intentResponse.findMany({
                where: { projectId: id },
                select: { optionId: true, optionLabel: true, country: true },
            }),
        ]);

        // Aggregate: per-option and per-country counts
        const settings = readIntentSettings(project.settings);
        const labelById = new Map<string, string>();
        for (const opt of settings.options) labelById.set(opt.id, opt.label);

        const optionCounts = new Map<string, { optionId: string; label: string; count: number }>();
        const countryCounts = new Map<string, number>();

        for (const r of all) {
            const oid = r.optionId || "unknown";
            const label = labelById.get(oid) || r.optionLabel || "Unknown";
            const existing = optionCounts.get(oid);
            if (existing) existing.count += 1;
            else optionCounts.set(oid, { optionId: oid, label, count: 1 });

            if (r.country) {
                countryCounts.set(r.country, (countryCounts.get(r.country) || 0) + 1);
            }
        }

        const byOption = Array.from(optionCounts.values()).sort((a, b) => b.count - a.count);
        const byCountry = Array.from(countryCounts.entries())
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count);

        return NextResponse.json({
            responses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            aggregate: {
                total: all.length,
                byOption,
                byCountry,
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
