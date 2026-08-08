"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import HeroDemo from "./hero-demo";

interface HeroSectionProps {
    isLoggedIn?: boolean;
}

export default function HeroSection({ isLoggedIn = false }: HeroSectionProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Ordered so the pricing modal (the sharpest, most reliable trigger) is what
    // renders on first paint. Order is free otherwise: the grid stack below sizes
    // itself to the widest phrase, so no entry has to be listed first to reserve
    // width. Colors are index-based, so keep that in sync when editing.
    const animatedTexts = ["your pricing modal.", "your paywall."];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
                setIsAnimating(false);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // `isolate` is load-bearing: `relative` alone leaves z-index auto, which does not
    // create a stacking context, so the -z-* background layers below would belong to
    // the root context and paint before the landing page's bg-white wrapper, which
    // then covers them entirely. isolation:isolate scopes them to this section.
    return (
        <section className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40">
            {/* Layered background, all decorative: drifting colour orbs at the back,
                a grid texture over them, then a colour wash on top to tie it together. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
                <div className="fi-orb absolute -left-32 -top-24 h-[28rem] w-[28rem] bg-red-400/25" />
                <div className="fi-orb fi-orb-slow absolute -right-32 top-10 h-[26rem] w-[26rem] bg-amber-300/25" />
                <div className="fi-orb absolute left-1/3 top-64 h-[24rem] w-[24rem] bg-rose-300/20" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 fi-grid" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 fi-glow" />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-red-500" />
                    One question. At the exact moment they leave.
                </div>

                {/* Fluid rather than stepped, because the animated phrase below cannot
                    wrap. At a 320px viewport the old 2.75rem base made "your pricing
                    modal." about 396px wide against 288px of available width, so it was
                    clipped by the section's overflow-hidden. The clamp keeps the longest
                    phrase inside the container at every width and still tops out at the
                    72px the old lg:text-7xl gave on desktop. */}
                <h1 className="font-heading mt-8 text-[clamp(1.75rem,8vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-neutral-900">
                    Know why they closed
                    <br />
                    {/* Every phrase is stacked in one grid cell, so the box is always as
                        wide as the widest phrase and no phrase can overflow it. The older
                        approach measured with a separate invisible span, which wrapped when
                        the column got narrow and left the real (nowrap) text wider than its
                        own box, clipping the final glyph against overflow-hidden. That
                        overflow-hidden is still what gives the slide its masked edge. */}
                    <span className="inline-grid overflow-hidden align-bottom" style={{ height: "1.15em" }}>
                        {animatedTexts.map((text, i) => (
                            <span
                                key={text}
                                aria-hidden={i !== currentTextIndex}
                                className={cn(
                                    "col-start-1 row-start-1 whitespace-nowrap transition-all duration-500 ease-out",
                                    i === currentTextIndex && !isAnimating
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-full",
                                    i === 0 && "text-red-500",
                                    i === 1 && "text-amber-500"
                                )}
                            >
                                {text}
                            </span>
                        ))}
                    </span>
                </h1>

                <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
                    The moment someone closes your pricing modal without buying, one question asks why.
                    The reason lands in your dashboard, and in your inbox the moment it arrives.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                    <Link
                        href={isLoggedIn ? "/dashboard" : "/login"}
                        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-base font-semibold text-white shadow-lg shadow-neutral-900/15 transition-all hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/25 sm:w-auto"
                    >
                        {isLoggedIn ? "Go to App" : "Start for free"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    {!isLoggedIn && (
                        <a
                            href="#how-it-works"
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-base font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50 sm:w-auto"
                        >
                            See how it works
                        </a>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-500">
                    {["No credit card required", "Free tier available", "Installs in minutes"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <HeroDemo />

        </section>
    );
}
