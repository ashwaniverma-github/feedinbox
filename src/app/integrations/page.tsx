import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";
import { integrations } from "@/data/integrations";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";
import SEOCTA from "@/components/seo-pages/seo-cta";

export const metadata: Metadata = {
    title: "Integrations - Works With Your Stack | Feedinbox",
    description: "Add Feedinbox to Next.js, React, Vue, Angular, WordPress, Shopify, Webflow, and more. Simple integration guides with copy-paste code.",
    keywords: ["exit intent integration", "why visitors don't buy", "nextjs conversion feedback", "shopify exit intent", "feedback widget integration"],
};

export default function IntegrationsIndexPage() {
    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 mb-6 border border-purple-100">
                        <Code className="h-3 w-3" />
                        Integrations
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl mb-6">
                        Works with your stack
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Add Feedinbox to any website or app in under 2 minutes. Just a script tag. Works everywhere.
                    </p>
                </div>
            </section>

            {/* Integrations Grid */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map((integration) => (
                            <Link
                                key={integration.slug}
                                href={`/integrations/${integration.slug}`}
                                className="group p-6 rounded-xl border border-neutral-200 bg-white hover:shadow-lg hover:border-neutral-300 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 transition-colors">
                                        <Code className="h-5 w-5 text-neutral-600 group-hover:text-white" />
                                    </div>
                                    <h2 className="font-semibold text-neutral-900">
                                        {integration.name}
                                    </h2>
                                </div>
                                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                    {integration.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                                        Script tag
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 group-hover:gap-2 transition-all">
                                        View guide
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Universal Install */}
            <section className="py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                        Don&apos;t see your framework?
                    </h2>
                    <p className="text-neutral-600 mb-8">
                        Our script tag works on any website. Just add two lines of code.
                    </p>
                    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-lg text-left">
                        <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                            </div>
                            <div className="ml-2 text-xs font-mono text-neutral-400">Any website</div>
                        </div>
                        <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                            <code>{`<script async src="https://feedinbox.com/widget.js" data-project-key="your_key"></script>`}</code>
                        </pre>
                    </div>
                </div>
            </section>

            <SEOCTA />

            <Footer />
        </div>
    );
}
