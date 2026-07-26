"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { CodeBlock } from "@/components/ui/code-block";
import { IntentConfig } from "@/components/dashboard/intent-config";
import { ActivationChecklist } from "@/components/dashboard/activation-checklist";
import { AISetupPrompt } from "@/components/dashboard/ai-setup-prompt";
import { ArrowLeft, BarChart3 } from "lucide-react";
import type { Project } from "@/types";

export default function WhyNotBuyConfigPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [error, setError] = useState(false);
    const [origin, setOrigin] = useState("");
    // Bumped when IntentConfig saves, to remount ActivationChecklist so its
    // enabled/status state doesn't go stale after a save on the same page.
    const [checklistKey, setChecklistKey] = useState(0);

    useEffect(() => {
        setOrigin(window.location.origin);
        (async () => {
            try {
                const res = await fetch(`/api/projects/${id}`);
                if (!res.ok) {
                    setError(true);
                    return;
                }
                setProject(await res.json());
            } catch (e) {
                console.error("Failed to fetch project", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading || !origin) return <LoadingPage />;

    const widgetKey = project?.widgetKey;

    if (error || !widgetKey) {
        return (
            <>
                <Header title="Why-Not-Buy" />
                <div className="mx-auto max-w-3xl p-4 md:p-8">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-neutral-500">Couldn't load this project.</p>
                            <Link
                                href={`/projects/${id}?tab=intent`}
                                className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to responses
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    const installSnippet = `<!-- 1. Add before </body> (once) -->
<script>window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}</script>
<script async src="${origin}/widget.js" data-project-key="${widgetKey}"></script>`;
    const eventSnippet = `// 2. When a visitor hits a high-intent surface (opens pricing, starts checkout)
window.feedinbox('event', 'high_intent', { plan: 'pro' })

// 3. When they actually buy (this cancels the question)
window.feedinbox('event', 'converted')`;

    return (
        <>
            <Header
                title="Why-Not-Buy"
                description={project?.name}
                action={
                    <div className="flex gap-2">
                        <Link href={`/projects/${id}?tab=intent`}>
                            <Button variant="secondary" size="sm">
                                <BarChart3 className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">View responses</span>
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
                <Link
                    href={`/projects/${id}?tab=intent`}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to responses
                </Link>

                {/* What it does */}
                <div className="rounded-xl border border-border bg-muted/40 p-5">
                    <h2 className="font-semibold">Find out why visitors don't buy</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        When someone opens your pricing or checkout and leaves without buying, a small
                        card asks one question. Two taps, done. You get the reason in your dashboard,
                        tagged with their plan and country, plus a weekly summary email.
                    </p>
                </div>

                {/* Activation checklist */}
                <ActivationChecklist key={checklistKey} projectId={id} />

                {/* Config */}
                <IntentConfig projectId={id} onSaved={() => setChecklistKey((k) => k + 1)} />

                {/* Install: AI-first */}
                <AISetupPrompt projectKey={widgetKey} mode="why_not_buy" origin={origin} />

                {/* Install: manual */}
                <Card>
                    <CardContent className="p-6 space-y-5">
                        <div>
                            <h3 className="font-semibold">Or install manually</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Two steps: load the script once, then tell it when a visitor shows high intent.
                            </p>
                        </div>
                        <CodeBlock code={installSnippet} language="html" filename="Your site (once)" />
                        <CodeBlock code={eventSnippet} language="javascript" filename="Your pricing / checkout code" />
                        <p className="text-xs text-muted-foreground">
                            The card only appears if <code>converted</code> isn't fired within your chosen
                            delay. Event names must match what you set above.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
