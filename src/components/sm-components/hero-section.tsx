"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

    return (
        <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
            {/* Layered background: grid texture under a warm glow, both decorative. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 fi-grid" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 fi-glow" />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-red-500" />
                    One question. At the exact moment they leave.
                </div>

                <h1 className="font-heading mt-8 text-[2.75rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-neutral-900 sm:text-6xl lg:text-7xl">
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
                    The reason lands in your dashboard, plus a weekly digest straight to your inbox.
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

            {/* Product shot: the moment the card fires, rather than an install snippet.
                Shows what the visitor sees, which is what the page is selling. */}
            <div className="mx-auto mt-20 max-w-4xl px-4 sm:px-6">
                <div className="fi-float relative">
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10">
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                            </div>
                            <div className="mx-auto rounded-md bg-white px-3 py-1 text-[11px] font-medium text-neutral-400 shadow-sm">
                                yourapp.com/pricing
                            </div>
                        </div>

                        {/* Dimmed pricing behind, with the card over it */}
                        <div className="relative bg-neutral-50/70 px-6 py-12 sm:px-10 sm:py-16">
                            <div aria-hidden="true" className="grid gap-4 opacity-35 sm:grid-cols-3">
                                {["Starter", "Pro", "Scale"].map((tier, i) => (
                                    <div
                                        key={tier}
                                        className={cn(
                                            "rounded-xl border bg-white p-5",
                                            i === 1 ? "border-neutral-900" : "border-neutral-200"
                                        )}
                                    >
                                        <div className="text-xs font-semibold text-neutral-500">{tier}</div>
                                        <div className="mt-2 h-7 w-20 rounded bg-neutral-200" />
                                        <div className="mt-4 space-y-2">
                                            <div className="h-2 w-full rounded bg-neutral-100" />
                                            <div className="h-2 w-4/5 rounded bg-neutral-100" />
                                            <div className="h-2 w-3/5 rounded bg-neutral-100" />
                                        </div>
                                        <div className="mt-5 h-8 w-full rounded-lg bg-neutral-100" />
                                    </div>
                                ))}
                            </div>

                            {/* The Why-Not-Buy card */}
                            <div className="pointer-events-none absolute bottom-6 right-6 w-[19rem] max-w-[calc(100%-3rem)] rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-2xl">
                                <p className="text-[15px] font-semibold text-neutral-900">What stopped you?</p>
                                <div className="mt-3.5 space-y-2">
                                    <div className="rounded-lg border-2 border-red-500 bg-red-50/60 px-3 py-2.5 text-sm font-medium text-neutral-900">
                                        Too expensive
                                    </div>
                                    {["Not sure what I get", "Just looking"].map((opt) => (
                                        <div
                                            key={opt}
                                            className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-600"
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 w-full rounded-lg bg-neutral-900 py-2.5 text-center text-sm font-medium text-white">
                                    Send
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
