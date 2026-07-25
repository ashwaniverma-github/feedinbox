import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SEOCTAProps {
    headline?: string;
    subheadline?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
}

export default function SEOCTA({
    headline = "Find out why visitors don't buy",
    subheadline = "Feedinbox asks abandoning visitors one question and tells you why, plus a feedback widget for everything else. Free to start, set up in minutes.",
    primaryButtonText = "Start for free",
    primaryButtonHref = "/login",
    secondaryButtonText = "See pricing",
    secondaryButtonHref = "/#pricing",
}: SEOCTAProps) {
    return (
        <section className="py-20 bg-neutral-900 text-white">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                    {headline}
                </h2>
                <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                    {subheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={primaryButtonHref}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-100 hover:shadow-xl"
                    >
                        {primaryButtonText}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href={secondaryButtonHref}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-700 px-8 text-base font-medium text-white transition-all hover:border-neutral-500 hover:bg-neutral-800"
                    >
                        {secondaryButtonText}
                    </Link>
                </div>
                <p className="mt-6 text-sm text-neutral-400">
                    No credit card required • Free tier available
                </p>
            </div>
        </section>
    );
}
