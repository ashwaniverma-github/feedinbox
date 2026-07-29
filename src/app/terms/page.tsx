import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "The terms covering your use of Feedinbox: accounts, plans and billing, usage limits, your responsibilities when installing the widget, and data ownership.",
    alternates: { canonical: "https://feedinbox.com/terms" },
};

// Fixed effective date. Never derive this from new Date(): a legal document
// that always claims to have been updated today is meaningless. Bump it when
// the terms actually change.
const LAST_UPDATED = "28 July 2026";

const CONTACT_EMAIL = "ap8606574@gmail.com";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
                <p className="mb-10 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                    These terms cover your use of Feedinbox. By creating an account or installing our
                    script on a website, you agree to them. If you are agreeing on behalf of a company,
                    you confirm you are authorised to do so.
                </p>

                <Section title="1. What the service does">
                    <P>
                        Feedinbox provides an embeddable script with two features. The first, Why-Not-Buy,
                        shows a one-question card when a visitor abandons a buying surface such as a
                        pricing modal, and records the reason. The second is a feedback widget for bug
                        reports, ideas, and questions. Both are configured from your dashboard, and
                        responses are shown there and delivered by email according to your preference.
                    </P>
                </Section>

                <Section title="2. Accounts">
                    <P>
                        You sign in with Google. You are responsible for activity under your account and
                        for keeping access to your Google account secure. You must provide accurate
                        information and be at least 13 years old. One person or entity per account.
                    </P>
                </Section>

                <Section title="3. Plans, billing, and cancellation">
                    <P>
                        Feedinbox has a free plan and a paid Pro plan. Payments are handled by Dodo
                        Payments, which acts as merchant of record and whose own terms apply to the
                        transaction itself. Subscriptions renew automatically until cancelled.
                    </P>
                    <P>
                        You can cancel at any time from the billing portal linked in your account settings.
                        Cancellation takes effect at the end of the period you have already paid for, and
                        you keep Pro access until then. We do not provide automatic pro-rated refunds for
                        partial periods, but if something has gone wrong, email us and we will sort it out.
                    </P>
                    <P>
                        We may change pricing. Existing subscribers will be told by email before a change
                        affects their renewal.
                    </P>
                </Section>

                <Section title="4. Usage limits">
                    <P>
                        The free plan includes one project and 20 responses per month. Pro includes
                        unlimited projects and 1,000 responses per month. That monthly allowance is shared
                        across feedback submissions and Why-Not-Buy responses combined. Once you reach the
                        limit, further submissions are not recorded until the next calendar month.
                    </P>
                </Section>

                <Section title="5. Your responsibilities when installing the widget">
                    <P>
                        This section matters most, because you decide what the widget asks and where it
                        runs. You are responsible for:
                    </P>
                    <List>
                        <li>
                            Having a lawful basis to collect responses from your visitors, and disclosing
                            the use of Feedinbox in your own privacy policy.
                        </li>
                        <li>
                            Obtaining consent where the law requires it in your jurisdiction or your
                            visitors&apos;.
                        </li>
                        <li>
                            <B>Not configuring the widget to collect sensitive personal data</B>, such as
                            health, financial, biometric, or government identifiers, and not attaching such
                            data as event context.
                        </li>
                        <li>Only installing the script on websites you own or are authorised to modify.</li>
                        <li>
                            Responding to your own visitors&apos; privacy requests, since that data belongs
                            to you.
                        </li>
                    </List>
                </Section>

                <Section title="6. Acceptable use">
                    <P>You agree not to:</P>
                    <List>
                        <li>Use the service for anything unlawful, deceptive, or harmful.</li>
                        <li>
                            Attempt to breach or probe our security, access other customers&apos; data, or
                            disrupt the service.
                        </li>
                        <li>
                            Circumvent plan limits, for instance by spreading one site across multiple
                            accounts.
                        </li>
                        <li>
                            Resell or white-label the service without our written agreement. Removing our
                            branding on a Pro plan is permitted and is not resale.
                        </li>
                        <li>Send automated or artificial submissions to inflate or pollute the data.</li>
                    </List>
                </Section>

                <Section title="7. Your data">
                    <P>
                        <B>You own your data.</B> The feedback and Why-Not-Buy responses collected through
                        your projects are yours. You grant us only the permission needed to store, process,
                        and display that data in order to provide the service to you.
                    </P>
                    <P>
                        You can export your responses at any time on a Pro plan, and delete a project to
                        permanently remove everything in it. How we handle data is described in our{" "}
                        <Link
                            href="/privacy"
                            className="font-medium text-primary underline underline-offset-2"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </P>
                </Section>

                <Section title="8. Our intellectual property">
                    <P>
                        The service, including the widget script, dashboard, and brand, remains our
                        property. These terms grant you a limited, non-exclusive, revocable right to use it
                        while your account is active, and nothing more.
                    </P>
                </Section>

                <Section title="9. Availability and warranties">
                    <P>
                        We work to keep Feedinbox available and reliable, but the service is provided
                        &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
                        uninterrupted availability, that every submission will be captured, or that every
                        notification email will arrive, since delivery depends on providers outside our
                        control.
                    </P>
                </Section>

                <Section title="10. Limitation of liability">
                    <P>
                        To the maximum extent permitted by law, we are not liable for indirect, incidental,
                        special, or consequential damages, including lost profits, lost revenue, or lost
                        data. Our total liability for any claim is limited to the amount you paid us in the
                        twelve months before the claim arose.
                    </P>
                </Section>

                <Section title="11. Termination">
                    <P>
                        You may stop using the service and delete your account at any time. We may suspend
                        or terminate an account that breaches these terms, and will give notice and a
                        chance to fix the problem where it is reasonable to do so. If we discontinue the
                        service entirely, we will give you reasonable notice and an opportunity to export
                        your data.
                    </P>
                </Section>

                <Section title="12. Changes to these terms">
                    <P>
                        We may update these terms as the product evolves. Any update is reflected in the
                        date at the top of this page, and material changes will be communicated by email
                        before they take effect. Continuing to use the service after that means you accept
                        the revised terms.
                    </P>
                </Section>

                <Section title="13. Governing law">
                    <P>
                        These terms are governed by the laws of India, and the courts of India have
                        exclusive jurisdiction over any dispute, without regard to conflict of law rules.
                    </P>
                </Section>

                <Section title="14. Contact">
                    <P>
                        Questions about these terms:{" "}
                        <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
                    </P>
                </Section>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return <p className="leading-relaxed text-muted-foreground">{children}</p>;
}

function List({ children }: { children: React.ReactNode }) {
    return (
        <ul className="list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">{children}</ul>
    );
}

function B({ children }: { children: React.ReactNode }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} className="font-medium text-primary underline underline-offset-2">
            {children}
        </a>
    );
}
