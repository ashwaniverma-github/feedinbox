"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
// import { Sparkles } from "lucide-react"; // LTD removed
import { cn } from "@/lib/utils";

interface PricingSectionProps {
    isLoggedIn?: boolean;
    subscriptionStatus?: string | null;
}

// LTD removed – monthly only
// type BillingPeriod = "monthly" | "annual" | "lifetime";
type BillingPeriod = "monthly" | "annual";

export default function PricingSection({ isLoggedIn = false, subscriptionStatus }: PricingSectionProps) {
    const isProUser = subscriptionStatus === "active";
    const [isLoading, setIsLoading] = useState<BillingPeriod | null>(null);
    /* LTD state & fetch – commented out
    const [ltdRemaining, setLtdRemaining] = useState<number | null>(null);
    const [ltdSoldOut, setLtdSoldOut] = useState(false);

    // Fetch LTD count on mount
    useEffect(() => {
        const fetchLtdCount = async () => {
            try {
                const res = await fetch("/api/ltd-count");
                if (res.ok) {
                    const data = await res.json();
                    setLtdRemaining(data.remaining);
                    setLtdSoldOut(data.soldOut);
                }
            } catch (e) {
                console.error("Failed to fetch LTD count", e);
            }
        };
        fetchLtdCount();
    }, []);
    */

    // Check for pending upgrade intent on mount
    useEffect(() => {
        const checkPendingUpgrade = async () => {
            try {
                const pendingUpgrade = localStorage.getItem("pending_upgrade_intent");
                if (!pendingUpgrade || !isLoggedIn) return;

                const upgradeData = JSON.parse(pendingUpgrade);
                localStorage.removeItem("pending_upgrade_intent");

                // Trigger checkout automatically
                setIsLoading(upgradeData.billingPeriod || "monthly");
                const res = await fetch("/api/dodo/create-checkout-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        product_id: upgradeData.productId,
                        metadata: {
                            plan: "pro",
                            billing_type: "subscription", // LTD removed: was upgradeData.billingPeriod === "lifetime" ? "one_time" : "subscription"
                            cadence: upgradeData.cadence,
                        },
                    }),
                });

                if (!res.ok) {
                    throw new Error("Failed to create checkout session");
                }

                const data = await res.json();
                if (data?.checkout_url) {
                    window.location.href = data.checkout_url;
                }
            } catch (e) {
                console.error("Pending upgrade error", e);
                setIsLoading(null);
            }
        };

        checkPendingUpgrade();
    }, [isLoggedIn]);

    const handleUpgrade = async (billingPeriod: BillingPeriod) => {
        try {
            setIsLoading(billingPeriod);
            const monthly = process.env.NEXT_PUBLIC_DODO_MONTHLY_PRODUCT_ID;
            const annual = process.env.NEXT_PUBLIC_DODO_ANNUAL_PRODUCT_ID;

            let productId: string | undefined;
            let cadence: string;

            if (billingPeriod === "annual") {
                productId = annual;
                cadence = "annual";
            } else {
                productId = monthly;
                cadence = "monthly";
            }

            if (!productId) {
                console.error("Missing Dodo product id environment variables");
                setIsLoading(null);
                return;
            }

            const res = await fetch("/api/dodo/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: productId,
                    metadata: {
                        plan: "pro",
                        billing_type: "subscription", // LTD removed: was billingPeriod === "lifetime" ? "one_time" : "subscription"
                        cadence,
                    },
                }),
            });

            if (res.status === 401) {
                // Store upgrade intent before redirecting to login
                try {
                    localStorage.setItem("pending_upgrade_intent", JSON.stringify({
                        productId,
                        billingPeriod,
                        cadence,
                    }));
                } catch { }

                // Redirect to login with callback to pricing section
                const callback = encodeURIComponent("/#pricing");
                window.location.href = `/login?callbackUrl=${callback}`;
                return;
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({} as any));
                throw new Error(err?.error || "Failed to create checkout session");
            }

            const data = await res.json();
            if (data?.session_id) {
                try {
                    localStorage.setItem("pending_checkout_session_id", data.session_id);
                } catch { }
            }
            if (data?.checkout_url) {
                // Redirect to hosted Dodo checkout
                window.location.href = data.checkout_url as string;
                return;
            }

            throw new Error("checkout_url missing");
        } catch (e) {
            console.error("Upgrade checkout error", e);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <section className="py-24 bg-neutral-50 border-y border-neutral-100" id="pricing">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 mb-6 border border-green-100">
                        <img src="/feedinbox.png" alt="Pro" className="h-3 w-3 rounded-full" />
                        Simple Pricing
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
                        Start free, upgrade when ready.
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        No hidden fees. No surprises. Just simple pricing that scales with you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Free Tier */}
                    <div className="relative rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Free</h3>
                            <p className="text-sm text-neutral-500">Perfect for trying things out</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-neutral-900">$0</span>
                                <span className="text-neutral-500">/forever</span>
                            </div>
                        </div>
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/login"}
                            className="mb-8 flex h-11 w-full items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 hover:border-neutral-300"
                        >
                            {isLoggedIn ? "Go to App" : "Get Started"}
                        </Link>
                        <div className="space-y-4">
                            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Includes:</div>
                            {[
                                "1 project",
                                "20 feedback submissions/month",
                                "Basic email notifications",
                                "Feedinbox branding on widget"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-600">
                                    <Check className="h-4 w-4 text-neutral-400 shrink-0" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Monthly Tier */}
                    <div className="relative rounded-2xl border-2 border-neutral-900 bg-white p-8 shadow-xl">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <div className="rounded-full px-4 py-1 text-xs font-semibold text-white bg-neutral-900">
                                Most Popular
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Pro Monthly</h3>
                            <p className="text-sm text-neutral-500">For serious builders</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-neutral-900">$5</span>
                                <span className="text-neutral-500">/month</span>
                            </div>
                        </div>
                        {isProUser ? (
                            <Link
                                href="/dashboard"
                                className="mb-8 flex h-11 w-full items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition-all hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20"
                            >
                                Go to App
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleUpgrade("monthly")}
                                disabled={isLoading === "monthly"}
                                className="mb-8 flex h-11 w-full items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-all disabled:opacity-50 bg-neutral-900 hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20"
                            >
                                {isLoading === "monthly" ? "Redirecting..." : "Upgrade to Pro"}
                            </button>
                        )}
                        <div className="space-y-4">
                            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Everything in Free, plus:</div>
                            {[
                                "Unlimited projects",
                                "1,000 feedback submissions/month",
                                "Unlimited data retention",
                                "Remove Feedinbox branding",
                                "Customize widgets",
                                "Priority email notifications",
                                "Export to CSV/PDF"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lifetime Tier – commented out
                    <div className="relative rounded-2xl border-2 border-amber-400 bg-white p-8 shadow-xl">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <div className="rounded-full px-4 py-1 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="h-3 w-3" />
                                    Lifetime Deal
                                </span>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Pro Lifetime</h3>
                            <p className="text-sm text-neutral-500">Pay once, own forever</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-neutral-900">$29</span>
                                <span className="text-neutral-500">one-time</span>
                            </div>
                            {ltdRemaining !== null && !ltdSoldOut && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                                        🔥 Only {ltdRemaining} of 50 remaining
                                    </span>
                                </div>
                            )}
                            {ltdSoldOut && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full border border-neutral-200">
                                        Sold Out
                                    </span>
                                </div>
                            )}
                        </div>
                        {isProUser ? (
                            <Link
                                href="/dashboard"
                                className="mb-8 flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-semibold text-white transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-500/20"
                            >
                                Go to App
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleUpgrade("lifetime")}
                                disabled={isLoading === "lifetime" || ltdSoldOut}
                                className="mb-8 flex h-11 w-full items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-all disabled:opacity-50 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-500/20"
                            >
                                {isLoading === "lifetime" ? "Redirecting..." : ltdSoldOut ? "Sold Out" : "Get Lifetime Access"}
                            </button>
                        )}
                        <div className="space-y-4">
                            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Everything in Free, plus:</div>
                            {[
                                "Unlimited projects",
                                "1,000 feedback submissions/month",
                                "Unlimited data retention",
                                "Remove Feedinbox branding",
                                "Customize widgets",
                                "Priority email notifications",
                                "Export to CSV/PDF"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
                                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                    */}
                </div>

                <p className="text-center text-sm text-neutral-500 mt-10">
                    Questions? <a href="mailto:ap8606574@gmail.com" className="text-neutral-900 underline hover:no-underline">Contact us</a>
                </p>
            </div>
        </section>
    );
}
