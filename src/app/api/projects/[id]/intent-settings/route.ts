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
// `enabled`, notifyFrequency and the fallback-timer toggle are allowed for all
// tiers; customization (question/options/delay length/events) is Pro-only.
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
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }
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

        // fallbackEnabled: whether to ask visitors who go quiet without an exit
        // signal. A "don't interrupt my readers" choice rather than customization,
        // so every tier gets it. The delay length itself stays Pro.
        if (typeof body.fallbackEnabled === "boolean") {
            next.fallbackEnabled = body.fallbackEnabled;
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
                    // Cap the base below 100 so a collision suffix always fits and the
                    // generated id changes each iteration (otherwise the loop can't terminate).
                    const base =
                        typeof o.id === "string" && o.id.trim() ? o.id.trim().slice(0, 90) : `option_${i + 1}`;
                    // Regenerate colliding ids deterministically so every option is unique
                    let id = base;
                    let n = 2;
                    while (usedIds.has(id)) id = `${base}_${n++}`;
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
            if (typeof body.abandonEvent === "string" && body.abandonEvent.trim().length > 0) {
                next.abandonEvent = body.abandonEvent.trim().slice(0, 100);
            }
            if (typeof body.hideBranding === "boolean") {
                next.hideBranding = body.hideBranding;
            }
        }

        // The three event names route to different behaviors in the widget, so
        // they must stay distinct or the dispatcher becomes ambiguous. Reject only
        // collisions this request introduced: settings saved before abandonEvent
        // existed can collide with its default, and rejecting those would lock the
        // project out of unrelated updates (the enabled toggle and notification
        // preference are free for every tier, yet non-Pro callers cannot edit event
        // names to repair the collision themselves). Untouched values are migrated.
        // Ordered so abandonEvent yields on a legacy collision: the other two are
        // names a customer's site is already firing, while abandonEvent is new and
        // has no call site yet.
        const EVENT_KEYS = ["highIntentEvent", "conversionEvent", "abandonEvent"] as const;
        // Only names this request actually changes count as edits. The dashboard
        // round-trips all three fields on every save, so comparing against the
        // stored value is what separates a real edit from an untouched legacy one.
        const edited = EVENT_KEYS.filter(
            (k) =>
                userIsPro &&
                typeof body[k] === "string" &&
                body[k].trim().length > 0 &&
                next[k] !== current[k]
        );

        // A collision the caller just introduced is rejected. Migrating the other
        // name instead would silently stop routing an event their site still fires.
        for (const key of edited) {
            if (EVENT_KEYS.some((other) => other !== key && next[other] === next[key])) {
                return NextResponse.json(
                    { error: "High-intent, conversion, and abandon event names must be distinct" },
                    { status: 400 }
                );
            }
        }

        // Anything still colliding is pre-existing state: settings saved before
        // abandonEvent existed can clash with its default. Migrate rather than
        // reject, since non-Pro callers cannot edit event names to repair it
        // themselves and would otherwise lose the free enabled toggle. Edited
        // values are claimed up front so a migration can never overwrite them.
        const editedSet = new Set<(typeof EVENT_KEYS)[number]>(edited);
        const claimed = new Set<string>(edited.map((k) => next[k]));
        for (const key of EVENT_KEYS) {
            if (editedSet.has(key)) continue;
            if (!claimed.has(next[key])) {
                claimed.add(next[key]);
                continue;
            }
            const base = DEFAULT_INTENT_SETTINGS[key];
            let candidate = base;
            let n = 2;
            while (claimed.has(candidate)) candidate = `${base}_${n++}`;
            next[key] = candidate;
            claimed.add(candidate);
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
