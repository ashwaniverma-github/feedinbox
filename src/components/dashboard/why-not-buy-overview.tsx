"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowUpRight, Settings } from "lucide-react";

interface OptionAgg {
    optionId: string;
    label: string;
    count: number;
}
interface SeriesPoint {
    date: string;
    label: string;
    count: number;
}
interface Aggregate {
    total: number;
    byOption: OptionAgg[];
    byCountry: { country: string; count: number }[];
    series?: SeriesPoint[];
}

export function WhyNotBuyOverview({ projectId }: { projectId: string }) {
    const [loading, setLoading] = useState(true);
    const [agg, setAgg] = useState<Aggregate | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        (async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}/intent-responses?limit=1`);
                const data = await res.json();
                if (active) setAgg(data.aggregate || null);
            } catch (e) {
                console.error("Failed to load Why-Not-Buy overview", e);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [projectId]);

    const total = agg?.total || 0;
    const topReason = agg?.byOption?.[0];
    const maxOption = Math.max(1, ...(agg?.byOption.map((o) => o.count) || [1]));

    return (
        <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Zap className="h-5 w-5" />
                    Why visitors don't buy
                </h2>
                <Link
                    href={`/projects/${projectId}?tab=intent`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    View all →
                </Link>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="h-24 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                    </CardContent>
                </Card>
            ) : total === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                        <div className="rounded-full bg-muted p-3">
                            <Zap className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">No reasons captured yet</p>
                            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                                Turn on Why-Not-Buy and fire the <code className="text-xs">high_intent</code> event
                                on your pricing page to start learning why people don't buy.
                            </p>
                        </div>
                        <Link href={`/projects/${projectId}/why-not-buy`}>
                            <Button size="sm">
                                <Settings className="mr-2 h-4 w-4" />
                                Set up Why-Not-Buy
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Headline number */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Zap className="h-4 w-4" />
                                Responses
                            </div>
                            <p className="mt-2 text-3xl font-bold text-foreground">{total}</p>
                        </CardContent>
                    </Card>

                    {/* Top reason */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <ArrowUpRight className="h-4 w-4" />
                                #1 reason
                            </div>
                            <p className="mt-2 text-lg font-semibold text-foreground truncate">
                                {topReason?.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {topReason ? Math.round((topReason.count / total) * 100) : 0}% of responses
                            </p>
                        </CardContent>
                    </Card>

                    {/* Mini breakdown */}
                    <Card className="md:row-span-1">
                        <CardContent className="p-6">
                            <div className="mb-3 text-sm font-medium text-muted-foreground">Breakdown</div>
                            <div className="space-y-2">
                                {agg?.byOption.slice(0, 4).map((o) => (
                                    <div key={o.optionId}>
                                        <div className="flex items-center justify-between text-xs mb-0.5">
                                            <span className="truncate pr-2">{o.label}</span>
                                            <span className="text-muted-foreground shrink-0">{o.count}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                            <div
                                                className="h-1.5 rounded-full bg-neutral-900 dark:bg-white"
                                                style={{ width: `${Math.max(4, (o.count / maxOption) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Trend over time */}
                {agg?.series && agg.series.length > 0 && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-4 text-sm font-medium text-muted-foreground">
                                Responses over time (30 days)
                            </div>
                            <div className="h-40 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={agg.series} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                                        <defs>
                                            <linearGradient id="wnbTrend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="label"
                                            tick={{ fontSize: 11 }}
                                            interval="preserveStartEnd"
                                            minTickGap={40}
                                            axisLine={false}
                                            tickLine={false}
                                            stroke="currentColor"
                                            className="text-muted-foreground"
                                        />
                                        <Tooltip
                                            cursor={{ stroke: "currentColor", strokeOpacity: 0.15 }}
                                            contentStyle={{
                                                fontSize: 12,
                                                borderRadius: 8,
                                                border: "1px solid var(--border)",
                                                background: "var(--card)",
                                                color: "var(--foreground)",
                                            }}
                                            labelStyle={{ color: "var(--muted-foreground)" }}
                                            formatter={(value: number) => [`${value}`, "Responses"]}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            fill="url(#wnbTrend)"
                                            className="text-neutral-900 dark:text-white"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}
                </div>
            )}
        </div>
    );
}
