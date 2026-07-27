"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PricingModal } from "@/components/ui/pricing-modal";
import { Check, Save, Lock, Zap } from "lucide-react";
import {
    DEFAULT_INTENT_SETTINGS,
    MAX_INTENT_OPTIONS,
    MIN_DELAY_SECONDS,
    MAX_DELAY_SECONDS,
    type IntentSettings,
} from "@/lib/intent";

export function IntentConfig({ projectId, onSaved }: { projectId: string; onSaved?: () => void }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [settings, setSettings] = useState<IntentSettings>(DEFAULT_INTENT_SETTINGS);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}/intent-settings`);
                const data = await res.json();
                if (data.settings) setSettings(data.settings);
                setIsPro(data.isPro || false);
            } catch (e) {
                console.error("Failed to load intent settings", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [projectId]);

    const update = <K extends keyof IntentSettings>(key: K, value: IntentSettings[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const updateOption = (index: number, label: string) => {
        setSettings((prev) => ({
            ...prev,
            options: prev.options.map((o, i) => (i === index ? { ...o, label } : o)),
        }));
    };

    const addOption = () => {
        if (settings.options.length >= MAX_INTENT_OPTIONS) return;
        setSettings((prev) => {
            // Generate an id that can't collide with an existing one (even after removals)
            const existing = new Set(prev.options.map((o) => o.id));
            let n = prev.options.length + 1;
            let id = `option_${n}`;
            while (existing.has(id)) id = `option_${++n}`;
            return { ...prev, options: [...prev.options, { id, label: "" }] };
        });
    };

    const removeOption = (index: number) => {
        setSettings((prev) => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index),
        }));
    };

    const save = async () => {
        setSaving(true);
        setSaved(false);
        setSaveError(false);
        const sent = JSON.stringify(settings);
        try {
            const res = await fetch(`/api/projects/${projectId}/intent-settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: sent,
            });
            if (!res.ok) throw new Error(`Save failed: ${res.status}`);
            const data = await res.json();
            // Apply the server's normalized copy only if the user hasn't edited
            // during the request, so an in-flight response can't clobber newer edits.
            if (data.settings) {
                setSettings((cur) => (JSON.stringify(cur) === sent ? data.settings : cur));
            }
            setSaved(true);
            onSaved?.(); // let the parent refresh dependent UI (e.g. activation checklist)
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            console.error("Failed to save intent settings", e);
            setSaveError(true); // keep local edits so the user can retry
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="h-5 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Why-Not-Buy question
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ask one question when a visitor abandons a high-intent surface (pricing, checkout) without buying.
                        </p>
                    </div>
                    {/* Enabled toggle (free for all tiers) */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={settings.enabled}
                        onClick={() => update("enabled", !settings.enabled)}
                        aria-label="Toggle Why-Not-Buy"
                        className={`relative w-12 h-6 shrink-0 rounded-full transition-colors border ${settings.enabled
                            ? "bg-black border-white"
                            : "bg-neutral-300 dark:bg-neutral-600 border-neutral-400 dark:border-neutral-500"
                            }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.enabled ? "translate-x-6" : "translate-x-0.5"
                                }`}
                        />
                    </button>
                </div>

                {!isPro && (
                    <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-sm">
                        <Lock className="h-3.5 w-3.5 text-primary" />
                        <span>
                            Editing the question, options, and timing is a Pro feature. You can still
                            enable it and collect responses on the defaults.
                        </span>
                    </div>
                )}

                {/* Email notifications (free for all tiers) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">When a response comes in</label>
                    <div className="flex gap-2">
                        {([
                            { v: "instant", label: "Email me instantly" },
                            { v: "weekly", label: "Weekly digest" },
                            { v: "off", label: "No emails" },
                        ] as const).map((opt) => (
                            <button
                                key={opt.v}
                                type="button"
                                onClick={() => update("notifyFrequency", opt.v)}
                                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${settings.notifyFrequency === opt.v
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fallback timer (free for all tiers). Kept outside the Pro block below,
                    whose overlay would otherwise swallow the toggle's clicks. Only the
                    seconds value is Pro. */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <span className="text-sm font-medium">Fallback timer</span>
                            <p className="text-xs text-muted-foreground">
                                Off means the card only appears on a real exit signal, so someone
                                still reading is never interrupted.
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={settings.fallbackEnabled}
                            onClick={() => update("fallbackEnabled", !settings.fallbackEnabled)}
                            aria-label="Toggle fallback timer"
                            className={`relative w-12 h-6 shrink-0 rounded-full transition-colors border ${settings.fallbackEnabled
                                ? "bg-black border-white"
                                : "bg-neutral-300 dark:bg-neutral-600 border-neutral-400 dark:border-neutral-500"
                                }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.fallbackEnabled ? "translate-x-6" : "translate-x-0.5"
                                    }`}
                            />
                        </button>
                    </div>

                    {settings.fallbackEnabled && (
                        <div className={`space-y-2 ${!isPro ? "opacity-60" : ""}`}>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    Show anyway after {!isPro && <span className="text-xs font-normal text-muted-foreground">(Pro)</span>}
                                </label>
                                <span className="text-sm text-muted-foreground">{settings.delaySeconds}s</span>
                            </div>
                            <input
                                type="range"
                                min={MIN_DELAY_SECONDS}
                                max={MAX_DELAY_SECONDS}
                                value={settings.delaySeconds}
                                disabled={!isPro}
                                onChange={(e) => update("delaySeconds", parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        The card normally waits for an exit signal: your abandon event (fire it
                        when someone closes your pricing modal or checkout without buying), the
                        cursor leaving through the top of the page, or the tab being hidden.
                        {settings.fallbackEnabled
                            ? " This timer is the safety net for visitors who go quiet without any of those."
                            : " With the timer off, visitors who go quiet without one of those are never asked. Touch devices have no cursor signal, so mobile relies on the abandon event or the tab being hidden."}
                    </p>
                </div>

                {/* Customization (Pro). For non-Pro, a transparent overlay captures
                    clicks to open pricing, since disabled inputs don't emit focus/mouse events. */}
                <div className="relative space-y-6">
                    {!isPro && (
                        <button
                            type="button"
                            onClick={() => setIsPricingOpen(true)}
                            aria-label="Upgrade to customize Why-Not-Buy"
                            className="absolute inset-0 z-10 cursor-pointer rounded-lg"
                        />
                    )}

                    {/* Question */}
                    <div className={!isPro ? "opacity-60" : ""}>
                        <Input
                            label="Question"
                            value={settings.question}
                            maxLength={200}
                            disabled={!isPro}
                            onChange={(e) => update("question", e.target.value)}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Answer options</label>
                            {isPro && settings.options.length < MAX_INTENT_OPTIONS && (
                                <button
                                    onClick={addOption}
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    + Add option
                                </button>
                            )}
                        </div>
                        <div className={`space-y-2 ${!isPro ? "opacity-60" : ""}`}>
                            {settings.options.map((opt, i) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                    <input
                                        value={opt.label}
                                        maxLength={200}
                                        disabled={!isPro}
                                        onChange={(e) => updateOption(i, e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                        placeholder={`Option ${i + 1}`}
                                    />
                                    {isPro && settings.options.length > 1 && (
                                        <button
                                            onClick={() => removeOption(i)}
                                            className="text-xs text-neutral-400 hover:text-red-500 px-2"
                                            aria-label="Remove option"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Event names */}
                    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${!isPro ? "opacity-60" : ""}`}>
                        <Input
                            label="High-intent event"
                            value={settings.highIntentEvent}
                            maxLength={100}
                            disabled={!isPro}
                            onChange={(e) => update("highIntentEvent", e.target.value)}
                        />
                        <Input
                            label="Abandon event"
                            value={settings.abandonEvent}
                            maxLength={100}
                            disabled={!isPro}
                            onChange={(e) => update("abandonEvent", e.target.value)}
                        />
                        <Input
                            label="Conversion event"
                            value={settings.conversionEvent}
                            maxLength={100}
                            disabled={!isPro}
                            onChange={(e) => update("conversionEvent", e.target.value)}
                        />
                    </div>

                    {/* Remove branding (Pro) */}
                    <div className={`flex items-center justify-between gap-3 ${!isPro ? "opacity-60" : ""}`}>
                        <div>
                            <span className="text-sm font-medium">Remove Feedinbox branding</span>
                            <p className="text-xs text-muted-foreground">
                                Hide the &ldquo;Powered by Feedinbox&rdquo; footer on the card.
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={settings.hideBranding}
                            disabled={!isPro}
                            onClick={() => update("hideBranding", !settings.hideBranding)}
                            aria-label="Toggle Feedinbox branding"
                            className={`relative w-12 h-6 shrink-0 rounded-full transition-colors border ${settings.hideBranding
                                ? "bg-black border-white"
                                : "bg-neutral-300 dark:bg-neutral-600 border-neutral-400 dark:border-neutral-500"
                                }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.hideBranding ? "translate-x-6" : "translate-x-0.5"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Snippet hint */}
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-xs font-mono overflow-x-auto">
                    <div className="text-neutral-500">{"// fire when a visitor hits a high-intent surface"}</div>
                    <div>window.feedinbox('event', '{settings.highIntentEvent}', {"{ plan: 'pro' }"})</div>
                    <div className="mt-1.5 text-neutral-500">{"// fire when they close pricing/checkout without buying (shows the card right away)"}</div>
                    <div>window.feedinbox('event', '{settings.abandonEvent}')</div>
                    <div className="mt-1.5 text-neutral-500">{"// fire on successful purchase"}</div>
                    <div>window.feedinbox('event', '{settings.conversionEvent}')</div>
                    <div className="mt-1.5 text-neutral-500">{"// stand down when they move forward instead of leaving (sign in, signup)"}</div>
                    <div>window.feedinbox('cancel')</div>
                </div>

                <p className="text-xs text-muted-foreground">
                    Fire <span className="font-mono">{settings.abandonEvent}</span> from a real close action, not
                    from a component unmount or useEffect cleanup. React Strict Mode double-invokes effects, so a
                    cleanup fires it on arrival and the card shows immediately. Leaving the page is detected for
                    you.
                </p>

                <div className="flex items-center gap-3">
                    <Button size="sm" onClick={save} disabled={saving}>
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                    </Button>
                    {saved && (
                        <span role="status" className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                            <Check className="w-4 h-4" /> Saved
                        </span>
                    )}
                    {saveError && (
                        <span role="alert" className="text-sm text-red-600 font-medium">
                            Couldn't save. Please try again.
                        </span>
                    )}
                    {!isPro && (
                        <button
                            onClick={() => setIsPricingOpen(true)}
                            className="text-sm text-primary hover:underline ml-auto"
                        >
                            Upgrade to customize
                        </button>
                    )}
                </div>
            </CardContent>
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        </Card>
    );
}
