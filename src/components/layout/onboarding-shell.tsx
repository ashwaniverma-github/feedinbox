"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

// Same reasoning as the dashboard shell: the layout's server check only runs on
// navigation, so this covers the session going away while the tab is open.
function SessionGuard({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.replace("/");
    }, [status, router]);

    return <>{children}</>;
}

export function OnboardingShell({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SessionGuard>{children}</SessionGuard>
        </SessionProvider>
    );
}
