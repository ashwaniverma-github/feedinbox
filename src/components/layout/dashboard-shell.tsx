"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileMenuProvider } from "@/components/layout/mobile-menu-context";

/**
 * Catches the session going away while the tab is open: an expiry, or a sign
 * out in another tab. The layout's server check only runs on navigation, so
 * without this someone could sit on a dashboard they no longer have a session
 * for, watching every request fail with a 401.
 */
function SessionGuard({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.replace("/");
    }, [status, router]);

    // router.replace is an async client navigation, so rendering children here
    // would leave the whole dashboard on screen until it lands, still showing
    // data from the session that just ended. "loading" keeps rendering, since
    // the server layout already proved a session existed and blanking it would
    // flash on every mount.
    if (status === "unauthenticated") return null;

    return <>{children}</>;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <SessionProvider>
            <SessionGuard>
                <MobileMenuProvider
                    isOpen={isMobileMenuOpen}
                    onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
                        <Sidebar
                            isMobileOpen={isMobileMenuOpen}
                            onMobileClose={() => setIsMobileMenuOpen(false)}
                        />
                        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
                    </div>
                </MobileMenuProvider>
            </SessionGuard>
        </SessionProvider>
    );
}
