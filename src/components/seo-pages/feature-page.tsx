import Link from "next/link";
import { ArrowRight, Check, Mail, Zap, Bell, Eye, Inbox } from "lucide-react";
import type { Feature } from "@/data/features";
import SEOCTA from "./seo-cta";
import Navbar from "@/components/sm-components/navbar";
import Footer from "@/components/sm-components/footer";

const iconMap: Record<string, React.ElementType> = {
    Mail,
    Zap,
    Bell,
    Eye,
    Inbox,
};

interface FeaturePageProps {
    feature: Feature;
}

export default function FeaturePage({ feature }: FeaturePageProps) {
    const IconComponent = iconMap[feature.icon] || Mail;

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
                        {feature.heroHeadline}
                    </h1>
                    <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {feature.heroSubheadline}
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
                            href="#how-it-works"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-8 text-base font-medium text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-50"
                        >
                            See how it works
                        </Link>
                    </div>
                </div>
            </section>

            {/* Email Flow Visualization */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100" id="how-it-works">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            How it works
                        </h2>
                        <p className="text-neutral-600">
                            Three simple steps. Two minutes to set up.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="mx-auto h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold mb-4">
                                1
                            </div>
                            <h3 className="font-semibold text-neutral-900 mb-2">User clicks widget</h3>
                            <p className="text-sm text-neutral-600">Widget sits on your site, ready for feedback</p>
                        </div>
                        <div>
                            <div className="mx-auto h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold mb-4">
                                2
                            </div>
                            <h3 className="font-semibold text-neutral-900 mb-2">Feedback submitted</h3>
                            <p className="text-sm text-neutral-600">Bugs, features, or general thoughts</p>
                        </div>
                        <div>
                            <div className="mx-auto h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold mb-4">
                                3
                            </div>
                            <h3 className="font-semibold text-neutral-900 mb-2">You get an email</h3>
                            <p className="text-sm text-neutral-600">Instantly, in your inbox</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Why {feature.title}?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {feature.benefits.map((benefit, i) => (
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

            {/* Code Sample */}
            <section className="py-16 bg-neutral-50 border-y border-neutral-100">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl mb-4">
                            Setup in 2 minutes
                        </h2>
                        <p className="text-neutral-600">
                            Just add this snippet to your site
                        </p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-lg">
                        <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                            </div>
                            <div className="ml-2 text-xs font-mono text-neutral-400">index.html</div>
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

            <SEOCTA
                headline="Find out why visitors don't buy"
                subheadline="Free tier available. Ask abandoning visitors one question and collect feedback, all in your inbox. Set up in minutes."
            />

            <Footer />
        </div>
    );
}
