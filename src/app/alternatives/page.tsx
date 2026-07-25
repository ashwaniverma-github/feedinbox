import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shuffle } from "lucide-react";
import { alternatives } from "@/data/alternatives";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";
import SEOCTA from "@/components/seo-pages/seo-cta";

export const metadata: Metadata = {
    title: "Alternatives - Compare Feedinbox to Other Tools | Feedinbox",
    description: "Compare Feedinbox to Canny, Hotjar, Survicate, Typeform, and more. Feedinbox tells you why visitors don't buy and collects feedback, simpler and cheaper.",
    keywords: ["why visitors don't buy", "exit intent survey alternative", "hotjar alternative", "survicate alternative", "conversion feedback tool"],
};

export default function AlternativesIndexPage() {
    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 mb-6 border border-amber-100">
                        <Shuffle className="h-3 w-3" />
                        Alternatives
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl mb-6">
                        Compare Feedinbox
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Want to know why visitors don&apos;t buy, plus collect feedback, without the bloat or the price tag? See how Feedinbox compares.
                    </p>
                </div>
            </section>

            {/* Alternatives Grid */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alternatives.map((alternative) => (
                            <Link
                                key={alternative.slug}
                                href={`/alternatives/${alternative.slug}`}
                                className="group p-6 rounded-xl border border-neutral-200 bg-white hover:shadow-lg hover:border-neutral-300 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-sm font-medium text-neutral-500">Feedinbox vs</span>
                                    <span className="font-semibold text-neutral-900">{alternative.competitorName}</span>
                                </div>
                                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                    {alternative.heroSubheadline}
                                </p>
                                <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 group-hover:gap-2 transition-all">
                                    Compare
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Summary */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-6">
                        Why developers switch to Feedinbox
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-neutral-900 mb-2">$5</div>
                            <div className="text-neutral-600">Starting price</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-neutral-900 mb-2">2 min</div>
                            <div className="text-neutral-600">Setup time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-neutral-900 mb-2">Email</div>
                            <div className="text-neutral-600">Delivery method</div>
                        </div>
                    </div>
                </div>
            </section>

            <SEOCTA
                headline="Ready to find out why they don't buy?"
                subheadline="Free tier available. No credit card required."
            />

            <Footer />
        </div>
    );
}
