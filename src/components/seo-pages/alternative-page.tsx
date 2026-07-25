import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import type { Alternative } from "@/data/alternatives";
import SEOCTA from "./seo-cta";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";

interface AlternativePageProps {
    alternative: Alternative;
}

export default function AlternativePage({ alternative }: AlternativePageProps) {
    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 mb-6 border border-amber-100">
                        Alternative to {alternative.competitorName}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl mb-6">
                        {alternative.heroHeadline}
                    </h1>
                    <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {alternative.heroSubheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-base font-semibold text-white transition-all hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20"
                        >
                            Try Feedinbox free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#comparison"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-base font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                        >
                            See comparison
                        </Link>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100" id="comparison">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Feedinbox vs {alternative.competitorName}
                        </h2>
                        <p className="text-neutral-600">
                            See how we compare on the features that matter
                        </p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-lg">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-100 bg-neutral-50">
                                    <th className="text-left px-6 py-4 font-semibold text-neutral-900">Feature</th>
                                    <th className="text-center px-6 py-4 font-semibold text-neutral-900">Feedinbox</th>
                                    <th className="text-center px-6 py-4 font-semibold text-neutral-500">{alternative.competitorName}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alternative.comparison.map((row, i) => (
                                    <tr key={i} className="border-b border-neutral-100 last:border-0">
                                        <td className="px-6 py-4 text-neutral-700">{row.feature}</td>
                                        <td className="px-6 py-4 text-center">
                                            {row.feedinbox.startsWith("✓") ? (
                                                <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                                                    <Check className="h-4 w-4" />
                                                    {row.feedinbox.replace("✓ ", "")}
                                                </span>
                                            ) : row.feedinbox.startsWith("✗") ? (
                                                <span className="inline-flex items-center gap-1.5 text-neutral-400">
                                                    <X className="h-4 w-4" />
                                                </span>
                                            ) : (
                                                <span className="text-neutral-900 font-medium">{row.feedinbox}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {row.competitor.startsWith("✓") ? (
                                                <span className="inline-flex items-center gap-1.5 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                </span>
                                            ) : row.competitor.startsWith("✗") ? (
                                                <span className="inline-flex items-center gap-1.5 text-neutral-400">
                                                    <X className="h-4 w-4" />
                                                    {row.competitor.replace("✗ ", "")}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-500">{row.competitor}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className="py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Why choose Feedinbox
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {alternative.advantages.map((advantage, i) => (
                            <div key={i} className="p-6 rounded-xl border border-neutral-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-2">
                                            {advantage.title}
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            {advantage.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Migration CTA */}
            <section className="py-16 bg-neutral-900 text-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <h2 className="text-2xl font-bold sm:text-3xl mb-4">
                        Switching from {alternative.competitorName}?
                    </h2>
                    <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                        Get set up with Feedinbox in minutes. No complex migration needed, just add one script and start learning why visitors don't buy.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-6 text-center mb-8">
                        <div className="p-4 rounded-lg bg-neutral-800">
                            <div className="text-2xl font-bold text-white mb-1">1.</div>
                            <div className="text-sm text-neutral-400">Sign up free</div>
                        </div>
                        <div className="p-4 rounded-lg bg-neutral-800">
                            <div className="text-2xl font-bold text-white mb-1">2.</div>
                            <div className="text-sm text-neutral-400">Add one snippet</div>
                        </div>
                        <div className="p-4 rounded-lg bg-neutral-800">
                            <div className="text-2xl font-bold text-white mb-1">3.</div>
                            <div className="text-sm text-neutral-400">See why they don't buy</div>
                        </div>
                    </div>
                </div>
            </section>

            <SEOCTA
                headline={`Ready to try a simpler ${alternative.competitorName} alternative?`}
                subheadline="Free tier available. No credit card required."
            />

            <Footer />
        </div>
    );
}
