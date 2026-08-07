import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OnboardingShell } from "@/components/layout/onboarding-shell";

/**
 * Onboarding creates a project against the signed-in user, so it needs the same
 * guard as the dashboard. The page itself only ever acted on
 * status === "authenticated", which left a signed-out visitor sitting on the
 * flow watching each API call fail.
 */
export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/");

    return <OnboardingShell>{children}</OnboardingShell>;
}
