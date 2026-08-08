"use client";

import { useState } from "react";
import { Check, Copy, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The four options a visitor can pick in the default Why-Not-Buy card, each
 * paired with what it usually means and the prompt you'd paste into your agent.
 *
 * Keep `answer` in sync with the default option list rendered by the widget
 * (see how-it-works-section.tsx) so this page shows the real thing.
 *
 * "Just looking" deliberately has no prompt. It's the answer you ignore, and
 * saying so is the point of the section.
 */
const answers = [
    {
        answer: "Too expensive",
        accent: "red",
        means:
            "Rarely about the number. It means the value they could see next to the price didn't feel like it was worth it yet.",
        fix: "Fix the value, not the price. Change the price last, once the other three answers stop showing up.",
        prompt: `People who close my pricing page keep saying it's too expensive.

Rewrite my Pro plan card so the value lands before the number:
- Lead with the outcome they get, not the feature list
- Say what it replaces or what it saves them
- Keep the price exactly the same for now

Show me the before and after so I can compare.`,
    },
    {
        answer: "Not sure what I get",
        accent: "amber",
        means:
            "Your copy explains what the product is. It never says what happens to them after they pay.",
        fix: "The cheapest fix on this list. It's a copy change, not a build.",
        prompt: `Visitors say they aren't sure what they get from my product.

Rewrite my hero and pricing card so a first-time visitor understands it in 10 seconds:
- One sentence on the outcome, in words they'd say out loud
- Three bullets on what's actually included
- Replace every abstract feature word with something concrete

Don't add new claims. Only make the existing ones clearer.`,
    },
    {
        answer: "Need a feature you don't have",
        accent: "blue",
        means:
            "The only answer that tells you what to build. If the same feature comes back three times, that's your roadmap, not a hunch.",
        fix: "Build the smallest version that a real person could use. Ship it. Tell the people who asked.",
        prompt: `Add <the feature people keep asking for> to my app.

Start with the smallest version that someone could actually use end to end.
Wire it into the existing UI rather than adding a new page.
At the end, list the follow-ups you deliberately skipped.`,
    },
    {
        answer: "Just looking",
        accent: "neutral",
        means:
            "Not a lost customer. Someone wandered in from a link, got curious, and left. Normal.",
        fix: "Ignore it. Knowing which answers to throw away is half the value of asking.",
        prompt: null,
    },
] as const;

const accentStyles = {
    red: {
        chip: "border-red-500 bg-red-50 text-neutral-900",
        tab: "border-red-500 bg-red-50 text-red-700",
        dot: "bg-red-500",
    },
    amber: {
        chip: "border-amber-500 bg-amber-50 text-neutral-900",
        tab: "border-amber-500 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
    },
    blue: {
        chip: "border-blue-500 bg-blue-50 text-neutral-900",
        tab: "border-blue-500 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
    },
    neutral: {
        chip: "border-neutral-400 bg-neutral-100 text-neutral-900",
        tab: "border-neutral-400 bg-neutral-100 text-neutral-700",
        dot: "bg-neutral-400",
    },
} as const;

export default function AnswerTranslator() {
    const [selected, setSelected] = useState(0);
    const [copied, setCopied] = useState(false);
    const active = answers[selected];
    const accent = accentStyles[active.accent];

    const copyPrompt = async () => {
        if (!active.prompt) return;
        await navigator.clipboard.writeText(active.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start">
            {/* Left: the card as your visitor sees it, with the options acting as tabs */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                    What your visitor sees
                </div>
                <p className="mb-3.5 text-[15px] font-semibold text-neutral-900">What stopped you?</p>
                <div className="space-y-2">
                    {answers.map((item, i) => (
                        <button
                            key={item.answer}
                            type="button"
                            onClick={() => {
                                setSelected(i);
                                setCopied(false);
                            }}
                            aria-pressed={i === selected}
                            className={cn(
                                "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                                i === selected
                                    ? cn("border-2 font-medium", accentStyles[item.accent].chip)
                                    : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                            )}
                        >
                            {item.answer}
                        </button>
                    ))}
                </div>
                <p className="mt-4 text-xs text-neutral-500">
                    Tap an answer to see what you&apos;d do about it.
                </p>
            </div>

            {/* Right: what that answer means, and the prompt it turns into */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
                <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", accent.dot)} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        They picked &ldquo;{active.answer}&rdquo;
                    </span>
                </div>

                <p className="mt-4 text-lg leading-relaxed text-neutral-900">{active.means}</p>
                <p className="mt-3 flex gap-2 text-sm leading-relaxed text-neutral-600">
                    <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    {active.fix}
                </p>

                {active.prompt ? (
                    <div className="mt-6 overflow-hidden rounded-xl border border-neutral-800 bg-[#1e1e1e]">
                        <div className="flex items-center justify-between border-b border-neutral-800 bg-[#2d2d2d] px-4 py-2.5">
                            <span className="font-mono text-xs font-medium text-neutral-400">
                                paste into your agent
                            </span>
                            <button
                                type="button"
                                onClick={copyPrompt}
                                className="flex items-center gap-1.5 rounded bg-neutral-700/50 px-2 py-1 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-200"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-green-400" />
                                        <span className="text-green-400">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-neutral-200 whitespace-pre-wrap">
                            {active.prompt}
                        </pre>
                    </div>
                ) : (
                    <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-white p-5 text-sm leading-relaxed text-neutral-600">
                        <span className="font-medium text-neutral-900">No prompt for this one.</span>{" "}
                        That&apos;s the whole point. Without asking, every visitor who leaves looks
                        like a crisis worth rebuilding for. With it, you can tell the three worth
                        fixing from the one that never mattered.
                    </div>
                )}
            </div>
        </div>
    );
}
