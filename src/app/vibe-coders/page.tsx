import { auth } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, RotateCw, Sparkles, Terminal, X } from "lucide-react";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";
import { CodeBlock } from "@/components/ui/code-block";
import AnswerTranslator from "@/components/vibe-coders/answer-translator";

const ORIGIN = "https://feedinbox.com";

export const metadata: Metadata = {
    title: "For vibe coders: find out why nobody is buying",
    description:
        "You can ship a fix in an afternoon. You just don't know which fix. Feedinbox asks visitors who close your pricing what stopped them, and hands you the answer as a prompt you can paste straight into Cursor, Claude Code, or Lovable.",
    keywords: [
        "vibe coding",
        "vibe coders",
        "first customer",
        "why nobody buys my saas",
        "indie hacker feedback",
        "ai coding agent",
        "cursor",
        "lovable",
        "no sales after launch",
    ],
    alternates: { canonical: `${ORIGIN}/vibe-coders` },
    // openGraph and twitter are replaced wholesale by the page, not deep-merged
    // into the root layout's, so every field this page needs has to be repeated
    // here. Leaving `images` out is what silently drops the social card image.
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Feedinbox",
        title: "For vibe coders: find out why nobody is buying",
        description:
            "Shipping was never the problem. Knowing what to ship is. Feedinbox asks the visitors who leave your pricing why, and turns the answer into your next prompt.",
        url: `${ORIGIN}/vibe-coders`,
        images: [
            {
                // Keep ?v=N in step with the root layout: it is the cache-buster
                // social scrapers key their stored preview on.
                url: "/OG.png?v=3",
                width: 1917,
                height: 961,
                alt: "Feedinbox: find out why visitors close your pricing without buying",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "For vibe coders: find out why nobody is buying",
        description:
            "Shipping was never the problem. Knowing what to ship is. Feedinbox asks the visitors who leave your pricing why, and turns the answer into your next prompt.",
        images: ["/OG.png?v=3"],
    },
};

/**
 * The setup prompt, kept deliberately faithful to the one the dashboard
 * generates (see components/dashboard/ai-setup-prompt.tsx). Shortened for
 * reading on a marketing page, but every instruction here is real: a visitor
 * who copies this and swaps in their key gets a working integration.
 *
 * If the event contract changes, change it in both places.
 */
const setupPrompt = `Read ${ORIGIN}/llms.txt (the Feedinbox integration guide) and integrate
Feedinbox into my app. Detect my framework and use the right approach.

Project key: YOUR_PROJECT_KEY

1. Add the widget script with data-project-key="YOUR_PROJECT_KEY",
   including the queue stub line before it.
2. Fire high_intent when someone opens pricing or starts checkout.
3. Fire abandoned from the close button of that pricing modal or
   checkout, so the question appears right then.
4. Fire converted on my payment-success step, so buyers are never asked.
5. Call window.feedinbox('cancel') when someone clicks Sign in or Sign up
   from pricing: they are moving forward, not leaving.`;

const scriptOnly = `<!-- Add before </body> -->
<script>window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}</script>
<script async src="${ORIGIN}/widget.js" data-project-key="YOUR_PROJECT_KEY"></script>`;

const guessingLoop = [
    "Sixty people land on your site",
    "Seven open your pricing",
    "All seven close it",
    "You guess: price? copy? one more feature?",
    "You spend the weekend rebuilding",
];

const answerLine = [
    "Sixty people land on your site",
    "Seven open your pricing",
    "All seven close it, and each one is asked why",
    "Five of them say the same thing",
    "You paste that into your agent and fix it",
];

const agents = [
    "Cursor",
    "Claude Code",
    "GitHub Copilot",
    "Windsurf",
    "Lovable",
    "v0",
    "Bolt",
    "Replit",
];

const faqs = [
    {
        q: "I only get about 30 visitors a day. Is that even enough?",
        a: "You are not looking for statistical significance, you are looking for a sentence. Five people picking the same answer is enough to know what to change next. Low traffic is exactly when guessing hurts most, because you cannot afford to spend a weekend rebuilding the wrong thing.",
    },
    {
        q: "Is this just analytics?",
        a: "Analytics tells you seven people opened your pricing and none of them bought. That is the part you already know. Feedinbox gives you the sentence that comes after it, in the visitor's own words.",
    },
    {
        q: "I built my app with Lovable, Bolt, v0, or Replit. Will it work?",
        a: "Yes. If you can add a script tag to your page, it works. The setup prompt reads our integration guide, detects your framework, and wires up the events for you, so you do not need to know how any of it works.",
    },
    {
        q: "I do not have a pricing modal, just a Stripe payment link.",
        a: "Fire the high_intent event when someone clicks the button that sends them to Stripe. That arms the question. From there it appears on its own: the widget watches for the pointer heading out through the top of the window, for the tab going hidden, and falls back to a timer if neither happens. Firing an abandoned event from your own cancel or back action just makes the timing sharper.",
    },
    {
        q: "Will this annoy the visitors I worked so hard to get?",
        a: "It is one question with tappable answers, no email field, and it appears at most once per visit. Answer it, dismiss it, or buy, and it is done for that session. Anyone who actually buys never sees it at all, because your payment-success step fires the converted event and cancels the question.",
    },
    {
        q: "I have not launched yet. Should I add it now?",
        a: "Add it before you post. Launch traffic is the most expensive attention you will ever get and it arrives once. Installing afterwards means the spike came and went and you learned nothing from it.",
    },
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
        },
    })),
};

export default async function VibeCodersPage() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar isLoggedIn={isLoggedIn} />

            {/* Hero. `isolate` scopes the decorative background layers to this
                section, the same way the landing hero does. */}
            <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
                    <div className="fi-orb absolute -left-32 -top-24 h-[28rem] w-[28rem] bg-red-400/25" />
                    <div className="fi-orb fi-orb-slow absolute -right-32 top-10 h-[26rem] w-[26rem] bg-amber-300/25" />
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 fi-grid" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 fi-glow" />

                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur">
                        <Sparkles className="h-3.5 w-3.5 text-red-500" />
                        For people who build with AI
                    </div>

                    <h1 className="font-heading mt-8 text-[clamp(2rem,7.5vw,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-neutral-900">
                        Shipping was never
                        <br />
                        your problem.
                        <br />
                        <span className="text-red-500">Knowing what to ship is.</span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
                        You launched. People came. Nobody paid, and not one of them told you why.
                        Feedinbox catches visitors the moment they close your pricing and asks them
                        one question, so your next prompt fixes the real reason instead of a guess.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/login"}
                            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-base font-semibold text-white shadow-lg shadow-neutral-900/15 transition-all hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/25 sm:w-auto"
                        >
                            {isLoggedIn ? "Go to App" : "Start for free"}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <a
                            href="#setup"
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-base font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50 sm:w-auto"
                        >
                            See the one-prompt setup
                        </a>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500">
                        {["Your agent installs it", "Free tier, no credit card", "One script tag"].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The loop. The signature idea of this page: your build speed is not
                the bottleneck, so a faster lap around the same loop changes nothing. */}
            <section className="py-24 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 mb-6 border border-red-100">
                            <RotateCw className="h-3 w-3" />
                            The loop
                        </div>
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
                            You can ship a fix in an afternoon.
                            <br className="hidden sm:block" /> You just don&apos;t know which fix.
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            Say you posted your launch and sixty people showed up. Here is how that
                            day goes twice: once with no answers, and once with them.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                        {/* Without: the steps loop back to the top */}
                        <div className="relative rounded-2xl border border-neutral-200 bg-white p-7">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <RotateCw className="h-4 w-4" />
                                </div>
                                <h3 className="font-semibold text-neutral-900">Guessing</h3>
                            </div>
                            <ol className="space-y-3">
                                {guessingLoop.map((step, i) => (
                                    <li key={step} className="flex gap-3 text-sm text-neutral-700">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-500">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-sm font-medium text-red-600">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50">
                                        <RotateCw className="h-3 w-3" />
                                    </span>
                                    Back to step 1
                                </li>
                            </ol>
                            <p className="mt-6 border-t border-neutral-100 pt-5 text-sm text-neutral-500">
                                Every lap costs you a weekend and teaches you nothing. The code got
                                better. The reason nobody bought is still unknown.
                            </p>
                        </div>

                        {/* With: the same steps, but the last one lands somewhere */}
                        <div className="relative rounded-2xl border-2 border-neutral-900 bg-white p-7 shadow-xl">
                            <div className="absolute -top-3 left-7">
                                <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                                    With Feedinbox
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                    <Check className="h-4 w-4" />
                                </div>
                                <h3 className="font-semibold text-neutral-900">Knowing</h3>
                            </div>
                            <ol className="space-y-3">
                                {answerLine.map((step, i) => (
                                    <li key={step} className="flex gap-3 text-sm text-neutral-700">
                                        <span
                                            className={
                                                i >= 2
                                                    ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white"
                                                    : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-500"
                                            }
                                        >
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-sm font-medium text-green-700">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    No step 6
                                </li>
                            </ol>
                            <p className="mt-6 border-t border-neutral-100 pt-5 text-sm text-neutral-600">
                                Same weekend, same build speed. The difference is that the thing you
                                built was aimed at what was actually stopping them.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Setup. The strongest argument for this audience: they never touch it. */}
            <section id="setup" className="py-24 scroll-mt-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 mb-6 border border-red-100">
                            <Terminal className="h-3 w-3" />
                            Setup
                        </div>
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
                            You don&apos;t install it. Your agent does.
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            We publish a plain-text integration guide written for AI agents at{" "}
                            <a
                                href={`${ORIGIN}/llms.txt`}
                                target="_blank"
                                rel="noopener"
                                className="font-medium text-neutral-900 underline underline-offset-4 hover:no-underline"
                            >
                                feedinbox.com/llms.txt
                            </a>
                            . Paste this into whatever you build with. It reads the guide, finds your
                            pricing code, and wires up the rest.
                        </p>
                    </div>

                    <CodeBlock code={setupPrompt} language="text" filename="Prompt for your AI assistant" />

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        {agents.map((agent) => (
                            <span
                                key={agent}
                                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600"
                            >
                                {agent}
                            </span>
                        ))}
                        <span className="px-1 text-xs text-neutral-400">or anything else that edits your code</span>
                    </div>

                    <p className="mt-8 text-center text-sm text-neutral-500">
                        Your dashboard gives you this same prompt with your project key already in it.
                    </p>

                    <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                        <h3 className="font-semibold text-neutral-900 mb-1">
                            Rather do it yourself? It is one script tag.
                        </h3>
                        <p className="text-sm text-neutral-600 mb-5">
                            This alone turns on the floating feedback widget. Add the four events from
                            the prompt above and you get the Why-Not-Buy question too.
                        </p>
                        <CodeBlock code={scriptOnly} language="html" filename="index.html" />
                        <p className="mt-4 text-sm text-neutral-500">
                            Full instructions live in the{" "}
                            <Link href="/docs" className="font-medium text-neutral-900 underline underline-offset-4 hover:no-underline">
                                docs
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>

            {/* The interactive part: an answer is only worth having if you know
                what it turns into. For this audience, it turns into a prompt. */}
            <section className="py-24 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
                            Every answer has a next move.
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            Four options, four different things to do about them. One of them means
                            you should do nothing at all.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <AnswerTranslator />
                    </div>

                    <p className="mt-10 text-center text-sm text-neutral-500 max-w-2xl mx-auto">
                        On Pro you can rewrite the question and the options to match your product, so
                        the answers come back in the shape of decisions you actually have to make.
                    </p>
                </div>
            </section>

            {/* Price, stated plainly. This audience has not made a dollar yet. */}
            <section className="py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
                        <div className="grid gap-8 sm:grid-cols-2">
                            <div>
                                <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
                                    Free while you figure it out
                                </h3>
                                <p className="text-neutral-600 mb-5">
                                    You have not made a dollar yet. A tool that tells you why should
                                    not be the thing that costs you one.
                                </p>
                                <Link
                                    href="/#pricing"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:gap-2.5 transition-all"
                                >
                                    See full pricing
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "1 project, 20 answers a month, free forever",
                                    "Why-Not-Buy and the feedback widget, both included",
                                    "Every reason emailed to you the moment it arrives",
                                    "No credit card to start",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                        {item}
                                    </div>
                                ))}
                                <div className="flex items-start gap-3 text-sm text-neutral-500 pt-2">
                                    <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300" />
                                    Free shows a small Feedinbox badge on the widget. Pro at $10.99 a
                                    month removes it and raises the limit to 1,000 answers.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-neutral-50 border-t border-neutral-100">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-10 text-center">
                        The questions you are actually asking
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="rounded-xl border border-neutral-200 bg-white p-6">
                                <h3 className="font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                                <p className="text-sm leading-relaxed text-neutral-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA. Written for this page rather than reusing SEOCTA's generic copy. */}
            <section className="py-20 bg-neutral-900 text-white">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
                    <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Your next visitor is going to leave without saying anything.
                    </h2>
                    <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                        Unless you ask. Install it with one prompt, then go back to building what they
                        told you was missing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/login"}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-100 hover:shadow-xl"
                        >
                            {isLoggedIn ? "Go to App" : "Start for free"}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/docs"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-700 px-8 text-base font-medium text-white transition-all hover:border-neutral-500 hover:bg-neutral-800"
                        >
                            Read the docs
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-neutral-400">
                        No credit card required • Free tier available
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
