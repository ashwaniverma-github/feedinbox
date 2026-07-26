import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/dodo/customer-portal
 * Creates a Dodo customer portal session for the signed-in user and returns its
 * link. The portal lets the customer manage payment methods, view invoices, and
 * cancel/update their subscription. Requires an existing Dodo customer (set on
 * the User by the checkout/webhook flow).
 */
export async function POST() {
    try {
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;
        const env = process.env.DODO_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";

        if (!apiKey) {
            return NextResponse.json(
                { error: "Server misconfigured: missing DODO_PAYMENTS_API_KEY" },
                { status: 500 }
            );
        }

        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { dodoCustomerId: true },
        });

        if (!user?.dodoCustomerId) {
            // No billing account yet (never subscribed). Nothing to manage.
            return NextResponse.json(
                { error: "No billing account found. Upgrade to Pro first." },
                { status: 400 }
            );
        }

        const client = new DodoPayments({ bearerToken: apiKey, environment: env });

        const portal = await client.customers.customerPortal.create(user.dodoCustomerId);

        return NextResponse.json({ url: portal.link });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown";
        console.error("Dodo customer-portal error", err);
        return NextResponse.json(
            { error: "Failed to open billing portal", details: message },
            { status: 500 }
        );
    }
}
