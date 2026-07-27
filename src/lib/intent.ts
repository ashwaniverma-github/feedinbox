export interface IntentOption {
    id: string;
    label: string;
}

export type NotifyFrequency = "instant" | "weekly" | "off";

export interface IntentSettings {
    enabled: boolean;
    question: string;
    options: IntentOption[];
    // Fallback timer: if no exit signal fires after highIntentEvent, the card
    // shows anyway after this many seconds. Exit signals (pointer leaving the
    // viewport top, tab hidden, or the abandon event) can show it sooner.
    delaySeconds: number;
    // When false the fallback timer is skipped entirely and the card waits for a
    // real exit signal, so a visitor still reading is never interrupted. Safe
    // because the automatic signals stay armed, but it narrows mobile coverage:
    // there is no mouseout on touch devices, leaving only tab-hidden and the
    // abandon event.
    fallbackEnabled: boolean;
    highIntentEvent: string;
    conversionEvent: string;
    // Host-fired "closed pricing/checkout without buying" signal. Shows the
    // card immediately; also works standalone without a prior high-intent event.
    abandonEvent: string;
    // Remove the "Powered by Feedinbox" footer on the card (Pro customization).
    hideBranding: boolean;
    // How the owner is notified of responses: an email per response, a weekly
    // digest, or no emails. Preference (not customization) so it's free for all tiers.
    notifyFrequency: NotifyFrequency;
}

export const DEFAULT_INTENT_SETTINGS: IntentSettings = {
    enabled: false,
    question: "What stopped you?",
    options: [
        { id: "too_expensive", label: "Too expensive" },
        { id: "unclear_value", label: "Not sure what I get" },
        { id: "missing_feature", label: "Need a feature you don't have" },
        { id: "just_looking", label: "Just looking" },
    ],
    delaySeconds: 30,
    fallbackEnabled: true,
    highIntentEvent: "high_intent",
    conversionEvent: "converted",
    abandonEvent: "abandoned",
    hideBranding: false,
    notifyFrequency: "weekly",
};

export const MAX_INTENT_OPTIONS = 6;
export const MIN_DELAY_SECONDS = 1;
export const MAX_DELAY_SECONDS = 60;

// Read stored intent settings off a Project.settings JSON blob, filling defaults.
export function readIntentSettings(projectSettings: unknown): IntentSettings {
    const stored = (projectSettings as { intentWidget?: Partial<IntentSettings> })?.intentWidget || {};
    return {
        ...DEFAULT_INTENT_SETTINGS,
        ...stored,
        options: Array.isArray(stored.options) && stored.options.length > 0
            ? stored.options
            : DEFAULT_INTENT_SETTINGS.options,
    };
}

// Resolve the settings the public widget should use.
// `enabled` is honored for every tier; question/options/delay/event customization
// only applies for Pro; free tier always serves the defaults for those fields.
export function resolveIntentSettingsForWidget(
    projectSettings: unknown,
    ownerIsPro: boolean
): IntentSettings {
    const stored = readIntentSettings(projectSettings);
    if (ownerIsPro) return stored;
    return {
        ...DEFAULT_INTENT_SETTINGS,
        enabled: stored.enabled,
    };
}
