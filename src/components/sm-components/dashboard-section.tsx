import { LayoutDashboard, Check } from "lucide-react";

export default function DashboardSection() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2 shadow-2xl shadow-neutral-200/50">
                            <div className="rounded-lg bg-white border border-neutral-200 overflow-hidden">
                                {/* Mock Dashboard Header */}
                                <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-sm text-neutral-900">Dashboard</div>
                                        <div className="h-4 w-px bg-neutral-200" />
                                        <div className="text-xs text-neutral-500">Overview</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-20 bg-white border border-neutral-200 rounded text-[10px] flex items-center justify-center text-neutral-500">Last 7 days</div>
                                    </div>
                                </div>
                                {/* Mock Dashboard Content */}
                                <div className="p-6 space-y-6">
                                    {/* Stats Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-lg border border-neutral-100 p-4">
                                            <div className="text-xs text-neutral-500 mb-1">Reasons captured</div>
                                            <div className="text-2xl font-bold text-neutral-900">128</div>
                                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                <span className="font-medium">↑ 12%</span> from last week
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-neutral-100 p-4">
                                            <div className="text-xs text-neutral-500 mb-1">#1 reason</div>
                                            <div className="text-sm font-bold text-neutral-900 mt-1">Too expensive</div>
                                            <div className="h-1.5 w-full bg-neutral-100 rounded-full mt-3 overflow-hidden">
                                                <div className="h-full bg-red-500 w-[42%] rounded-full" />
                                            </div>
                                            <div className="text-[10px] text-neutral-400 mt-1">42% of responses</div>
                                        </div>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="rounded-lg border border-neutral-100 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-xs font-medium text-neutral-700">Drop-off reasons over time</div>
                                        </div>
                                        <div className="h-24 relative">
                                            {/* Line Chart SVG */}
                                            <svg className="w-full h-full" viewBox="0 0 280 96" preserveAspectRatio="none">
                                                {/* Gradient fill under the line */}
                                                <defs>
                                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
                                                    </linearGradient>
                                                </defs>
                                                {/* Area fill */}
                                                <path
                                                    d="M 0 90 L 46.67 43.2 L 93.33 57.6 L 140 28.8 L 186.67 52.8 L 233.33 9.6 L 280 38.4 L 280 96 L 0 96 Z"
                                                    fill="url(#areaGradient)"
                                                />
                                                {/* Line */}
                                                <path
                                                    d="M 0 90 L 46.67 43.2 L 93.33 57.6 L 140 28.8 L 186.67 52.8 L 233.33 9.6 L 280 38.4"
                                                    fill="none"
                                                    stroke="#8b5cf6"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                {/* Data points */}
                                                {[
                                                    { x: 0, y: 90 },
                                                    { x: 46.67, y: 43.2 },
                                                    { x: 93.33, y: 57.6 },
                                                    { x: 140, y: 28.8 },
                                                    { x: 186.67, y: 52.8 },
                                                    { x: 233.33, y: 9.6 },
                                                    { x: 280, y: 38.4 }
                                                ].map((point, i) => (
                                                    <circle
                                                        key={i}
                                                        cx={point.x}
                                                        cy={point.y}
                                                        r="3"
                                                        fill="#8b5cf6"
                                                        className="opacity-0 hover:opacity-100 transition-opacity"
                                                    />
                                                ))}
                                            </svg>
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] text-neutral-400">
                                            <span>Mon</span>
                                            <span>Tue</span>
                                            <span>Wed</span>
                                            <span>Thu</span>
                                            <span>Fri</span>
                                            <span>Sat</span>
                                            <span>Sun</span>
                                        </div>
                                    </div>

                                    {/* Recent responses list */}
                                    <div className="space-y-3">
                                        <div className="text-xs font-medium text-neutral-700">Recent responses</div>
                                        {[
                                            { title: "Too expensive", tag: "US · pro", color: "text-red-600 bg-red-50 border-red-100", dot: "bg-red-500" },
                                            { title: "Not sure what I get", tag: "IN · pro", color: "text-amber-600 bg-amber-50 border-amber-100", dot: "bg-amber-500" },
                                            { title: "Just looking", tag: "GB · free", color: "text-blue-600 bg-blue-50 border-blue-100", dot: "bg-blue-500" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-white hover:border-neutral-200 transition-colors cursor-default">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-2 w-2 rounded-full ${item.dot}`} />
                                                    <span className="text-sm text-neutral-700 font-medium">{item.title}</span>
                                                </div>
                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${item.color}`}>
                                                    {item.tag}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 mb-6 border border-purple-100">
                            <LayoutDashboard className="h-3 w-3" />
                            Your dashboard
                        </div>
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-6">
                            Every reason they didn't buy, in one place.
                        </h2>
                        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                            See exactly what's blocking your sales, ranked, tagged by plan and country, and trending over time. Every answer is emailed to you as it lands, so you never have to check.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "See the #1 reason people don't buy",
                                "Tagged by plan viewed and country",
                                "Instant email on every answer",
                                "Plus a feedback widget for everything else"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-700">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Check className="h-3 w-3" />
                                    </div>
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
