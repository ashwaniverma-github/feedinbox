"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Circle } from "lucide-react";

interface Step {
    label: string;
    detail: string;
    done: boolean;
}

// Lightweight activation guide. Steps 1 and 4 are detected live; the install +
// event-wiring steps are auto-confirmed once the first response arrives (if you
// got one, the script and event obviously work).
export function ActivationChecklist({ projectId }: { projectId: string }) {
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [widgetSeen, setWidgetSeen] = useState(false);
    const [hasResponses, setHasResponses] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const [settingsRes, responsesRes] = await Promise.all([
                    fetch(`/api/projects/${projectId}/intent-settings`),
                    fetch(`/api/projects/${projectId}/intent-responses?limit=1`),
                ]);
                const settings = await settingsRes.json();
                const responses = await responsesRes.json();
                if (!active) return;
                setEnabled(Boolean(settings?.settings?.enabled));
                setWidgetSeen(Boolean(settings?.widgetSeen));
                setHasResponses((responses?.aggregate?.total || 0) > 0);
            } catch (e) {
                console.error("Failed to load activation state", e);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [projectId]);

    const steps: Step[] = [
        {
            label: "Turn on Why-Not-Buy",
            detail: "Use the toggle below to enable it for this project.",
            done: enabled,
        },
        {
            label: "Add the script to your site",
            detail: widgetSeen
                ? "Detected on your site."
                : "Paste the snippet before </body> (see Install below).",
            done: widgetSeen || hasResponses,
        },
        {
            label: "Fire high_intent on your pricing page",
            detail: "Call window.feedinbox('event', 'high_intent') when a visitor shows intent.",
            done: hasResponses,
        },
        {
            label: "Get your first reason",
            detail: "Responses appear in the Why-Not-Buy tab and land in your inbox as they arrive.",
            done: hasResponses,
        },
    ];

    const completed = steps.filter((s) => s.done).length;

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="h-24 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                </CardContent>
            </Card>
        );
    }

    if (hasResponses) {
        // Fully activated, no need to nag.
        return (
            <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium text-foreground">You're live.</span>
                <span className="text-muted-foreground">Responses are coming in. Check the Why-Not-Buy tab.</span>
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h3 className="font-semibold">Get your first reason</h3>
                    <div className="flex items-center gap-2">
                        {widgetSeen && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                                <Check className="h-3 w-3" /> Widget detected
                            </span>
                        )}
                        <span className="text-sm text-muted-foreground">{completed}/{steps.length}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                            {step.done ? (
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                                    <Check className="h-3 w-3" />
                                </div>
                            ) : (
                                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-neutral-300 dark:text-neutral-600" />
                            )}
                            <div>
                                <p className={step.done ? "text-sm font-medium text-muted-foreground line-through" : "text-sm font-medium text-foreground"}>
                                    {step.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{step.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
