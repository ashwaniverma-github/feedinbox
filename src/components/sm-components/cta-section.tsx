import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
    isLoggedIn?: boolean;
}

export default function CTASection({ isLoggedIn = false }: CTASectionProps) {
    return (
        <section className="relative overflow-hidden py-24 text-center">
            <div className="absolute inset-0 -z-10 bg-neutral-900" />
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]" />
            </div>

            <div className="mx-auto max-w-3xl px-4 sm:px-6 relative">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                    Stop guessing why they don't buy.
                </h2>
                <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
                    Turn the visitors who almost bought into your clearest roadmap. Set it up in minutes: one script tag and one line on your pricing page.
                </p>
                <Link
                    href={isLoggedIn ? "/dashboard" : "/login"}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-100 hover:scale-105 shadow-xl shadow-white/10"
                >
                    {isLoggedIn ? "Go to App" : "Get Started for Free"}
                    <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-6 text-sm text-neutral-500">
                    No credit card required. Free tier available.
                </p>
            </div>
        </section>
    );
}
