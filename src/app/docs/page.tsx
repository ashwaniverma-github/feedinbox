import { auth } from "@/lib/auth";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";
import { CodeBlock } from "@/components/ui/code-block";
import { getEmbedCode } from "@/lib/snippets";

export const metadata: Metadata = {
    title: "Docs: Install Feedinbox",
    description:
        "How to install Feedinbox: add one script, then fire high_intent and converted events (plus an optional abandoned event) to capture why visitors don't buy. Examples for Next.js, React, and plain HTML.",
    alternates: { canonical: "https://feedinbox.com/docs" },
};

const ORIGIN = "https://feedinbox.com";

const scriptOnly = `<!-- Add before </body> -->
<script>window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}</script>
<script async src="${ORIGIN}/widget.js" data-project-key="YOUR_PROJECT_KEY"></script>`;

const events = `// Fire when a visitor reaches a buying surface
// (opens your pricing modal, starts checkout, clicks "Upgrade")
window.feedinbox('event', 'high_intent', { plan: 'pro' })

// Fire when they close that surface without buying (recommended:
// the most accurate trigger; shows the card right away)
window.feedinbox('event', 'abandoned')

// Fire when they actually buy. This cancels the pending question,
// so people who purchased are never asked.
window.feedinbox('event', 'converted')`;

const reactExample = `function PricingModal() {
  const openPricing = () => {
    setPricingOpen(true)
    // tell Feedinbox this is a high-intent moment
    window.feedinbox('event', 'high_intent', { plan: 'pro' })
  }
  const closePricing = () => {
    setPricingOpen(false)
    // they left without buying: ask why, right now
    window.feedinbox('event', 'abandoned')
  }
  // ...
}`;

const successExample = `// On your payment-success / thank-you step
window.feedinbox('event', 'converted')`;

const nav = [
    { id: "overview", label: "Overview" },
    { id: "install", label: "1. Add the script" },
    { id: "events", label: "2. Fire the events" },
    { id: "where", label: "Where to fire them" },
    { id: "combinations", label: "Feature combinations" },
    { id: "behavior", label: "How the card behaves" },
    { id: "troubleshoot", label: "Troubleshooting" },
    { id: "ai", label: "Install with your AI agent" },
];

export default async function DocsPage() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 pb-24">
                <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
                    {/* TOC */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-28">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
                                On this page
                            </p>
                            <nav className="space-y-1.5 text-sm">
                                {nav.map((n) => (
                                    <a
                                        key={n.id}
                                        href={`#${n.id}`}
                                        className="block text-neutral-600 hover:text-neutral-900 transition-colors"
                                    >
                                        {n.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <article className="max-w-2xl">
                        <p className="text-sm font-semibold text-red-500 mb-2">Docs</p>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Install Feedinbox</h1>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Feedinbox is two features on one script: a <strong>feedback widget</strong> (a
                            floating button) and <strong>Why-Not-Buy</strong> (a one-question card that fires
                            when a visitor abandons your pricing or checkout). You add one script, then fire a
                            few events for the Why-Not-Buy part.
                        </p>

                        {/* Overview */}
                        <Section id="overview" title="Overview">
                            <ol className="list-decimal pl-5 space-y-2 text-neutral-700">
                                <li>Add the script to your site (once). This powers both features.</li>
                                <li>
                                    For Why-Not-Buy, fire a <Code>high_intent</Code> event when a visitor shows
                                    buying intent and a <Code>converted</Code> event when they purchase. Adding an{" "}
                                    <Code>abandoned</Code> event when they leave without buying is optional but
                                    recommended: it gives the card its most accurate timing.
                                </li>
                                <li>Turn each feature on or off from your dashboard. No redeploy needed.</li>
                            </ol>
                            <Callout>
                                The feedback widget needs only the script. Why-Not-Buy needs the script <em>and</em>{" "}
                                the event calls, because the card only fires when you signal intent.
                            </Callout>
                        </Section>

                        {/* Install */}
                        <Section id="install" title="1. Add the script">
                            <p className="text-neutral-700 mb-4">
                                Paste this before the closing <Code>&lt;/body&gt;</Code> tag on your site. Replace{" "}
                                <Code>YOUR_PROJECT_KEY</Code> with your key from{" "}
                                <span className="font-medium">Dashboard → Project → Settings → Project Key</span>.
                            </p>
                            <CodeBlock code={scriptOnly} language="html" filename="Any site" />

                            <h3 className="text-lg font-semibold mt-8 mb-3">Framework snippets</h3>
                            <p className="text-neutral-700 mb-3">Next.js (App Router):</p>
                            <CodeBlock code={getEmbedCode("nextjs", "YOUR_PROJECT_KEY", ORIGIN)} language="typescript" filename="app/layout.tsx" />
                            <p className="text-neutral-700 mb-3 mt-6">React (Vite / CRA):</p>
                            <CodeBlock code={getEmbedCode("react", "YOUR_PROJECT_KEY", ORIGIN)} language="html" filename="public/index.html" />

                            <Callout>
                                <strong>No-code platforms:</strong> use the platform's custom-code slot. Webflow:
                                Project Settings → Custom Code → Footer. Shopify: <Code>theme.liquid</Code> before{" "}
                                <Code>&lt;/body&gt;</Code>. Framer: Site Settings → Custom Code → End of{" "}
                                <Code>&lt;body&gt;</Code>. Google Tag Manager: a Custom HTML tag firing on all pages.
                                The stub line matters: it queues events fired before the script finishes loading.
                            </Callout>
                        </Section>

                        {/* Events */}
                        <Section id="events" title="2. Fire the events (Why-Not-Buy)">
                            <p className="text-neutral-700 mb-4">
                                From your own pricing / checkout code, tell Feedinbox when a visitor shows intent and
                                when they convert:
                            </p>
                            <CodeBlock code={events} language="javascript" filename="Your pricing / checkout code" />
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700 mt-4">
                                <li>
                                    Event names must match your dashboard config. Defaults are{" "}
                                    <Code>high_intent</Code>, <Code>abandoned</Code>, and <Code>converted</Code>{" "}
                                    (Pro can rename them).
                                </li>
                                <li>
                                    <Code>abandoned</Code> is optional but recommended: without it, the card
                                    relies on automatic exit signals (the cursor leaving through the top of the
                                    viewport, or the tab being hidden) and a fallback timer. With it, the card
                                    appears at the exact moment they pass on buying, and readers are never
                                    interrupted mid-scroll.
                                </li>
                                <li>
                                    The <Code>context</Code> object is optional metadata (e.g. <Code>{`{ plan: 'pro' }`}</Code>).
                                    It's shown tagged on each response.
                                </li>
                                <li>
                                    If <Code>converted</Code> fires within the configured delay, the card is
                                    cancelled. This is why firing it accurately matters: it stops you asking buyers.
                                </li>
                            </ul>
                        </Section>

                        {/* Where */}
                        <Section id="where" title="Where to fire them">
                            <p className="text-neutral-700 mb-3">
                                Fire <Code>high_intent</Code> at the exact moment of intent, and{" "}
                                <Code>abandoned</Code> when the same surface is closed without buying. A React
                                example:
                            </p>
                            <CodeBlock code={reactExample} language="javascript" filename="PricingModal.jsx" />
                            <p className="text-neutral-700 mb-3 mt-6">
                                Fire <Code>converted</Code> on your success step (payment confirmed, thank-you page):
                            </p>
                            <CodeBlock code={successExample} language="javascript" filename="success handler" />
                            <Callout>
                                Good <Code>high_intent</Code> moments: pricing modal opens, pricing page loads,
                                checkout starts, "Upgrade" clicked. Good <Code>abandoned</Code> moments: pricing
                                modal closed, checkout cancelled, navigating away from pricing. Good{" "}
                                <Code>converted</Code> moments: payment success callback, subscription-created
                                webhook echoed to the client, thank-you page.
                            </Callout>
                        </Section>

                        {/* Combinations */}
                        <Section id="combinations" title="Feature combinations">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-neutral-200 text-left">
                                            <th className="py-2 pr-4 font-semibold">You want</th>
                                            <th className="py-2 pr-4 font-semibold">Feedback button</th>
                                            <th className="py-2 pr-4 font-semibold">Why-Not-Buy</th>
                                            <th className="py-2 font-semibold">Event calls?</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-neutral-700">
                                        <tr className="border-b border-neutral-100">
                                            <td className="py-2 pr-4">Why-Not-Buy only</td>
                                            <td className="py-2 pr-4">Off</td>
                                            <td className="py-2 pr-4">On</td>
                                            <td className="py-2">Yes</td>
                                        </tr>
                                        <tr className="border-b border-neutral-100">
                                            <td className="py-2 pr-4">Feedback only</td>
                                            <td className="py-2 pr-4">On</td>
                                            <td className="py-2 pr-4">Off</td>
                                            <td className="py-2">No</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4">Both</td>
                                            <td className="py-2 pr-4">On</td>
                                            <td className="py-2 pr-4">On</td>
                                            <td className="py-2">Yes</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-neutral-700 mt-4">
                                Toggle the feedback button in <span className="font-medium">Widget editor</span> and
                                Why-Not-Buy in the <span className="font-medium">Why-Not-Buy tab → Configure</span>.
                                Both toggles are free.
                            </p>
                        </Section>

                        {/* Behavior */}
                        <Section id="behavior" title="How the card behaves">
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                                <li>
                                    After <Code>high_intent</Code>, the card appears on the first exit signal:
                                    your <Code>abandoned</Code> event, the cursor leaving through the top of the
                                    viewport, or the tab being hidden. Visitors who are still reading are left
                                    alone.
                                </li>
                                <li>
                                    If no exit signal fires, a fallback timer (default 30 seconds, configurable)
                                    shows the card anyway. <Code>converted</Code> cancels everything.
                                </li>
                                <li>
                                    You can switch that timer off entirely, so the card waits for a real exit
                                    signal and nobody is interrupted mid-read. Worth knowing: touch devices have
                                    no cursor signal, so with the timer off mobile relies on your{" "}
                                    <Code>abandoned</Code> event or the tab being hidden.
                                </li>
                                <li>
                                    <Code>abandoned</Code> also works on its own: if <Code>high_intent</Code>{" "}
                                    never fired, it arms and shows the card in a single call, so you can wire
                                    just that one event if it suits your flow better.
                                </li>
                                <li>
                                    Once a visitor answers, converts, or dismisses the card, they aren't asked
                                    again for the rest of that session.
                                </li>
                                <li>
                                    Responses land in your dashboard (Why-Not-Buy tab), tagged by plan and country,
                                    plus a weekly summary email.
                                </li>
                            </ul>
                        </Section>

                        {/* Troubleshooting */}
                        <Section id="troubleshoot" title="Troubleshooting">
                            <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                                <li>
                                    <strong>Card never appears:</strong> confirm Why-Not-Buy is enabled, your
                                    event names match the dashboard, and that <Code>converted</Code> isn't firing
                                    too early. If you already answered or dismissed it while testing, clear the{" "}
                                    <Code>feedinbox_intent_</Code> keys from sessionStorage (or use a new tab).
                                </li>
                                <li>
                                    <strong>Buyers get asked:</strong> your <Code>converted</Code> event isn't firing.
                                    Fire it on the real success step.
                                </li>
                                <li>
                                    <strong>Nothing loads:</strong> check the project key and that the script tag is on
                                    the page. Keep the stub line so early events aren't dropped.
                                </li>
                            </ul>
                        </Section>

                        {/* AI */}
                        <Section id="ai" title="Install with your AI agent">
                            <p className="text-neutral-700">
                                Using Cursor, Claude Code, or another AI assistant? Point it at our machine-readable
                                guide and it can add Feedinbox for you:
                            </p>
                            <div className="mt-3">
                                <CodeBlock code={`Read ${ORIGIN}/llms.txt and add Feedinbox Why-Not-Buy to my pricing page. My project key is YOUR_PROJECT_KEY.`} language="text" filename="Prompt for your AI assistant" />
                            </div>
                            <p className="text-neutral-700 mt-4">
                                The guide at{" "}
                                <a href="/llms.txt" className="text-red-500 hover:underline font-medium">/llms.txt</a>{" "}
                                is a complete, plain-text version of this page written for AI agents.
                            </p>
                        </Section>

                        <div className="mt-12 border-t border-neutral-200 pt-8">
                            <Link
                                href={isLoggedIn ? "/dashboard" : "/login"}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
                            >
                                {isLoggedIn ? "Go to dashboard" : "Get your project key"}
                            </Link>
                        </div>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-28 mt-14">
            <h2 className="text-2xl font-bold tracking-tight mb-4">{title}</h2>
            {children}
        </section>
    );
}

function Code({ children }: { children: React.ReactNode }) {
    return (
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.85em] font-mono text-neutral-800">
            {children}
        </code>
    );
}

function Callout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 leading-relaxed">
            {children}
        </div>
    );
}
