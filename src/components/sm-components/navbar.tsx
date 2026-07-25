"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavbarProps {
    isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
            <nav
                className={cn(
                    "pointer-events-auto flex h-14 items-center justify-between rounded-full border border-neutral-200/60 bg-white/70 px-4 shadow-xl shadow-neutral-200/20 backdrop-blur-xl transition-all duration-500 ease-in-out hover:bg-white/90 sm:px-6",
                    isScrolled ? "w-full max-w-2xl py-2" : "w-full max-w-5xl"
                )}
            >
                <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg shadow-neutral-900/20">
                        <Image
                            src="/feedinbox.png"
                            alt="Feedinbox"
                            width={120}
                            height={32}
                            className="rounded-full "
                        />
                    </div>
                    <span className={cn(
                        "hidden transition-all duration-500 sm:inline-block",
                        isScrolled && "sm:hidden md:hidden lg:inline-block"
                    )}>
                        Feedinbox
                    </span>
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <a
                        href="#how-it-works"
                        className={cn(
                            "hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-100/50 hover:text-neutral-900 sm:inline-flex",
                            isScrolled && "opacity-0 w-0 px-0 pointer-events-none hidden"
                        )}
                    >
                        How it works
                    </a>
                    <a
                        href="#pricing"
                        className={cn(
                            "hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-100/50 hover:text-neutral-900 sm:inline-flex",
                            isScrolled && "opacity-0 w-0 px-0 pointer-events-none hidden"
                        )}
                    >
                        Pricing
                    </a>
                    <Link
                        href="/docs"
                        className={cn(
                            "hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-100/50 hover:text-neutral-900 sm:inline-flex",
                            isScrolled && "opacity-0 w-0 px-0 pointer-events-none hidden"
                        )}
                    >
                        Docs
                    </Link>
                    {!isLoggedIn && (
                        <Link
                            href="/login"
                            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100/50 hover:text-neutral-900"
                        >
                            Log in
                        </Link>
                    )}
                    <Link
                        href={isLoggedIn ? "/dashboard" : "/login"}
                        className="inline-flex h-9 items-center justify-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20 active:scale-95"
                    >
                        {isLoggedIn ? "Dashboard" : "Get Started"}
                    </Link>
                </div>
            </nav>
        </div>
    );
}
