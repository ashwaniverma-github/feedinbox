"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";

const PERKS = ["Free tier, no card needed", "Installs in minutes", "Cancel anytime"];

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-16">
            {/* Same decoration as the marketing pages, so signing in does not feel
                like leaving the site. Deliberately no dark: variants here: every
                unauthenticated page is light, and this one used to flip with the
                system theme while the rest stayed light. */}
            <div aria-hidden="true" className="fi-grid pointer-events-none absolute inset-0 -z-10" />
            <div aria-hidden="true" className="fi-glow pointer-events-none absolute inset-0 -z-10" />

            <Link
                href="/"
                className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100/70 hover:text-neutral-900 sm:left-8 sm:top-8"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to home
            </Link>

            <div className="w-full max-w-sm">
                <div className="rounded-2xl border border-neutral-200 bg-white/80 p-8 shadow-xl shadow-neutral-900/5 backdrop-blur">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 shadow-lg shadow-neutral-900/20">
                            <Image
                                src="/feedinbox.png"
                                alt=""
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        </div>
                        <h1 className="font-heading mt-5 text-2xl font-extrabold tracking-tight text-neutral-900">
                            Welcome to Feedinbox
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                            Sign in to find out why visitors close your pricing modal without
                            buying.
                        </p>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl })}
                        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
                    >
                        {/* Google's own brand colours: a monochrome mark reads as a generic
                            button and is less trusted at the moment of handing over an account. */}
                        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="mt-6 flex flex-col gap-2">
                        {PERKS.map((perk) => (
                            <div key={perk} className="flex items-center gap-2 text-xs text-neutral-500">
                                <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                                {perk}
                            </div>
                        ))}
                    </div>
                </div>

                {/* These were plain text before, so the agreement pointed at documents a
                    visitor had no way to actually read. */}
                <p className="mt-6 text-center text-xs leading-relaxed text-neutral-500">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div
                    role="status"
                    aria-live="polite"
                    className="flex min-h-screen items-center justify-center bg-white"
                >
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
                    {/* The spinner alone conveys nothing to a screen reader. */}
                    <span className="sr-only">Loading sign in</span>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
