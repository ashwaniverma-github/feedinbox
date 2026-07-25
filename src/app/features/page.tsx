import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Zap, Bell, Eye, Inbox } from "lucide-react";
import { features } from "@/data/features";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";
import SEOCTA from "@/components/seo-pages/seo-cta";

const iconMap: Record<string, React.ElementType> = {
    Mail,
    Zap,
    Bell,
    Eye,
    Inbox,
};

export const metadata: Metadata = {
    title: "Features - Why-Not-Buy + Feedback, In Your Inbox | Feedinbox",
    description: "Feedinbox tells you why visitors don't buy with an exit-intent question, and collects feedback. A weekly digest plus instant emails, no dashboard required.",
    keywords: ["why visitors don't buy", "exit intent question", "conversion feedback", "feedback to email", "inbox feedback tool"],
};

export default function FeaturesIndexPage() {
    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-6 border border-blue-100">
                        <Mail className="h-3 w-3" />
                        Inbox-First Approach
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl mb-6">
                        Why they didn&apos;t buy, in your inbox
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Feedinbox is built on one core principle: the answers you need should come to you, not sit in a dashboard you forget to check.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const IconComponent = iconMap[feature.icon] || Mail;
                            return (
                                <Link
                                    key={feature.slug}
                                    href={`/features/${feature.slug}`}
                                    className="group p-6 rounded-xl border border-neutral-200 bg-white hover:shadow-lg hover:border-neutral-300 transition-all"
                                >
                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors mb-4">
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <h2 className="font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700">
                                        {feature.title}
                                    </h2>
                                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                        {feature.description}
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
