import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { auth } from "@/lib/auth";

type ChangePlanBody = {
    subscription_id: string;
    product_id: string;
    proration_billing_mode?: "prorated_immediately" | "full_immediately" | "difference_immediately";
    quantity?: number;
    addons?: Array<{ addon_id: string; quantity: number }>;
};

/**
 * POST /api/dodo/subscriptions/change-plan
 * Changes an existing subscription to a new product (e.g., monthly ↔ annual).
 * - Proration is applied per proration_billing_mode (default: prorated_immediately)
 * - Actual billing and entitlement updates are confirmed via webhooks
 */
export async function POST(req: Request) {
    try {
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;
        const env = process.env.DODO_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";

        if (!apiKey) {
            return NextResponse.json(
                { error: "Server misconfigured: missing DODO_PAYMENTS_API_KEY" },
                { status: 500 }
            );
        }

        // Require authenticated user before changing plan
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await req.json()) as ChangePlanBody;

        if (!body.subscription_id || !body.product_id) {
            return NextResponse.json(
                { error: "subscription_id and product_id are required" },
                { status: 400 }
            );
        }

        // Enforce product allowlist if configured via env
        const MONTHLY_ID = process.env.DODO_MONTHLY_PRODUCT_ID || null;
        const ANNUAL_ID = process.env.DODO_ANNUAL_PRODUCT_ID || null;
        const LTD_ID =
            process.env.DODO_LTD_PRODUCT_ID ||
            null;

        const allowedProducts = [MONTHLY_ID, ANNUAL_ID, LTD_ID].filter(Boolean) as string[];
        if (allowedProducts.length > 0 && !allowedProducts.includes(body.product_id)) {
            return NextResponse.json(
                { error: "Unknown or disallowed product_id" },
                { status: 400 }
            );
        }

        const client = new DodoPayments({
            bearerToken: apiKey,
            environment: env,
        });

        await client.subscriptions.changePlan(body.subscription_id, {
            product_id: body.product_id,
            proration_billing_mode: body.proration_billing_mode ?? "prorated_immediately",
            quantity: body.quantity ?? 1,
            addons: body.addons,
        } as any);

        // Webhook will finalize DB state, return an immediate ack
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error("Dodo changePlan error", err);
        return NextResponse.json(
            { error: "Failed to change plan", details: err?.message ?? "unknown" },
            { status: 500 }
        );
    }
}