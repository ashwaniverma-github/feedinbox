import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/tiers";
import {
    DEFAULT_INTENT_SETTINGS,
    readIntentSettings,
    MAX_INTENT_OPTIONS,
    MIN_DELAY_SECONDS,
    MAX_DELAY_SECONDS,
    type IntentSettings,
    type IntentOption,
} from "@/lib/intent";

// GET /api/projects/[id]/intent-settings - Get exit-intent settings
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await prisma.project.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const settings = readIntentSettings(project.settings);
        const userIsPro = await isPro(session.user.id);

        return NextResponse.json({
            settings,
            isPro: userIsPro,
            widgetSeen: !!project.widgetLastSeenAt,
            widgetLastSeenAt: project.widgetLastSeenAt,
        });
    } catch (error) {
        console.error("Error fetching intent settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch intent settings" },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id]/intent-settings
// `enabled` toggle allowed for all tiers; customization (question/options/delay/events) is Pro-only.
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await prisma.project.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const userIsPro = await isPro(session.user.id);
        const body = await request.json();
        const current = readIntentSettings(project.settings);
        const next: IntentSettings = { ...current };

        // enabled: allowed for any tier
        if (typeof body.enabled === "boolean") {
            next.enabled = body.enabled;
        }

        // notifyFrequency: notification preference, allowed for any tier
        if (
            body.notifyFrequency === "instant" ||
            body.notifyFrequency === "weekly" ||
            body.notifyFrequency === "off"
        ) {
            next.notifyFrequency = body.notifyFrequency;
        }

        // Customization fields: Pro only. Non-Pro edits to these are ignored.
        if (userIsPro) {
            if (typeof body.question === "string" && body.question.trim().length > 0) {
                next.question = body.question.trim().slice(0, 200);
            }
            if (Array.isArray(body.options)) {
                const cleaned: IntentOption[] = [];
                const usedIds = new Set<string>();
                for (let i = 0; i < body.options.length && cleaned.length < MAX_INTENT_OPTIONS; i++) {
                    const o = body.options[i];
                    if (!o || typeof o !== "object") continue;
                    const label = typeof o.label === "string" ? o.label.trim().slice(0, 200) : "";
                    if (!label) continue;
                    const base =
                        typeof o.id === "string" && o.id.trim() ? o.id.trim().slice(0, 100) : `option_${i + 1}`;
                    // Regenerate colliding ids deterministically so every option is unique
                    let id = base;
                    let n = 2;
                    while (usedIds.has(id)) id = `${base}_${n++}`.slice(0, 100);
                    usedIds.add(id);
                    cleaned.push({ id, label });
                }
                if (cleaned.length > 0) next.options = cleaned;
            }
            if (typeof body.delaySeconds === "number" && Number.isFinite(body.delaySeconds)) {
                next.delaySeconds = Math.min(
                    MAX_DELAY_SECONDS,
                    Math.max(MIN_DELAY_SECONDS, Math.round(body.delaySeconds))
                );
            }
            if (typeof body.highIntentEvent === "string" && body.highIntentEvent.trim().length > 0) {
                next.highIntentEvent = body.highIntentEvent.trim().slice(0, 100);
            }
            if (typeof body.conversionEvent === "string" && body.conversionEvent.trim().length > 0) {
                next.conversionEvent = body.conversionEvent.trim().slice(0, 100);
            }
        }

        const existingSettings = (project.settings as Record<string, unknown>) || {};
        const updatedSettings = {
            ...existingSettings,
            intentWidget: { ...DEFAULT_INTENT_SETTINGS, ...next },
        };

        await prisma.project.update({
            where: { id },
            data: { settings: updatedSettings as unknown as Prisma.InputJsonValue },
        });

        return NextResponse.json({ success: true, settings: updatedSettings.intentWidget });
    } catch (error) {
        console.error("Error updating intent settings:", error);
        return NextResponse.json(
            { error: "Failed to update intent settings" },
            { status: 500 }
        );
    }
}
