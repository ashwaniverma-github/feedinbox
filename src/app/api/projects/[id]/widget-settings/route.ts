import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/tiers";

// Widget settings schema
interface WidgetSettings {
    enabled: boolean;
    primaryColor: string;
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    triggerIcon: "chat" | "feedback" | "question" | "lightbulb" | "star";
    borderRadius: number;
    showEmail: boolean;
    headerText: string;
    hideBranding: boolean;
}

const DEFAULT_SETTINGS: WidgetSettings = {
    enabled: true,
    primaryColor: "#171717",
    position: "bottom-right",
    triggerIcon: "chat",
    borderRadius: 16,
    showEmail: true,
    headerText: "Send Feedback",
    hideBranding: false,
};

// GET /api/projects/[id]/widget-settings - Get widget settings
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

        const settings = (project.settings as any)?.widget || DEFAULT_SETTINGS;
        const userIsPro = await isPro(session.user.id);

        return NextResponse.json({
            settings: { ...DEFAULT_SETTINGS, ...settings },
            isPro: userIsPro,
        });
    } catch (error) {
        console.error("Error fetching widget settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch widget settings" },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id]/widget-settings - Update widget settings (Pro only)
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

        const userIsPro = await isPro(session.user.id);

        const project = await prisma.project.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const body = await request.json();
        const newSettings: Partial<WidgetSettings> = {};

        // enabled (show/hide the feedback button) is allowed for any tier
        if (typeof body.enabled === "boolean") {
            newSettings.enabled = body.enabled;
        }

        // Appearance customization is Pro-only. Non-Pro edits to these are ignored.
        if (!userIsPro) {
            const existingSettings = (project.settings as any) || {};
            const updatedSettings = {
                ...existingSettings,
                widget: { ...DEFAULT_SETTINGS, ...existingSettings.widget, ...newSettings },
            };
            await prisma.project.update({ where: { id }, data: { settings: updatedSettings } });
            return NextResponse.json({ success: true, settings: updatedSettings.widget });
        }

        // Validate and sanitize input
        if (body.primaryColor && /^#[0-9A-Fa-f]{6}$/.test(body.primaryColor)) {
            newSettings.primaryColor = body.primaryColor;
        }
        if (["bottom-right", "bottom-left", "top-right", "top-left"].includes(body.position)) {
            newSettings.position = body.position;
        }
        if (["chat", "feedback", "question", "lightbulb", "star"].includes(body.triggerIcon)) {
            newSettings.triggerIcon = body.triggerIcon;
        }
        if (typeof body.borderRadius === "number" && body.borderRadius >= 0 && body.borderRadius <= 24) {
            newSettings.borderRadius = body.borderRadius;
        }
        if (typeof body.showEmail === "boolean") {
            newSettings.showEmail = body.showEmail;
        }
        if (typeof body.headerText === "string" && body.headerText.length <= 50) {
            newSettings.headerText = body.headerText;
        }
        if (typeof body.hideBranding === "boolean") {
            newSettings.hideBranding = body.hideBranding;
        }

        // Merge with existing settings
        const existingSettings = (project.settings as any) || {};
        const updatedSettings = {
            ...existingSettings,
            widget: { ...DEFAULT_SETTINGS, ...existingSettings.widget, ...newSettings },
        };

        await prisma.project.update({
            where: { id },
            data: { settings: updatedSettings },
        });

        return NextResponse.json({
            success: true,
            settings: updatedSettings.widget,
        });
    } catch (error) {
        console.error("Error updating widget settings:", error);
        return NextResponse.json(
            { error: "Failed to update widget settings" },
            { status: 500 }
        );
    }
}
