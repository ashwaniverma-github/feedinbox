"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
    isLoggedIn?: boolean;
}

export default function HeroSection({ isLoggedIn = false }: HeroSectionProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Ordered so the pricing modal (the sharpest, most reliable trigger) is what
    // renders on first paint. Keep "your pricing modal." the longest string here:
    // the invisible sizer below reserves width from it.
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
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-48 sm:pb-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 lg:text-6xl mb-6 leading-[1.1]">
                            Know why they closed
                            <br />
                            {/* overflow-hidden drives the slide-up animation, so it also clips
                                horizontally. The right padding is the buffer that keeps the final
                                glyph (the full stop) off that clip edge: the absolutely positioned
                                text rounds its width differently than the inline sizer below. */}
                            <span className="inline-block relative overflow-hidden align-bottom pr-4" style={{ height: '1.15em' }}>
                                <span className="invisible" aria-hidden="true">your pricing modal.</span>
                                <span
                                    className={cn(
                                        "absolute left-0 top-0 transition-all duration-500 ease-out whitespace-nowrap",
                                        isAnimating
                                            ? "opacity-0 -translate-y-full"
                                            : "opacity-100 translate-y-0",
                                        currentTextIndex === 0 && "text-red-500",
                                        currentTextIndex === 1 && "text-amber-500"
                                    )}
                                >
                                    {animatedTexts[currentTextIndex]}
                                </span>
                            </span>
                        </h1>
                        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                            The moment someone closes your pricing modal without buying, one question asks why. The reason lands in your dashboard, plus a weekly digest straight to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
                            <Link
                                href={isLoggedIn ? "/dashboard" : "/login"}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-base font-semibold text-white transition-all hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                            >
                                {isLoggedIn ? "Go to App" : "Start for free"}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            {!isLoggedIn && (
                                <a
                                    href="#how-it-works"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-base font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50 whitespace-nowrap shrink-0"
                                >
                                    How it works
                                </a>
                            )}
                            <code className="hidden sm:inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-100 border border-neutral-200 px-4 text-sm font-mono text-neutral-600 whitespace-nowrap shrink-0">
                                <FileCode className="h-4 w-4 text-neutral-400" /> Just a script tag
                            </code>
                        </div>
                        <div className="mt-10 flex items-center gap-4 text-sm text-neutral-500">
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Free tier available</span>
                            </div>
                        </div>
                    </div>

                    {/* Code Showcase */}
                    <div className="relative group w-full max-w-full min-w-0">
                        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-neutral-100 to-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                        <div className="relative rounded-xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-200/50 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                        <div className="h-3 w-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="ml-2 text-xs font-mono text-neutral-400">
                                        index.html
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-500">
                                    <FileCode className="h-3 w-3" />
                                    Script
                                </div>
                            </div>
                            <div className="p-6 overflow-x-auto bg-white">
                                <pre className="text-sm font-mono leading-relaxed">
                                    <code className="language-html">
                                        <span className="text-neutral-400">// when they open pricing / start checkout</span>
                                        <br />
                                        <span className="text-neutral-900">feedinbox</span><span className="text-neutral-600">(</span><span className="text-green-600">'event'</span><span className="text-neutral-600">, </span><span className="text-green-600">'high_intent'</span><span className="text-neutral-600">, {'{'} plan: </span><span className="text-green-600">'pro'</span><span className="text-neutral-600"> {'}'})</span>
                                        <br />
                                        <br />
                                        <span className="text-neutral-400">// they buy? this cancels the question</span>
                                        <br />
                                        <span className="text-neutral-900">feedinbox</span><span className="text-neutral-600">(</span><span className="text-green-600">'event'</span><span className="text-neutral-600">, </span><span className="text-green-600">'converted'</span><span className="text-neutral-600">)</span>
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
