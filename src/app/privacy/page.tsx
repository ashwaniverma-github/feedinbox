import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "How Feedinbox handles account data, feedback submissions, and Why-Not-Buy responses. No IP addresses stored, no tracking cookies, no data selling.",
    alternates: { canonical: "https://feedinbox.com/privacy" },
};

// Fixed effective date. Never derive this from new Date(): a legal document
// that always claims to have been updated today is meaningless. Bump it when
// the policy actually changes.
const LAST_UPDATED = "28 July 2026";

export default function PrivacyPage() {
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

                <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
                <p className="mb-10 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                    Feedinbox asks a website&apos;s visitors one question when they leave without buying,
                    and collects general product feedback. This policy explains what we collect, why, and
                    what we deliberately do not collect.
                </p>

                <Section title="1. Two different groups of people">
                    <P>This policy covers two relationships, and they work differently:</P>
                    <List>
                        <li>
                            <B>Customers.</B> You sign up, create a project, and install our script. We are
                            the controller of your account data.
                        </li>
                        <li>
                            <B>Visitors to a customer&apos;s website.</B> If you saw a Feedinbox question on
                            someone else&apos;s site, we process that response on their behalf as a
                            processor. That site&apos;s own privacy policy governs the relationship, and
                            requests to access or delete a response should go to them. We will help them
                            action it.
                        </li>
                    </List>
                </Section>

                <Section title="2. What we collect">
                    <P>
                        <B>Account information.</B> You sign in with Google. We receive your name, email
                        address, and profile image. We never receive or store your Google password.
                    </P>
                    <P>
                        <B>Project settings.</B> The project name, optional domain, your widget key, and
                        your configuration: question wording, answer options, timing, and notification
                        preference.
                    </P>
                    <P>
                        <B>Feedback submissions.</B> The message, the chosen category, an optional email
                        address if the visitor supplies one, the page URL it was sent from, and the browser
                        user agent string.
                    </P>
                    <P>
                        <B>Why-Not-Buy responses.</B> The selected reason, any optional free text, whatever
                        context you choose to attach in your own code (for example the plan being viewed),
                        a two-letter country code, the page URL, the browser user agent, and a random
                        session identifier used to avoid asking the same person twice.
                    </P>
                    <P>
                        <B>Billing information.</B> Payments are processed by Dodo Payments, acting as
                        merchant of record. We store only your customer and subscription identifiers, your
                        plan, its status, and the current period end date.{" "}
                        <B>We never see or store card numbers.</B>
                    </P>
                </Section>

                <Section title="3. What we do not collect">
                    <List>
                        <li>
                            <B>No IP addresses.</B> Country is derived from a network header at the edge and
                            only the two-letter country code is saved. The IP address itself is never
                            written to our database.
                        </li>
                        <li>
                            <B>No tracking cookies.</B> The widget sets no cookies at all.
                        </li>
                        <li>
                            <B>No cross-site tracking or fingerprinting.</B> The widget cannot follow anyone
                            between different customers&apos; websites.
                        </li>
                        <li>
                            <B>No advertising networks, and no selling or renting of data.</B> Ever.
                        </li>
                    </List>
                </Section>

                <Section title="4. What the widget stores in a visitor's browser">
                    <P>
                        The widget uses <Code>sessionStorage</Code>, not cookies. It writes three
                        short-lived keys, all prefixed <Code>feedinbox_</Code>: a random session id, and
                        flags recording that the question was already answered or dismissed. Their only
                        purpose is to avoid asking the same person the same question twice.
                    </P>
                    <P>
                        Because this is <Code>sessionStorage</Code>, the browser discards all of it when the
                        tab is closed. Nothing persists across sessions or across sites.
                    </P>
                </Section>

                <Section title="5. How we use information">
                    <List>
                        <li>To run the service and show you responses in your dashboard.</li>
                        <li>
                            To email you according to the preference you set per project: one email per
                            response, a weekly digest, or none at all.
                        </li>
                        <li>To process payments and manage subscriptions.</li>
                        <li>To respond to support requests.</li>
                        <li>To diagnose faults and keep the service secure and reliable.</li>
                    </List>
                    <P>
                        We do not use your feedback content or Why-Not-Buy responses to train machine
                        learning models.
                    </P>
                </Section>

                <Section title="6. Who we share it with">
                    <P>
                        We use a small number of infrastructure providers, and only to deliver the service:
                    </P>
                    <List>
                        <li>
                            <B>Vercel</B> for hosting and delivery.
                        </li>
                        <li>
                            <B>Supabase</B> for the database that stores your account, projects, and
                            responses.
                        </li>
                        <li>
                            <B>Resend</B> for sending notification and digest emails.
                        </li>
                        <li>
                            <B>Dodo Payments</B> for checkout, subscriptions, and invoicing.
                        </li>
                        <li>
                            <B>Google</B> for sign-in only.
                        </li>
                    </List>
                    <P>
                        We may also disclose information where legally required, or as part of a merger or
                        acquisition, in which case we will tell you before your data becomes subject to a
                        different policy.
                    </P>
                </Section>

                <Section title="7. Retention and deletion">
                    <P>
                        We keep data until you delete it or close your account. Deleting a project
                        permanently deletes every feedback submission and Why-Not-Buy response belonging to
                        it, immediately and irreversibly.
                    </P>
                    <P>
                        To delete your entire account and everything in it, email us at{" "}
                        <A href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</A> and we will action it.
                        Backups may retain copies for a short period before being rotated out.
                    </P>
                </Section>

                <Section title="8. Your rights">
                    <P>
                        Depending on where you live, you may have the right to access, correct, export, or
                        delete your personal data, and to object to certain processing. You can view
                        everything in your dashboard at any time, and export responses to CSV or PDF on a
                        Pro plan. For anything you cannot do yourself, email us and we will help.
                    </P>
                    <P>
                        If you are a visitor who answered a question on someone else&apos;s website, please
                        contact that website&apos;s owner, since the data belongs to them.
                    </P>
                </Section>

                <Section title="9. Security">
                    <P>
                        Data is transmitted over HTTPS and stored on managed infrastructure with access
                        restricted to what is needed to operate the service. No system is perfectly secure,
                        so we aim to collect as little as possible in the first place, which is why we do
                        not store IP addresses or set cookies.
                    </P>
                </Section>

                <Section title="10. Children">
                    <P>
                        Feedinbox is a tool for businesses and is not directed at children under 13. We do
                        not knowingly collect their personal information.
                    </P>
                </Section>

                <Section title="11. Changes to this policy">
                    <P>
                        We may update this policy as the product changes. Any update is reflected in the
                        date at the top of this page, and significant changes will be communicated by
                        email.
                    </P>
                </Section>

                <Section title="12. Contact">
                    <P>
                        Questions about this policy or about your data:{" "}
                        <A href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</A>.
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

function Code({ children }: { children: React.ReactNode }) {
    return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
            {children}
        </code>
    );
}
