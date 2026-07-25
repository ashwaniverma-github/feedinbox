import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/tiers";
import { resolveIntentSettingsForWidget } from "@/lib/intent";

// Default widget settings
const DEFAULT_WIDGET_SETTINGS = {
    enabled: true, // show the floating feedback button
    primaryColor: "#171717",
    position: "bottom-right",
    triggerIcon: "chat",
    borderRadius: 16,
    showEmail: true,
    headerText: "Send Feedback",
    hideBranding: false,
};

// GET /api/widget/project - Get project info for widget (includes Pro status and settings)
export async function GET(request: Request) {
    try {
        const origin = request.headers.get("origin");
        const url = new URL(request.url);
        const projectKey = url.searchParams.get("key");

        if (!projectKey) {
            return corsResponse(
                NextResponse.json({ error: "Missing project key" }, { status: 400 }),
                origin
            );
        }

        const project = await prisma.project.findUnique({
            where: { widgetKey: projectKey },
            select: {
                id: true,
                name: true,
                userId: true,
                settings: true,
            },
        });

        if (!project) {
            return corsResponse(
                NextResponse.json({ error: "Invalid project key" }, { status: 404 }),
                origin
            );
        }

        // Record that the widget loaded on the customer's site (install detection).
        // Throttled to at most once per hour. Scheduled with after() so it's guaranteed
        // to run after the response is sent (not killed early in serverless).
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        after(async () => {
            try {
                await prisma.project.updateMany({
                    where: {
                        id: project.id,
                        OR: [{ widgetLastSeenAt: null }, { widgetLastSeenAt: { lt: oneHourAgo } }],
                    },
                    data: { widgetLastSeenAt: new Date() },
                });
            } catch { /* non-fatal */ }
        });

        // Check if project owner is Pro
        const ownerIsPro = await isPro(project.userId);

        // Get widget settings. Appearance customization is Pro-only, but the
        // on/off toggle (`enabled`) is honored for every tier so a user can run
        // Why-Not-Buy without the feedback button (or vice versa).
        const projectSettings = (project.settings as any)?.widget || {};
        const widgetSettings = ownerIsPro
            ? { ...DEFAULT_WIDGET_SETTINGS, ...projectSettings }
            : { ...DEFAULT_WIDGET_SETTINGS };
        widgetSettings.enabled = projectSettings.enabled !== false;

        // hideBranding only works if user is Pro AND has enabled it
        const hideBranding = ownerIsPro && widgetSettings.hideBranding === true;

        // Exit-intent: `enabled` honored for all tiers; customization is Pro-only
        const intentWidget = resolveIntentSettingsForWidget(project.settings, ownerIsPro);

        return corsResponse(
            NextResponse.json({
                projectId: project.id,
                projectName: project.name,
                hideBranding: hideBranding,
                widget: widgetSettings,
                intentWidget: intentWidget,
            }),
            origin
        );
    } catch (error) {
        console.error("Error fetching project info:", error);
        return corsResponse(
            NextResponse.json({ error: "Failed to fetch project info" }, { status: 500 }),
            null
        );
    }
}

export async function OPTIONS(request: Request) {
    const origin = request.headers.get("origin");
    return corsResponse(new NextResponse(null, { status: 204 }), origin);
}

function corsResponse(response: NextResponse, origin: string | null): NextResponse {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
}
