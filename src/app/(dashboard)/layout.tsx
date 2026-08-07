import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

/**
 * Every route in this group requires a session, so the check lives here rather
 * than being repeated in each of them.
 *
 * It is a server check rather than middleware on purpose: the session strategy
 * is database-backed (PrismaAdapter), so the cookie is only a token that has to
 * be looked up. Middleware runs on the Edge runtime, where Prisma cannot, and
 * could therefore only test that a cookie exists, not that it is valid. Doing it
 * here means no dashboard markup is ever sent to someone without a session.
 */
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/");

    return <DashboardShell>{children}</DashboardShell>;
}
