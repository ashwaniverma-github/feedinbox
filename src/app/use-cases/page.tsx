import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cloud, Smartphone, ShoppingCart, Rocket, Layout, TestTube, Globe, Package } from "lucide-react";
import { useCases } from "@/data/use-cases";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";
import SEOCTA from "@/components/seo-pages/seo-cta";

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

export const metadata: Metadata = {
    title: "Use Cases - Find Out Why Visitors Don't Buy | Feedinbox",
    description: "See how Feedinbox helps SaaS, e-commerce, Shopify, startups, and more find out why visitors don't buy, and collect feedback.",
    keywords: ["why visitors don't buy", "saas conversion feedback", "checkout abandonment", "exit intent use cases"],
};

export default function UseCasesIndexPage() {
    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 mb-6 border border-green-100">
                        <Package className="h-3 w-3" />
                        Use Cases
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl mb-6">
                        Why-Not-Buy for every scenario
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Whether you run a SaaS app, e-commerce store, Shopify shop, or landing page, Feedinbox tells you why visitors don&apos;t buy, and collects feedback.
                    </p>
                </div>
            </section>

            {/* Use Cases Grid */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((useCase) => {
                            const IconComponent = iconMap[useCase.icon] || Package;
                            return (
                                <Link
                                    key={useCase.slug}
                                    href={`/use-cases/${useCase.slug}`}
                                    className="group p-6 rounded-xl border border-neutral-200 bg-white hover:shadow-lg hover:border-neutral-300 transition-all"
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors mb-4">
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <h2 className="font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700">
                                        {useCase.title}
                                    </h2>
                                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                        {useCase.description}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-900 group-hover:gap-2 transition-all">
                                        Learn more
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <SEOCTA />

            <Footer />
        </div>
    );
}
