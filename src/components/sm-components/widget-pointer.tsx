"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Shows a glowing "Like this" arrow pointing to the floating feedback widget
// (bottom-right of the viewport) only while the feedback-widget card is in view.
export function WidgetPointer() {
    const sentinelRef = useRef<HTMLSpanElement>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => setShow(entry.isIntersecting),
            { threshold: 0.5 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <>
            <span ref={sentinelRef} aria-hidden className="block h-px w-px" />
            <div
                aria-hidden
                className={cn(
                    "hidden lg:block fixed bottom-16 right-20 z-40 pointer-events-none transition-opacity duration-500",
                    show ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="relative">
                    <span className="absolute -top-4 -left-12 text-sm font-medium text-red-500 whitespace-nowrap bg-white/90 px-2 py-1 rounded-full shadow-sm">
                        Like this
                    </span>
                    <svg width="240" height="160" viewBox="0 0 240 160" fill="none" className="text-red-500">
                        <defs>
                            <linearGradient id="widgetPointerGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1">
                                    <animate attributeName="offset" values="-0.5;1" dur="2s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="30%" stopColor="currentColor" stopOpacity="1">
                                    <animate attributeName="offset" values="-0.2;1.3" dur="2s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="60%" stopColor="currentColor" stopOpacity="0.1">
                                    <animate attributeName="offset" values="0.1;1.6" dur="2s" repeatCount="indefinite" />
                                </stop>
                            </linearGradient>
                            <filter id="widgetPointerFilter" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <path
                            d="M20 20 C 80 20, 80 80, 50 80 C 20 80, 20 40, 60 30 C 130 10, 180 100, 220 140"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                            opacity="0.2"
                        />
                        <path
                            d="M20 20 C 80 20, 80 80, 50 80 C 20 80, 20 40, 60 30 C 130 10, 180 100, 220 140"
                            stroke="url(#widgetPointerGlow)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                            filter="url(#widgetPointerFilter)"
                        />
                        <path
                            d="M200 135 L 220 140 L 215 120"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            filter="url(#widgetPointerFilter)"
                        />
                    </svg>
                </div>
            </div>
        </>
    );
}
