import { Metadata } from "next";

// The login page itself is a client component and so cannot export metadata.
// It lives here instead, which also gives the sign-in route a proper title and
// canonical rather than falling back to the site default.
export const metadata: Metadata = {
    title: "Sign in",
    description:
        "Sign in to Feedinbox to see why visitors close your pricing modal without buying.",
    alternates: { canonical: "https://feedinbox.com/login" },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
