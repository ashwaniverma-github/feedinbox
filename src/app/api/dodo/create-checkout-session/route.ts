import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { auth } from '@/lib/auth';

type CreateCheckoutBody = {
    // Preferred: the client sends a cadence and the server resolves the product id.
    cadence?: 'monthly' | 'annual' | 'lifetime';
    // Optional/legacy: an explicit product id (allowlisted).
    product_id?: string;
    metadata?: Record<string, any>;
    return_url?: string;
};

export async function POST(req: Request) {
    try {
        const apiKey = process.env.DODO_PAYMENTS_API_KEY;
        const env = process.env.DODO_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode';

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Server misconfigured: missing DODO_PAYMENTS_API_KEY' },
                { status: 500 }
            );
        }

        // Require authenticated user before creating a checkout session
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        const client = new DodoPayments({
            bearerToken: apiKey,
            environment: env,
        });

        const body = (await req.json()) as CreateCheckoutBody;

        // Server-side product ids (single source of truth). No NEXT_PUBLIC copies needed.
        const MONTHLY_ID = process.env.DODO_MONTHLY_PRODUCT_ID || null;
        const ANNUAL_ID = process.env.DODO_ANNUAL_PRODUCT_ID || null;
        const LTD_ID = process.env.DODO_LTD_PRODUCT_ID || null;

        // Resolve the product id from the requested cadence (preferred), falling back
        // to an explicit product_id or a cadence in metadata.
        const requestedCadence = body.cadence || (body as any)?.metadata?.cadence;
        let productId = body.product_id || null;
        if (!productId && requestedCadence) {
            productId =
                requestedCadence === 'annual' ? ANNUAL_ID :
                    requestedCadence === 'lifetime' ? LTD_ID :
                        MONTHLY_ID;
        }

        if (!productId) {
            return NextResponse.json(
                { error: 'No product configured for this plan. Set DODO_MONTHLY_PRODUCT_ID / DODO_ANNUAL_PRODUCT_ID.' },
                { status: 400 }
            );
        }

        // Enforce allowlist if any product ids are configured
        const allowedProducts = [MONTHLY_ID, ANNUAL_ID, LTD_ID].filter(Boolean) as string[];
        if (allowedProducts.length > 0 && !allowedProducts.includes(productId)) {
            return NextResponse.json(
                { error: 'Unknown or disallowed product_id' },
                { status: 400 }
            );
        }

        // Derive cadence from product_id or incoming request
        let cadence: 'monthly' | 'annual' | 'lifetime' | undefined;
        if (productId === MONTHLY_ID) cadence = 'monthly';
        else if (productId === ANNUAL_ID) cadence = 'annual';
        else if (productId === LTD_ID) cadence = 'lifetime';
        if (!cadence && requestedCadence) {
            cadence = requestedCadence;
        }
        const baseReturn =
            body.return_url ||
            process.env.DODO_RETURN_URL_BASE ||
            `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;

        const params: any = {
            product_cart: [{ product_id: productId, quantity: 1 }],
            return_url: baseReturn,
            allowed_payment_method_types: ['credit', 'debit'],
            show_saved_payment_methods: true,
            // Attach customer by email to help unify sessions
            ...(session.user?.email
                ? {
                    customer: {
                        email: session.user.email as string,
                        name: (session.user as any).name || undefined,
                    },
                }
                : {}),
            // Enrich metadata with user context
            metadata: {
                ...(body.metadata ?? {}),
                user_id: session.user.id,
                email: session.user?.email ?? null,
                ...(cadence ? { cadence } : {}),
                ...(cadence ? { plan_cadence: cadence } : {}),
            },
        };

        const checkoutSession = await client.checkoutSessions.create(params);

        return NextResponse.json({
            checkout_url:
                (checkoutSession as any).checkout_url ??
                (checkoutSession as any).url ??
                (checkoutSession as any).link ??
                (checkoutSession as any).checkout?.url ??
                (checkoutSession as any).checkout_url,
            session_id: (checkoutSession as any).session_id ?? (checkoutSession as any).id ?? (checkoutSession as any).session_id,
        });
    } catch (err: any) {
        console.error('Dodo create-checkout-session error', err);
        return NextResponse.json(
            { error: 'Failed to create checkout session', details: err?.message ?? 'unknown' },
            { status: 500 }
        );
    }
}