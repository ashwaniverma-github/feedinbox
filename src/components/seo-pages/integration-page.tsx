import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";
import type { Integration } from "@/data/integrations";
import SEOCTA from "./seo-cta";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";

interface IntegrationPageProps {
    integration: Integration;
}

export default function IntegrationPage({ integration }: IntegrationPageProps) {
    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-3 rounded-full bg-neutral-100 px-4 py-2 mb-6">
                        <span className="text-sm font-semibold text-neutral-900">{integration.name}</span>
                        <span className="text-neutral-300">+</span>
                        <span className="text-sm font-semibold text-neutral-900">Feedinbox</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl mb-6">
                        {integration.heroHeadline}
                    </h1>
                    <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {integration.heroSubheadline}
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
                            href="#installation"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-base font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                        >
                            See installation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100" id="installation">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Add to your site
                        </h2>
                        <p className="text-neutral-600">
                            Copy and paste. That&apos;s the entire setup.
                        </p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                                </div>
                                <div className="ml-2 text-xs font-mono text-neutral-400">
                                    Your code
                                </div>
                            </div>
                            <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                            </button>
                        </div>
                        <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                            <code>{integration.codeExample}</code>
                        </pre>
                    </div>
                </div>
            </section>

            {/* Step-by-Step */}
            <section className="py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Step-by-step setup
                        </h2>
                    </div>
                    <div className="space-y-8">
                        {integration.steps.map((step, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-neutral-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-neutral-600 mb-3">
                                        {step.description}
                                    </p>
                                    {step.code && (
                                        <code className="inline-block bg-neutral-100 px-3 py-1.5 rounded-lg text-sm font-mono text-neutral-700">
                                            {step.code}
                                        </code>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Feedinbox */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Why developers choose Feedinbox
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            { title: "Know why they don't buy", desc: "An exit-intent question catches abandoning visitors and asks why" },
                            { title: "Feedback included", desc: "A feedback widget for bugs and ideas, on the same script" },
                            { title: "Inbox-first", desc: "A weekly Why-Not-Buy summary plus instant feedback emails" },
                            { title: "Lightweight & free to start", desc: "Tiny script, 2-minute setup, no credit card" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white border border-neutral-200">
                                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                                    <p className="text-sm text-neutral-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <SEOCTA
                headline={`Add Feedinbox to your ${integration.name} app`}
                subheadline="Find out why visitors don't buy and collect feedback. Free tier available, setup takes minutes."
            />

            <Footer />
        </div>
    );
}
