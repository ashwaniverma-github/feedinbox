"use client";

import { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";
// import { Sparkles } from "lucide-react"; // LTD removed
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// LTD removed – monthly only
// type BillingPeriod = "monthly" | "annual" | "lifetime";
type BillingPeriod = "monthly" | "annual";

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
    const [isLoading, setIsLoading] = useState(false);
    /* LTD state & fetch – commented out
    const [ltdRemaining, setLtdRemaining] = useState<number | null>(null);
    const [ltdSoldOut, setLtdSoldOut] = useState(false);

    // Fetch LTD count when modal opens
    useEffect(() => {
        if (isOpen) {
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
        }
    }, [isOpen]);
    */

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Dogfood Why-Not-Buy: opening the pricing modal is a high-intent signal.
    // Closing it without buying is the abandonment signal that shows the card
    // right away (checkout clicks navigate to Dodo before the modal ever closes,
    // so they never fire a false abandon).
    const wasOpen = useRef(false);
    useEffect(() => {
        const feedinbox = (window as unknown as { feedinbox?: (...args: unknown[]) => void }).feedinbox;
        if (isOpen) {
            feedinbox?.("event", "high_intent", { plan: "pro" });
        } else if (wasOpen.current) {
            feedinbox?.("event", "abandoned", { plan: "pro" });
        }
        wasOpen.current = isOpen;
    }, [isOpen]);

    const handleUpgrade = async () => {
        try {
            setIsLoading(true);
            const cadence = billingPeriod === "annual" ? "annual" : "monthly";

            const res = await fetch("/api/dodo/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cadence,
                    metadata: {
                        plan: "pro",
                        billing_type: "subscription",
                        cadence,
                    },
                }),
            });

            if (res.status === 401) {
                // Not signed in: stash the intent and resume checkout after login,
                // matching pricing-section.tsx's mechanism.
                try {
                    localStorage.setItem(
                        "pending_upgrade_intent",
                        JSON.stringify({ billingPeriod, cadence })
                    );
                } catch { }
                window.location.href = `/login?callbackUrl=${encodeURIComponent("/#pricing")}`;
                return;
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({} as any));
                throw new Error(err?.error || "Failed to create checkout session");
            }

            const data = await res.json();
            if (data?.checkout_url) {
                window.location.href = data.checkout_url as string;
                return;
            }

            throw new Error("checkout_url missing");
        } catch (e) {
            console.error("Upgrade checkout error", e);
        } finally {
            setIsLoading(false);
        }
    };

    const getPrice = () => {
        // Annual is currently unreachable in the UI (toggle button below is
        // commented out), so this branch is dead until that's re-enabled.
        if (billingPeriod === "annual") return "40";
        return "10.99";
    };

    const getPriceLabel = () => {
        if (billingPeriod === "annual") return "/year";
        return "/month";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
                    >
                        <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <img src="/feedinbox.png" alt="Pro" className="h-5 w-5 rounded-full" />
                                    <h2 className="text-lg font-semibold">Upgrade to Pro</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Billing Toggle */}
                                <div className="flex justify-center">
                                    <div className="inline-flex items-center gap-1 rounded-full bg-muted border border-border p-1">
                                        <button
                                            onClick={() => setBillingPeriod("monthly")}
                                            className={cn(
                                                "px-3 py-2 rounded-full text-sm font-medium transition-all",
                                                billingPeriod === "monthly"
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Monthly
                                        </button>
                                        {/* Annual option - temporarily disabled
                                        <button
                                            onClick={() => setBillingPeriod("annual")}
                                            className={cn(
                                                "px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                                                billingPeriod === "annual"
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Annual
                                            <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                                                -$20
                                            </span>
                                        </button>
                                        */}
                                        {/* Lifetime toggle button – commented out
                                        <button
                                            onClick={() => !ltdSoldOut && setBillingPeriod("lifetime")}
                                            disabled={ltdSoldOut}
                                            className={cn(
                                                "px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                                                billingPeriod === "lifetime"
                                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                                                    : ltdSoldOut
                                                        ? "text-muted-foreground/50 cursor-not-allowed"
                                                        : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Lifetime
                                        </button>
                                        */}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="text-center">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold">
                                            ${getPrice()}
                                        </span>
                                        <span className="text-muted-foreground">{getPriceLabel()}</span>
                                    </div>
                                    {/* LTD remaining / sold-out display – commented out
                                    {billingPeriod === "lifetime" && ltdRemaining !== null && (
                                        <p className="mt-2 text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full inline-block">
                                            🔥 Only {ltdRemaining} of 50 remaining
                                        </p>
                                    )}
                                    {billingPeriod === "lifetime" && ltdSoldOut && (
                                        <p className="mt-2 text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full inline-block">
                                            Sold Out
                                        </p>
                                    )}
                                    */}
                                    {/* Annual messaging - temporarily disabled
                                    {billingPeriod === "annual" && (
                                        <p className="mt-1 text-sm text-green-600 font-medium">
                                            Save $20 compared to monthly
                                        </p>
                                    )}
                                    */}
                                </div>

                                {/* Features */}
                                <div className="space-y-3">
                                    {[
                                        "Unlimited projects",
                                        "1,000 responses/month",
                                        "Customize the Why-Not-Buy question & options",
                                        "Customize & unbrand the widget",
                                        "Unlimited data retention",
                                        "Export to CSV/PDF"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <Check className="h-4 w-4 text-green-600 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={handleUpgrade}
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-full font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <img src="/feedinbox.png" alt="Pro" className="h-4 w-4 rounded-full" />
                                            Upgrade Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
