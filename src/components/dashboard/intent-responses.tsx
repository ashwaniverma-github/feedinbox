"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { formatDate } from "@/lib/utils";
import { Zap, Globe, MessageSquareQuote } from "lucide-react";

interface OptionAgg {
    optionId: string;
    label: string;
    count: number;
}
interface CountryAgg {
    country: string;
    count: number;
}
interface IntentResponseItem {
    id: string;
    optionLabel: string | null;
    optionId: string | null;
    text: string | null;
    country: string | null;
    pageUrl: string | null;
    createdAt: string;
    context: Record<string, unknown>;
}

interface ApiResponse {
    responses: IntentResponseItem[];
    pagination: { page: number; totalPages: number };
    aggregate: { total: number; byOption: OptionAgg[]; byCountry: CountryAgg[] };
}

export function IntentResponses({ projectId }: { projectId: string }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`/api/projects/${projectId}/intent-responses?page=${page}&limit=20`);
                if (!res.ok) {
                    setError(true);
                    return;
                }
                setData(await res.json());
            } catch (e) {
                console.error("Failed to load intent responses", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [projectId, page]);

    if (loading && !data) return <LoadingPage />;

    if (error) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Zap className="mx-auto h-8 w-8 text-neutral-300" />
                    <p className="mt-2 text-neutral-500">Couldn't load responses</p>
                    <p className="mt-1 text-sm text-neutral-400">Please refresh to try again.</p>
                </CardContent>
            </Card>
        );
    }

    const agg = data?.aggregate;
    const total = agg?.total || 0;
    const maxOption = Math.max(1, ...(agg?.byOption.map((o) => o.count) || [1]));

    if (total === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Zap className="mx-auto h-8 w-8 text-neutral-300" />
                    <p className="mt-2 text-neutral-500">No Why-Not-Buy responses yet</p>
                    <p className="mt-1 text-sm text-neutral-400">
                        Enable Why-Not-Buy and fire the <code className="text-xs">high_intent</code> event
                        from your pricing or checkout page.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Headline */}
            <Card>
                <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Total responses</p>
                    <p className="text-3xl font-bold">{total}</p>
                </CardContent>
            </Card>

            {/* Option breakdown */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">What stopped them</h3>
                    <div className="space-y-3">
                        {agg?.byOption.map((o) => {
                            const pct = Math.round((o.count / total) * 100);
                            return (
                                <div key={o.optionId}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span>{o.label}</span>
                                        <span className="text-muted-foreground">
                                            {o.count} · {pct}%
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                        <div
                                            className="h-2 rounded-full bg-neutral-900 dark:bg-white"
                                            style={{ width: `${Math.max(3, (o.count / maxOption) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Countries */}
            {agg && agg.byCountry.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Globe className="h-4 w-4" /> Where they were
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {agg.byCountry.slice(0, 12).map((c) => (
                                <span
                                    key={c.country}
                                    className="rounded-full border border-border px-3 py-1 text-sm"
                                >
                                    {c.country} · {c.count}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent responses */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <MessageSquareQuote className="h-4 w-4" /> Recent responses
                    </h3>
                    <div className="space-y-3">
                        {data?.responses.map((r) => (
                            <div
                                key={r.id}
                                className="rounded-lg border border-border p-3"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    {r.optionLabel && (
                                        <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium">
                                            {r.optionLabel}
                                        </span>
                                    )}
                                    {r.country && (
                                        <span className="text-xs text-neutral-500">{r.country}</span>
                                    )}
                                    {typeof r.context?.plan === "string" && (
                                        <span className="text-xs text-neutral-500">
                                            plan: {String(r.context.plan)}
                                        </span>
                                    )}
                                    <span className="text-xs text-neutral-400 ml-auto">
                                        {formatDate(r.createdAt)}
                                    </span>
                                </div>
                                {r.text && (
                                    <div className={r.optionLabel ? "mt-2 border-t border-border pt-2" : "mt-2"}>
                                        {/* Only labeled when an option is also present, so it reads as an
                                            addendum rather than an explanation of that option. A text-only
                                            submission needs no label: it's the whole response. */}
                                        {r.optionLabel && (
                                            <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                                                Also said
                                            </p>
                                        )}
                                        <p className="text-sm">{r.text}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {data && data.pagination.totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="disabled:opacity-40 px-2"
                            >
                                Previous
                            </button>
                            <span className="text-neutral-500">
                                Page {data.pagination.page} of {data.pagination.totalPages}
                            </span>
                            <button
                                disabled={page === data.pagination.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="disabled:opacity-40 px-2"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
