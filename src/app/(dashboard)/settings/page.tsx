"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PricingModal } from "@/components/ui/pricing-modal";
import { LogOut, CreditCard, Sparkles } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isPro, setIsPro] = useState<boolean | null>(null);
    const [portalLoading, setPortalLoading] = useState(false);
    const [portalError, setPortalError] = useState<string | null>(null);
    const [pricingOpen, setPricingOpen] = useState(false);

    useEffect(() => {
        let active = true;
        fetch("/api/usage")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (active && data) setIsPro(!!data.isPro);
            })
            .catch(() => {
                if (active) setIsPro(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const openBillingPortal = async () => {
        setPortalError(null);
        setPortalLoading(true);
        // Open the tab synchronously inside the click handler so popup blockers
        // don't kill it after the async fetch resolves.
        const tab = window.open("about:blank", "_blank");
        try {
            const res = await fetch("/api/dodo/customer-portal", { method: "POST" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.url) {
                throw new Error(data?.error || "Could not open the billing portal.");
            }
            if (tab) {
                tab.location.href = data.url as string;
            } else {
                // Popup was blocked: fall back to navigating the current tab.
                window.location.href = data.url as string;
            }
        } catch (e) {
            if (tab) tab.close();
            setPortalError(e instanceof Error ? e.message : "Could not open the billing portal.");
        } finally {
            setPortalLoading(false);
        }
    };

    return (
        <>
            <Header title="Settings" description="Manage your account" />

            <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-8">
                {/* Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={session?.user?.image}
                                name={session?.user?.name}
                                size="lg"
                            />
                            <div>
                                <p className="font-medium">{session?.user?.name}</p>
                                <p className="text-sm text-neutral-500">{session?.user?.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Billing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Billing</CardTitle>
                        <CardDescription>
                            {isPro
                                ? "Manage your subscription, payment method, and invoices."
                                : "You're on the Free plan. Upgrade to unlock Pro features."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isPro ? (
                            <Button
                                variant="secondary"
                                onClick={openBillingPortal}
                                disabled={portalLoading}
                            >
                                {portalLoading ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                        Opening...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Manage billing
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button onClick={() => setPricingOpen(true)} disabled={isPro === null}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                            </Button>
                        )}
                        {portalError && (
                            <p role="alert" className="text-sm text-red-600">
                                {portalError}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Sign Out */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session</CardTitle>
                        <CardDescription>Manage your session</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="secondary"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
        </>
    );
}
