"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { WidgetPreview } from "@/components/dashboard/widget-preview";
import { PricingModal } from "@/components/ui/pricing-modal";
import {
    MessageSquare, ThumbsUp, HelpCircle, Lightbulb, Star,
    Check, Save, RotateCcw, ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface WidgetSettings {
    enabled: boolean;
    primaryColor: string;
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    triggerIcon: "chat" | "feedback" | "question" | "lightbulb" | "star";
    borderRadius: number;
    showEmail: boolean;
    headerText: string;
    hideBranding: boolean;
}

const DEFAULT_SETTINGS: WidgetSettings = {
    enabled: true,
    primaryColor: "#171717",
    position: "bottom-right",
    triggerIcon: "chat",
    borderRadius: 16,
    showEmail: true,
    headerText: "Send Feedback",
    hideBranding: false,
};

const PRESET_COLORS = [
    "#171717", "#374151", "#4B5563", "#6B7280",
    "#EF4444", "#F97316", "#F59E0B", "#EAB308",
    "#84CC16", "#22C55E", "#10B981", "#14B8A6",
    "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
    "#8B5CF6", "#A855F7", "#D946EF", "#EC4899",
    "#F43F5E", "#78350F", "#7C3AED", "#0D9488",
];

const ICON_OPTIONS = [
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "feedback", icon: ThumbsUp, label: "Feedback" },
    { id: "question", icon: HelpCircle, label: "Question" },
    { id: "lightbulb", icon: Lightbulb, label: "Idea" },
    { id: "star", icon: Star, label: "Star" },
] as const;

const POSITION_OPTIONS = [
    { id: "top-left", label: "Top Left" },
    { id: "top-right", label: "Top Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-right", label: "Bottom Right" },
] as const;

export default function WidgetEditorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS);
    const [originalSettings, setOriginalSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, [id]);

    useEffect(() => {
        setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
    }, [settings, originalSettings]);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`/api/projects/${id}/widget-settings`);
            const data = await res.json();
            if (data.settings) {
                setSettings(data.settings);
                setOriginalSettings(data.settings);
            }
            setIsPro(data.isPro || false);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!isPro) {
            setIsPricingOpen(true);
            return;
        }

        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch(`/api/projects/${id}/widget-settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setOriginalSettings(settings);
                setHasChanges(false);
                setSaved(true);
                // Hide saved message after 2 seconds
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setSaving(false);
        }
    };

    const resetSettings = () => {
        setSettings(originalSettings);
    };

    // On/off toggle for the feedback button. Free for all tiers, saved immediately
    // (independent of the Pro-gated appearance Save button).
    const toggleEnabled = async () => {
        const prev = settings.enabled;
        const next = !prev;
        // Optimistic update
        setSettings((s) => ({ ...s, enabled: next }));
        setOriginalSettings((s) => ({ ...s, enabled: next }));
        try {
            const res = await fetch(`/api/projects/${id}/widget-settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: next }),
            });
            if (!res.ok) throw new Error(`Toggle failed: ${res.status}`);
        } catch (error) {
            console.error("Failed to toggle widget:", error);
            // Roll back on failure
            setSettings((s) => ({ ...s, enabled: prev }));
            setOriginalSettings((s) => ({ ...s, enabled: prev }));
        }
    };

    const updateSetting = <K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <>
            <Header
                title="Widget Editor"
                action={
                    <div className="flex items-center gap-1 sm:gap-3">
                        {saved && (
                            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Saved!</span>
                            </span>
                        )}
                        {hasChanges && (
                            <Button variant="ghost" size="sm" onClick={resetSettings} className="px-2 sm:px-3">
                                <RotateCcw className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Reset</span>
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={saveSettings}
                            disabled={!hasChanges || saving}
                            className="px-2 sm:px-3"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin sm:mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            <span className="hidden sm:inline">{isPro ? "Save Changes" : "Upgrade to Save"}</span>
                            <span className="sm:hidden">{isPro ? "Save" : "Upgrade"}</span>
                        </Button>
                    </div>
                }
            />

            <div className="p-4 md:p-8">
                {/* Feedback button on/off (free for all tiers) */}
                <Card className="mb-6">
                    <CardContent className="py-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Feedback button</p>
                            <p className="text-sm text-muted-foreground">
                                {settings.enabled
                                    ? "The floating feedback button shows on your site."
                                    : "Hidden. You can still run Why-Not-Buy on its own."}
                            </p>
                        </div>
                        <button
                            onClick={toggleEnabled}
                            aria-label="Toggle feedback button"
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
                    </CardContent>
                </Card>

                {/* Pro Banner */}
                {settings.enabled && !isPro && (
                    <Card className="mb-6 border-primary/50 bg-primary/5">
                        <CardContent className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/feedinbox.png" alt="Pro" className="w-5 h-5 rounded-full" />
                                <p className="text-sm font-medium">
                                    Widget customization is a Pro feature. Preview your changes, then upgrade to save.
                                </p>
                            </div>
                            <Button size="sm" onClick={() => setIsPricingOpen(true)}>
                                <span className="sm:hidden">Upgrade</span>
                                <span className="hidden sm:inline">Upgrade to Pro</span>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity ${settings.enabled ? "" : "opacity-50"}`}>
                    {/* Settings Panel */}
                    <div className="space-y-6">
                        {/* Primary Color */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Primary Color</h3>
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                                    {PRESET_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => updateSetting("primaryColor", color)}
                                            className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 flex items-center justify-center"
                                            style={{
                                                backgroundColor: color,
                                                borderColor: settings.primaryColor === color ? "white" : "transparent",
                                                boxShadow: settings.primaryColor === color ? "0 0 0 2px #171717" : "none",
                                            }}
                                        >
                                            {settings.primaryColor === color && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <label className="text-sm text-muted-foreground">Custom:</label>
                                    <input
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => updateSetting("primaryColor", e.target.value)}
                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={settings.primaryColor}
                                        onChange={(e) => {
                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                                                updateSetting("primaryColor", e.target.value);
                                            }
                                        }}
                                        className="w-24 px-3 py-2 text-sm border border-border rounded-lg bg-background"
                                        placeholder="#000000"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trigger Icon */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Trigger Icon</h3>
                                <div className="flex gap-2">
                                    {ICON_OPTIONS.map(({ id, icon: Icon, label }) => (
                                        <button
                                            key={id}
                                            onClick={() => updateSetting("triggerIcon", id)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${settings.triggerIcon === id
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-xs">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Position */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Widget Position</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {POSITION_OPTIONS.map(({ id, label }) => (
                                        <button
                                            key={id}
                                            onClick={() => updateSetting("position", id)}
                                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${settings.position === id
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Other Options */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-semibold">Other Options</h3>

                                {/* Border Radius */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Border Radius</label>
                                        <span className="text-sm text-muted-foreground">{settings.borderRadius}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="24"
                                        value={settings.borderRadius}
                                        onChange={(e) => updateSetting("borderRadius", parseInt(e.target.value))}
                                        className="w-full accent-primary"
                                    />
                                </div>

                                {/* Header Text */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Header Text</label>
                                    <input
                                        type="text"
                                        value={settings.headerText}
                                        onChange={(e) => updateSetting("headerText", e.target.value)}
                                        maxLength={50}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                        placeholder="Send Feedback"
                                    />
                                </div>

                                {/* Show Email */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Show Email Field</label>
                                    <button
                                        onClick={() => updateSetting("showEmail", !settings.showEmail)}
                                        className={`relative w-12 h-6 rounded-full transition-colors border ${settings.showEmail
                                            ? "bg-black border-white"
                                            : "bg-neutral-300 dark:bg-neutral-600 border-neutral-400 dark:border-neutral-500"
                                            }`}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.showEmail ? "translate-x-6" : "translate-x-0.5"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Hide Branding (Pro only) */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium">Hide "Powered by" Branding</label>
                                        {!isPro && (
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Pro</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!isPro) {
                                                setIsPricingOpen(true);
                                                return;
                                            }
                                            updateSetting("hideBranding", !settings.hideBranding);
                                        }}
                                        className={`relative w-12 h-6 rounded-full transition-colors border ${settings.hideBranding
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:sticky lg:top-6 h-fit">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Live Preview</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Click the trigger button to see the widget in action
                                </p>
                                <WidgetPreview
                                    primaryColor={settings.primaryColor}
                                    position={settings.position}
                                    triggerIcon={settings.triggerIcon}
                                    borderRadius={settings.borderRadius}
                                    headerText={settings.headerText}
                                    showEmail={settings.showEmail}
                                    hideBranding={settings.hideBranding}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        </>
    );
}
