import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { prisma } from "@/lib/prisma";

/**
 * Dodo Payments webhook handler
 * - Verifies signature using DODO_WEBHOOK_KEY
 * - Routes key subscription/payment events
 * - Updates User with Dodo identifiers and subscription status
 *
 * Required env:
 * - DODO_PAYMENTS_API_KEY
 * - DODO_ENVIRONMENT (test_mode | live_mode)
 * - DODO_WEBHOOK_KEY (retrieve via dashboard: Webhooks -> Retrieve secret)
 */
export async function POST(req: Request) {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const env = process.env.DODO_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";
    const webhookKey = process.env.DODO_WEBHOOK_KEY;

    if (!apiKey || !webhookKey) {
        return NextResponse.json(
            { error: "Missing DODO_PAYMENTS_API_KEY or DODO_WEBHOOK_KEY" },
            { status: 500 }
        );
    }

    // Read raw body first (required for signature verification)
    const rawBody = await req.text();

    // Collect Dodo signature headers
    const webhookHeaders = {
        "webhook-id": req.headers.get("webhook-id") || "",
        "webhook-signature": req.headers.get("webhook-signature") || "",
        "webhook-timestamp": req.headers.get("webhook-timestamp") || "",
    };

    try {
        const client = new DodoPayments({
            bearerToken: apiKey,
            environment: env,
            webhookKey,
        });

        // Throws on invalid signature
        const unwrapped: any = client.webhooks.unwrap(rawBody, { headers: webhookHeaders });
        const eventType: string =
            unwrapped?.type ||
            unwrapped?.event ||
            unwrapped?.data?.type ||
            unwrapped?.data?.event ||
            "unknown";

        // Primary object often lives inside data.*
        const data = unwrapped?.data ?? unwrapped ?? {};

        // Attempt to pull customer + subscription details in tolerant way
        const customer =
            data?.customer ??
            data?.subscription?.customer ??
            data?.payment?.customer ??
            data?.customer_details ??
            {};

        const customerEmail: string | undefined =
            customer?.email ?? data?.customer_email ?? data?.payment?.customer?.email ?? data?.subscription?.customer?.email;

        const customerId: string | undefined =
            customer?.customer_id ?? customer?.id ?? data?.customer_id ?? data?.payment?.customer?.customer_id;

        const subscription =
            data?.subscription ?? data?.object ?? (eventType.startsWith("subscription") ? data : undefined);

        const subscriptionId: string | undefined =
            subscription?.subscription_id ?? subscription?.id ?? data?.subscription_id;

        const productId: string | undefined =
            subscription?.product_id ??
            data?.product_id ??
            data?.payment?.product_id ??
            // For one-time payments, product_id might be in different locations
            data?.payload?.product_id ??
            data?.items?.[0]?.product_id ??
            data?.product_cart?.[0]?.product_id ??
            data?.payment?.items?.[0]?.product_id;

        const statusFromPayload: string | undefined =
            subscription?.status ??
            data?.status ??
            (eventType === "payment.succeeded" ? "active" : undefined);

        // Cancellation scheduled for period end (Dodo keeps status "active" until then)
        const cancelAtPeriodEnd: boolean | undefined =
            subscription?.cancel_at_next_billing_date ??
            data?.cancel_at_next_billing_date;

        // End of the currently paid period: expiry when cancelling, otherwise next billing date
        const periodEndRaw: string | undefined =
            subscription?.expires_at ??
            data?.expires_at ??
            subscription?.next_billing_date ??
            data?.next_billing_date;

        // Cadence can be inferred from metadata or derived from known product IDs
        const meta = data?.metadata ?? subscription?.metadata ?? {};
        let cadence: 'monthly' | 'annual' | 'lifetime' | undefined =
            (meta?.cadence as any) ?? (meta?.plan_cadence as any);

        const MONTHLY_ID = process.env.DODO_MONTHLY_PRODUCT_ID || null;
        const ANNUAL_ID = process.env.DODO_ANNUAL_PRODUCT_ID || null;
        const LTD_ENV_ID =
            process.env.DODO_LTD_PRODUCT_ID ||
            null;

        // Derive cadence from product_id when metadata is absent
        if (!cadence && productId) {
            if (MONTHLY_ID && productId === MONTHLY_ID) cadence = 'monthly';
            else if (ANNUAL_ID && productId === ANNUAL_ID) cadence = 'annual';
            else if (LTD_ENV_ID && productId === LTD_ENV_ID) cadence = 'lifetime';
        }

        // Helper to upsert user by email if available; otherwise by Dodo customer id
        async function findUser() {
            if (customerEmail) {
                const byEmail = await prisma.user.findUnique({ where: { email: customerEmail } });
                if (byEmail) return byEmail;
            }
            if (customerId) {
                const byCustomer = await prisma.user.findUnique({ where: { dodoCustomerId: customerId } });
                if (byCustomer) return byCustomer;
            }
            return null;
        }

        const user = await findUser();

        // Map event types to subscription status transitions
        const mapEventToStatus = (evt: string): string | undefined => {
            switch (evt) {
                case "subscription.active":
                case "subscription.renewed":
                case "payment.succeeded":
                    return "active";
                case "subscription.on_hold":
                    return "on_hold";
                case "subscription.cancelled":
                    return "cancelled";
                case "subscription.failed":
                    return "failed";
                case "subscription.expired":
                    return "expired";
                default:
                    // Normalize 'succeeded' status to 'active'
                    if (statusFromPayload === "succeeded") {
                        return "active";
                    }
                    return statusFromPayload;
            }
        };

        const newStatus = mapEventToStatus(eventType);

        // Detect Lifetime Deal purchases (prefer server-only env, fallback to NEXT_PUBLIC)
        const ltdProductId =
            process.env.DODO_LTD_PRODUCT_ID ||
            null;
        // Check if this is an LTD purchase - also check metadata cadence as fallback
        const isLifetimeDeal = (ltdProductId && productId === ltdProductId) || cadence === "lifetime";

        // Debug log for troubleshooting webhook payloads (only in non-live)
        if (env !== "live_mode") {
            console.log("[Dodo Webhook Debug]", {
                eventType,
                productId,
                ltdProductId,
                isLifetimeDeal,
                cadence,
                rawData: JSON.stringify(data).substring(0, 500),
            });
        }

        if (user) {
            const dataUpdate: Record<string, any> = {};
            if (customerId) dataUpdate.dodoCustomerId = customerId;
            if (subscriptionId) dataUpdate.dodoSubscriptionId = subscriptionId;

            // Set product ID - for LTD, use the env var if extraction failed
            if (productId) {
                dataUpdate.dodoProductId = productId;
            } else if (isLifetimeDeal && ltdProductId) {
                dataUpdate.dodoProductId = ltdProductId;
            }

            // Set cadence: 'lifetime' for LTD, otherwise from metadata
            if (isLifetimeDeal) {
                dataUpdate.dodoPlanCadence = "lifetime";
                dataUpdate.dodoSubscriptionStatus = "active";
                // Lifetime never expires or auto-cancels
                dataUpdate.dodoCancelAtPeriodEnd = false;
                dataUpdate.dodoCurrentPeriodEnd = null;
            } else {
                if (cadence) dataUpdate.dodoPlanCadence = cadence;
                if (newStatus) dataUpdate.dodoSubscriptionStatus = newStatus;
                if (typeof cancelAtPeriodEnd === "boolean") {
                    dataUpdate.dodoCancelAtPeriodEnd = cancelAtPeriodEnd;
                }
                if (periodEndRaw) {
                    const periodEnd = new Date(periodEndRaw);
                    if (!isNaN(periodEnd.getTime())) {
                        dataUpdate.dodoCurrentPeriodEnd = periodEnd;
                    }
                }
            }

            if (Object.keys(dataUpdate).length > 0) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: dataUpdate,
                });
            }
        }

        // Optional: emit logs to help with QA in test_mode (only in non-live)
        if (env !== "live_mode") {
            console.log(
                "[Dodo Webhook]",
                JSON.stringify(
                    {
                        type: eventType,
                        email: customerEmail,
                        customerId,
                        subscriptionId,
                        productId,
                        cadence,
                        status: newStatus,
                        receivedAt: new Date().toISOString(),
                    },
                    null,
                    2
                )
            );
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Dodo webhook verification/processing failed:", err?.message || err);
        return NextResponse.json({ error: "Invalid signature or processing error" }, { status: 401 });
    }
}

// Basic GET for health checks (optional)
export async function GET() {
    return NextResponse.json({ ok: true, service: "dodo-webhook" });
}