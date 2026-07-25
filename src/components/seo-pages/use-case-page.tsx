import Link from "next/link";
import { ArrowRight, Check, Cloud, Smartphone, ShoppingCart, Rocket, Layout, TestTube, Globe, Package } from "lucide-react";
import type { UseCase } from "@/data/use-cases";
import SEOCTA from "./seo-cta";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";

const iconMap: Record<string, React.ElementType> = {
    Cloud,
    Smartphone,
    ShoppingCart,
    Rocket,
    Layout,
    TestTube,
    Globe,
    Package,
};

interface UseCasePageProps {
    useCase: UseCase;
}

export default function UseCasePage({ useCase }: UseCasePageProps) {
    const IconComponent = iconMap[useCase.icon] || Package;

    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-neutral-100 mb-6">
                        <IconComponent className="h-8 w-8 text-neutral-900" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl mb-6">
                        {useCase.heroHeadline}
                    </h1>
                    <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {useCase.heroSubheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-base font-semibold text-white transition-all hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20"
                        >
                            Start for free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/#pricing"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-base font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                        >
                            See pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-6">
                        The Problem
                    </h2>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                        {useCase.problemStatement}
                    </p>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            How Feedinbox Helps
                        </h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
                            {useCase.description}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {useCase.benefits.map((benefit, i) => (
                            <div key={i} className="p-6 rounded-xl border border-neutral-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-2">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Email-First Highlight */}
            <section className="py-16 bg-neutral-900 text-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <h2 className="text-2xl font-bold sm:text-3xl mb-4">
                        Answers, straight to your inbox
                    </h2>
                    <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                        No dashboard to babysit. A weekly summary of why visitors didn&apos;t buy, plus instant emails for any feedback they send.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-6 text-center">
                        <div className="p-4 rounded-lg bg-neutral-800">
                            <div className="text-3xl font-bold text-white mb-1">&lt;1s</div>
                            <div className="text-sm text-neutral-400">Email delivery</div>
                        </div>
                        <div className="p-4 rounded-lg bg-neutral-800">
                            <div className="text-3xl font-bold text-white mb-1">2 min</div>
                            <div className="text-sm text-neutral-400">Setup time</div>
                        </div>
                        <div className="p-4 rounded-lg bg-neutral-800">
                            <div className="text-3xl font-bold text-white mb-1">$0</div>
                            <div className="text-sm text-neutral-400">To get started</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Sample */}
            <section className="py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Add in 2 minutes
                        </h2>
                        <p className="text-neutral-600">
                            One snippet of code. That&apos;s the entire setup.
                        </p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-lg">
                        <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                            </div>
                            <div className="ml-2 text-xs font-mono text-neutral-400">Your site</div>
                        </div>
                        <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                            <code>{`<script>
  window.feedinboxConfig = {
    projectKey: "your_project_key"
  };
</script>
<script async src="https://feedinbox.com/widget.js"></script>`}</code>
                        </pre>
                    </div>
                </div>
            </section>

            <SEOCTA />

            <Footer />
        </div>
    );
}
