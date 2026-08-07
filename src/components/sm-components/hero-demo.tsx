"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { Smartphone, User } from "lucide-react";
import { cn } from "@/lib/utils";

// useLayoutEffect warns when it runs during SSR, so fall back to useEffect on
// the server. Reading the media query in a layout effect matters here: it lands
// the reduced-motion frame before the first paint, so a visitor who asked for
// less motion never sees step 0 flash past on its way to FROZEN_STEP. State is
// still initialised to 0 rather than read at init, so hydration matches the
// server-rendered markup.
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A looping two-act demo of the core product loop.
 *
 * Act one is the visitor's browser: they abandon pricing, the Why-Not-Buy card
 * asks one question, they answer. Act two hands off to the founder's phone,
 * where the answer arrives as a Gmail notification and settles into the inbox.
 *
 * The handoff is the point of the whole thing, so the scene genuinely changes
 * rather than overlaying a toast on the visitor's screen: that email lands on
 * your device, not theirs.
 *
 * Driven by a step index rather than CSS keyframes so the caption, the mock
 * cursor, the card state, and the phone can never drift out of sync.
 */
const STEPS = [
    { id: "browsing", ms: 1700, caption: "A visitor is weighing up your plans." },
    { id: "leaving", ms: 1100, caption: "They move to leave without buying." },
    { id: "asking", ms: 1400, caption: "Feedinbox asks one question." },
    { id: "picking", ms: 1400, caption: "They pick a reason." },
    { id: "sending", ms: 750, caption: "One tap to send." },
    { id: "sent", ms: 1400, caption: "Answered in two seconds." },
    { id: "notify", ms: 1800, caption: "It hits your phone straight away." },
    { id: "inbox", ms: 2400, caption: "Waiting in your inbox, tagged and ready." },
] as const;

// Shown when motion is reduced: the card mid-answer, the single frame that best
// conveys what the product actually does.
const FROZEN_STEP = 3;

const OPTIONS = ["Too expensive", "Not sure what I get", "Just looking"];

export default function HeroDemo() {
    const [step, setStep] = useState(0);
    const [reduced, setReduced] = useState(false);

    useIsomorphicLayoutEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = (matches: boolean) => {
            setReduced(matches);
            if (matches) setStep(FROZEN_STEP);
        };
        apply(mq.matches);
        const onChange = (e: MediaQueryListEvent) => apply(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        if (reduced) return;
        const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step].ms);
        return () => clearTimeout(t);
    }, [step, reduced]);

    // Act one: the visitor's browser
    const dimmed = step >= 1;
    const cardIn = step >= 2;
    const picked = step >= 3;
    const pressing = step === 4;
    const done = step >= 5;
    const cursorIn = step >= 2 && step <= 4;

    // Act two: the founder's phone
    const onPhone = step >= 6;
    const banner = step === 6;
    const inInbox = step >= 7;

    // Anchored inside the card, whose width and padding are fixed, so these land
    // on the same elements at every viewport instead of being tuned to one.
    const cursorTop = step === 3 ? 76 : step === 4 ? 230 : 132;

    return (
        // fi-demo: see globals.css. Disables every transition in this subtree under
        // reduced motion, which a per-element guard would miss when the preference
        // flips mid-session and the step jumps to FROZEN_STEP.
        <div className="fi-demo relative mx-auto mt-20 max-w-6xl px-4 sm:px-6">
            {/* The animation is decorative; this is the accessible equivalent. */}
            <p className="sr-only">
                A demonstration: when a visitor leaves your pricing page without buying,
                Feedinbox shows a card asking &ldquo;What stopped you?&rdquo;. They pick a
                reason such as &ldquo;Too expensive&rdquo; and send it, and the reason
                arrives moments later as an email on your phone.
            </p>

            <div aria-hidden="true">
                {/* Both acts share one grid cell, so the stage is always as tall as the
                    taller scene and the handoff cannot cause a layout jump. */}
                <div className="grid">
                    {/* ---------------- Act one: the visitor's browser ---------------- */}
                    <div
                        className={cn(
                            // self-center: the stage is as tall as the taller scene (the
                            // phone), so without this the browser would sit top-aligned
                            // with dead space beneath it for most of the loop.
                            "col-start-1 row-start-1 self-center transition-all duration-700 ease-out",
                            onPhone
                                ? "pointer-events-none scale-95 opacity-0 blur-sm"
                                : "scale-100 opacity-100 blur-0"
                        )}
                    >
                        {/* Whose screen this is. Without it the handoff to the phone reads
                            as the same person's device, which loses the whole point. */}
                        <div className="mb-4 flex justify-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 shadow-sm backdrop-blur">
                                <User className="h-3.5 w-3.5" />
                                Your visitor
                            </span>
                        </div>

                        <div className="fi-float relative">
                            <div
                                className={cn(
                                    "pointer-events-none absolute -inset-10 -z-10 rounded-[2.5rem] bg-red-500/10 blur-3xl transition-opacity duration-700",
                                    cardIn ? "opacity-100" : "opacity-0"
                                )}
                            />

                            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10">
                                {/* Browser chrome */}
                                <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-4 py-3 sm:px-5">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                        <div className="h-3 w-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-medium text-neutral-400 shadow-sm sm:text-xs">
                                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <rect x="5" y="11" width="14" height="10" rx="2" />
                                            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                                        </svg>
                                        yourapp.com/pricing
                                    </div>
                                </div>

                                <div className="relative bg-neutral-50/70 px-6 py-14 sm:px-12 sm:py-20">
                                    <div
                                        className={cn(
                                            "grid gap-5 transition-all duration-700 sm:grid-cols-3",
                                            dimmed ? "scale-[0.99] opacity-30 blur-[1px]" : "scale-100 opacity-100 blur-0"
                                        )}
                                    >
                                        {["Starter", "Pro", "Scale"].map((tier, i) => (
                                            <div
                                                key={tier}
                                                className={cn(
                                                    "rounded-xl border bg-white p-6",
                                                    i === 1 ? "border-neutral-900 shadow-sm" : "border-neutral-200"
                                                )}
                                            >
                                                <div className="text-xs font-semibold text-neutral-500">{tier}</div>
                                                <div className="mt-2.5 h-8 w-24 rounded bg-neutral-200" />
                                                <div className="mt-5 space-y-2.5">
                                                    <div className="h-2 w-full rounded bg-neutral-100" />
                                                    <div className="h-2 w-4/5 rounded bg-neutral-100" />
                                                    <div className="h-2 w-3/5 rounded bg-neutral-100" />
                                                </div>
                                                <div className="mt-6 h-9 w-full rounded-lg bg-neutral-100" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* The Why-Not-Buy card */}
                                    <div
                                        className={cn(
                                            "pointer-events-none absolute bottom-7 right-7 w-[21rem] max-w-[calc(100%-3.5rem)] rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-2xl transition-all duration-500 ease-out",
                                            cardIn ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"
                                        )}
                                    >
                                        <div className="relative min-h-[15.5rem]">
                                            <div className={cn("transition-opacity duration-300", done ? "opacity-0" : "opacity-100")}>
                                                <p className="text-[15px] font-semibold text-neutral-900">What stopped you?</p>
                                                <div className="mt-3.5 space-y-2">
                                                    {OPTIONS.map((opt, i) => (
                                                        <div
                                                            key={opt}
                                                            className={cn(
                                                                "rounded-lg px-3 py-2.5 text-sm transition-all duration-300",
                                                                i === 0 && picked
                                                                    ? "border-2 border-red-500 bg-red-50/60 font-medium text-neutral-900"
                                                                    : "border border-neutral-200 text-neutral-600"
                                                            )}
                                                        >
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div
                                                    className={cn(
                                                        "mt-3 w-full rounded-lg py-2.5 text-center text-sm font-medium text-white transition-all duration-200",
                                                        pressing ? "scale-[0.97] bg-neutral-700" : "scale-100 bg-neutral-900"
                                                    )}
                                                >
                                                    Send
                                                </div>
                                            </div>

                                            <div
                                                className={cn(
                                                    "absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500",
                                                    done ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                                                )}
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                </div>
                                                <p className="mt-3 text-[15px] font-semibold text-neutral-900">Thanks for the feedback</p>
                                                <p className="mt-1 text-xs text-neutral-500">Sent to the founder</p>
                                            </div>
                                        </div>

                                        {/* Mock cursor, inside the card so it tracks the options */}
                                        <div
                                            className={cn(
                                                "absolute left-[58%] transition-all duration-500 ease-out",
                                                cursorIn ? "opacity-100" : "opacity-0"
                                            )}
                                            style={{ top: cursorTop }}
                                        >
                                            <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-md" fill="white" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round">
                                                <path d="M5 3l14 8-6 1.5L9.5 19z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------------- Act two: the founder's phone ---------------- */}
                    <div
                        className={cn(
                            "col-start-1 row-start-1 flex items-center justify-center self-center transition-all duration-700 ease-out",
                            onPhone ? "scale-100 opacity-100 blur-0" : "pointer-events-none scale-90 opacity-0 blur-sm"
                        )}
                    >
                        <div>
                            {/* The counterpart label to the visitor's, so the switch of
                                device is unmistakably a switch of person. */}
                            <div className="mb-4 flex justify-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-600 shadow-sm backdrop-blur">
                                    <Smartphone className="h-3.5 w-3.5" />
                                    You, the founder
                                </span>
                            </div>

                            <div className="fi-float relative mx-auto w-fit">
                                {/* Glow so the phone reads as the focal point once it lands */}
                                <div className="pointer-events-none absolute -inset-12 -z-10 rounded-full bg-red-500/15 blur-3xl" />

                                <div className="relative w-[17.5rem] overflow-hidden rounded-[2.5rem] border-[8px] border-neutral-900 bg-white shadow-2xl shadow-neutral-900/25 sm:w-[19rem]">
                                {/* Status bar */}
                                <div className="flex items-center justify-between bg-white px-6 pb-1.5 pt-3.5 text-[11px] font-semibold text-neutral-900">
                                    <span>9:41</span>
                                    <div className="flex items-center gap-1 text-neutral-900">
                                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor">
                                            <path d="M2 17h3v4H2zM7 13h3v8H7zM12 9h3v12h-3zM17 4h3v17h-3z" />
                                        </svg>
                                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor">
                                            <path d="M12 4a11 11 0 0 1 8 3.4l-1.4 1.4A9 9 0 0 0 12 6a9 9 0 0 0-6.6 2.8L4 7.4A11 11 0 0 1 12 4zm0 5a6 6 0 0 1 4.2 1.8l-1.4 1.4A4 4 0 0 0 12 11a4 4 0 0 0-2.8 1.2L7.8 10.8A6 6 0 0 1 12 9zm0 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                                        </svg>
                                        <div className="ml-0.5 h-2.5 w-5 rounded-[3px] border border-neutral-900 p-[1.5px]">
                                            <div className="h-full w-3/4 rounded-[1px] bg-neutral-900" />
                                        </div>
                                    </div>
                                </div>

                                {/* Gmail search bar */}
                                <div className="px-4 pb-2.5 pt-2">
                                    <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2.5">
                                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                        <span className="flex-1 text-[12px] text-neutral-500">Search in mail</span>
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            F
                                        </div>
                                    </div>
                                </div>

                                {/* Primary tab */}
                                <div className="flex items-center gap-1.5 border-b border-neutral-100 px-5 pb-2">
                                    <svg viewBox="0 0 24 24" className="h-3 w-3 text-neutral-500" fill="currentColor">
                                        <path d="M4 5h16v14H4z" opacity="0.25" />
                                        <path d="M4 5h16l-8 6z" />
                                    </svg>
                                    <span className="text-[11px] font-semibold text-neutral-600">Primary</span>
                                </div>

                                {/* Inbox list. Fixed height with the overflow clipped, exactly
                                    like a real screen: the list continues below the fold rather
                                    than stretching the phone. Without this the frame is sized by
                                    its row count and grows without bound. */}
                                <div className="h-[21rem] overflow-hidden bg-white sm:h-[23rem]">
                                    {/* The Feedinbox email. Collapsed by height rather than faded
                                        in place, so before it arrives it occupies no space and
                                        leaves no gap under the Gmail header. */}
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-500 ease-out",
                                            inInbox ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                                        )}
                                    >
                                        <div className="flex items-start gap-3 bg-blue-50/60 px-4 py-3.5">
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                                                F
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <p className="truncate text-[12px] font-bold text-neutral-900">Feedinbox</p>
                                                    <span className="shrink-0 text-[10px] font-bold text-blue-600">now</span>
                                                </div>
                                                <p className="truncate text-[12px] font-bold text-neutral-900">
                                                    Why-Not-Buy: Too expensive
                                                </p>
                                                <p className="truncate text-[11px] text-neutral-500">
                                                    A visitor left yourapp.com/pricing
                                                </p>
                                            </div>
                                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                        </div>
                                    </div>

                                    {/* Older mail, deliberately inert so the new one reads as new.
                                        More rows than fit on purpose, so the list runs past the
                                        bottom of the screen instead of ending in blank space. */}
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-start gap-3 px-4 py-3.5 opacity-30">
                                            <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-neutral-200" />
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <div className="h-2 w-1/3 rounded bg-neutral-200" />
                                                <div className="h-2 w-3/4 rounded bg-neutral-100" />
                                                <div className="h-2 w-2/3 rounded bg-neutral-100" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Compose button, floating above the list as in the real app */}
                                <div className="pointer-events-none absolute bottom-16 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-neutral-900/15 ring-1 ring-neutral-200/70">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
                                    </svg>
                                </div>

                                {/* Bottom nav, so the frame ends like a phone app rather than
                                    a list that simply stops */}
                                <div className="flex items-center justify-around border-t border-neutral-100 bg-white px-4 pb-3.5 pt-2.5">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="rounded-full bg-red-100 px-3 py-0.5">
                                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                                <path d="M3 7l9 6 9-6" />
                                            </svg>
                                        </div>
                                        <span className="text-[9px] font-semibold text-neutral-700">Mail</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 opacity-40">
                                        <div className="px-3 py-0.5">
                                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="6" width="13" height="12" rx="2" />
                                                <path d="M22 8l-7 4 7 4z" />
                                            </svg>
                                        </div>
                                        <span className="text-[9px] font-medium text-neutral-500">Meet</span>
                                    </div>
                                </div>

                                {/* Push notification, sliding down over the app before it settles
                                    into the list. This is the beat that sells "it reached me".
                                    Sits below the status bar rather than at the very top, the way
                                    a real one does, so the clock stays visible and the Gmail
                                    header underneath is not entirely swallowed. */}
                                <div
                                    className={cn(
                                        "absolute inset-x-3 top-9 rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-xl shadow-neutral-900/20 backdrop-blur transition-all duration-500 ease-out",
                                        banner ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-[10px] font-bold text-white">
                                            F
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                                            Gmail
                                        </span>
                                        <span className="ml-auto text-[10px] text-neutral-400">now</span>
                                    </div>
                                    <p className="mt-2 truncate text-[12px] font-bold text-neutral-900">
                                        Why-Not-Buy: Too expensive
                                    </p>
                                    <p className="truncate text-[11px] text-neutral-500">
                                        A visitor left yourapp.com/pricing
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Caption + progress, so the loop reads as a narrated demo */}
                <div className="mt-8 flex flex-col items-center gap-3">
                    <p key={step} className="fi-caption text-center text-sm font-medium text-neutral-600">
                        {STEPS[step].caption}
                    </p>
                    <div className="flex gap-1.5">
                        {STEPS.map((s, i) => (
                            <div
                                key={s.id}
                                className={cn(
                                    "h-1 rounded-full transition-all duration-500",
                                    i === step ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
