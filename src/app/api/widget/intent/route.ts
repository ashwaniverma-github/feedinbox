import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createIntentResponseSchema } from "@/lib/validations";
import { canReceiveIntentResponse } from "@/lib/tiers";
import { readIntentSettings } from "@/lib/intent";
import { resend, FROM_EMAIL } from "@/lib/email";
import NewIntentResponseEmail from "@/emails/new-intent-response";

// POST /api/widget/intent - Public endpoint for the exit-intent card to submit a response
export async function POST(request: Request) {
    try {
        const origin = request.headers.get("origin");
        const body = await request.json();
        const validated = createIntentResponseSchema.safeParse(body);

        if (!validated.success) {
            return corsResponse(
                NextResponse.json(
                    { error: "Validation failed", details: validated.error.flatten() },
                    { status: 400 }
                ),
                origin
            );
        }

        const project = await prisma.project.findUnique({
            where: { widgetKey: validated.data.projectKey },
            select: {
                id: true,
                userId: true,
                name: true,
                settings: true,
                user: { select: { email: true, name: true } },
            },
        });

        if (!project) {
            return corsResponse(
                NextResponse.json({ error: "Invalid project key" }, { status: 404 }),
                origin
            );
        }

        // Ignore submissions when the feature isn't enabled for this project
        const intentSettings = readIntentSettings(project.settings);
        if (!intentSettings.enabled) {
            return corsResponse(
                NextResponse.json({ error: "Exit-intent is not enabled" }, { status: 403 }),
                origin
            );
        }

        // Shared monthly cap with feedback
        const canReceive = await canReceiveIntentResponse(project.userId);
        if (!canReceive.allowed) {
            return corsResponse(
                NextResponse.json(
                    { error: "Monthly response limit reached", code: "RESPONSE_LIMIT_REACHED" },
                    { status: 429 }
                ),
                origin
            );
        }

        const country =
            request.headers.get("x-vercel-ip-country") ||
            request.headers.get("cf-ipcountry") ||
            null;

        const response = await prisma.intentResponse.create({
            data: {
                projectId: project.id,
                sessionId: validated.data.sessionId,
                eventName: validated.data.eventName,
                optionId: validated.data.optionId || null,
                optionLabel: validated.data.optionLabel || null,
                text: validated.data.text || null,
                context: (validated.data.context as Prisma.InputJsonValue) ?? {},
                country,
                pageUrl: validated.data.pageUrl || null,
                userAgent: request.headers.get("user-agent") || null,
            },
        });

        // TEMP (testing): send an instant email per response. The permanent model is
        // the weekly digest (see /api/cron/intent-digest). Remove this block / unset
        // INTENT_INSTANT_EMAIL to go back to digest-only.
        if (process.env.INTENT_INSTANT_EMAIL === "true" && project.user?.email) {
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
            const ctx = (validated.data.context as Record<string, unknown>) || {};
            try {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: project.user.email,
                    subject: `Why-Not-Buy: ${validated.data.optionLabel || "new response"} on ${project.name}`,
                    react: NewIntentResponseEmail({
                        projectName: project.name,
                        ownerName: project.user.name || "there",
                        optionLabel: validated.data.optionLabel,
                        text: validated.data.text,
                        country,
                        plan: typeof ctx.plan === "string" ? ctx.plan : null,
                        pageUrl: validated.data.pageUrl,
                        dashboardUrl: `${baseUrl}/projects/${project.id}?tab=intent`,
                    }),
                });
            } catch (err) {
                console.error("Failed to send instant intent email:", err);
            }
        }

        return corsResponse(
            NextResponse.json({ success: true, id: response.id }, { status: 201 }),
            origin
        );
    } catch (error) {
        console.error("Error creating intent response:", error);
        return corsResponse(
            NextResponse.json({ error: "Failed to submit response" }, { status: 500 }),
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
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
}
