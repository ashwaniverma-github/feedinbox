import { Zap, MousePointerClick, BarChart3 } from "lucide-react";

export default function HowItWorksSection() {
    return (
        <section className="py-24 bg-neutral-50 border-y border-neutral-100" id="how-it-works">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 mb-6 border border-red-100">
                        <Zap className="h-3 w-3" />
                        Catch them before they leave
                    </div>
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
                        One question at the moment that matters.
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Most people who open your pricing never buy, and you have no idea why.
                        Feedinbox asks them, right as they're about to leave.
                    </p>
                </div>

                <div className="relative max-w-3xl mx-auto">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-200 via-red-200 to-neutral-200 -z-10 hidden sm:block" />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-neutral-200 shadow-sm mb-4 z-10">
                                <Zap className="h-8 w-8 text-neutral-400" />
                            </div>
                            <h3 className="font-semibold text-neutral-900">They show intent</h3>
                            <p className="text-sm text-neutral-500 mt-1">Open pricing or start checkout</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 shadow-xl shadow-red-600/20 mb-4 z-10 animate-pulse">
                                <MousePointerClick className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-neutral-900">They start to leave</h3>
                            <p className="text-sm text-neutral-500 mt-1">One question slides in</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-neutral-200 shadow-sm mb-4 z-10">
                                <BarChart3 className="h-8 w-8 text-neutral-900" />
                            </div>
                            <h3 className="font-semibold text-neutral-900">You get the reason</h3>
                            <p className="text-sm text-neutral-500 mt-1">In your dashboard + weekly email</p>
                        </div>
                    </div>

                    {/* Card Mockup */}
                    <div className="mt-16 mx-auto w-full max-w-sm bg-white rounded-2xl border border-neutral-200 shadow-2xl p-5 rotate-1 hover:rotate-0 transition-transform duration-500">
                        <p className="text-[15px] font-semibold text-neutral-900 mb-3.5">What stopped you?</p>
                        <div className="space-y-2">
                            <div className="rounded-lg border-2 border-red-500 bg-red-50/50 px-3 py-2.5 text-sm text-neutral-900 font-medium">
                                Too expensive
                            </div>
                            <div className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-700">
                                Not sure what I get
                            </div>
                            <div className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-700">
                                Need a feature you don't have
                            </div>
                            <div className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-700">
                                Just looking
                            </div>
                        </div>
                        <div
                            aria-hidden="true"
                            className="mt-3 w-full rounded-lg bg-neutral-900 py-2.5 text-center text-sm font-medium text-white"
                        >
                            Send
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
