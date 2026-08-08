import { Zap, MessageSquare, Check } from "lucide-react";
import { WidgetPointer } from "./widget-pointer";

export default function TwoToolsSection() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="text-center mb-14">
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
                        One script. Two ways to hear your users.
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Feedinbox leads with Why-Not-Buy, and includes a feedback widget for everything else.
                        Turn either on or off from your dashboard.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Core: Why-Not-Buy */}
                    <div className="relative rounded-2xl border-2 border-neutral-900 bg-white p-8 shadow-xl">
                        <div className="absolute -top-3 left-8">
                            <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                                Core
                            </span>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 mb-5">
                            <Zap className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">Why-Not-Buy</h3>
                        <p className="text-neutral-600 mb-5">
                            When a visitor abandons your pricing or checkout, one question asks what stopped them.
                            The reason lands in your dashboard, tagged by plan and country.
                        </p>
                        <ul className="space-y-2.5">
                            {[
                                "Fires on abandonment, not a form to build",
                                "Answers tagged by plan and country",
                                "Emailed to you the moment it arrives",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Companion: Feedback widget */}
                    <div className="relative rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <div className="absolute -top-3 left-8">
                            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-500">
                                Included
                            </span>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <WidgetPointer />
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">Feedback widget</h3>
                        <p className="text-neutral-600 mb-5">
                            A floating button for bugs, feature requests, and questions. Every submission is emailed
                            to you the moment it arrives.
                        </p>
                        <ul className="space-y-2.5">
                            {[
                                "Bugs, ideas, and questions in one place",
                                "Instant email on every submission",
                                "Same script, same dashboard",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
