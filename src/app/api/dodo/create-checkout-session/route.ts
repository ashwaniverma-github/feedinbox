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
        const PRODUCT_BY_CADENCE: Record<'monthly' | 'annual' | 'lifetime', string | null> = {
            monthly: process.env.DODO_MONTHLY_PRODUCT_ID || null,
            annual: process.env.DODO_ANNUAL_PRODUCT_ID || null,
            lifetime: process.env.DODO_LTD_PRODUCT_ID || null,
        };

        // Allowlist is built ONLY from configured products; fail closed when empty.
        const allowedProducts = (Object.values(PRODUCT_BY_CADENCE).filter(Boolean)) as string[];
        if (allowedProducts.length === 0) {
            return NextResponse.json(
                { error: 'No products configured. Set DODO_MONTHLY_PRODUCT_ID / DODO_ANNUAL_PRODUCT_ID.' },
                { status: 400 }
            );
        }

        // Validate cadence against the known set (never silently default).
        const rawCadence = body.cadence ?? (body as any)?.metadata?.cadence;
        const cadence: 'monthly' | 'annual' | 'lifetime' | undefined =
            rawCadence === 'monthly' || rawCadence === 'annual' || rawCadence === 'lifetime'
                ? rawCadence
                : undefined;

        // Resolve the product from cadence, or accept an explicit product_id only if
        // it is in the configured allowlist.
        let productId: string | null = null;
        if (cadence) {
            productId = PRODUCT_BY_CADENCE[cadence];
        } else if (body.product_id && allowedProducts.includes(body.product_id)) {
            productId = body.product_id;
        }

        if (!productId || !allowedProducts.includes(productId)) {
            return NextResponse.json(
                { error: 'Invalid or unconfigured plan. Provide a valid cadence (monthly, annual, lifetime) or an allowlisted product_id.' },
                { status: 400 }
            );
        }

        // Derive the cadence to record from the resolved product id.
        const resolvedCadence: 'monthly' | 'annual' | 'lifetime' | undefined =
            productId === PRODUCT_BY_CADENCE.monthly ? 'monthly' :
                productId === PRODUCT_BY_CADENCE.annual ? 'annual' :
                    productId === PRODUCT_BY_CADENCE.lifetime ? 'lifetime' : cadence;
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
                ...(resolvedCadence ? { cadence: resolvedCadence } : {}),
                ...(resolvedCadence ? { plan_cadence: resolvedCadence } : {}),
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