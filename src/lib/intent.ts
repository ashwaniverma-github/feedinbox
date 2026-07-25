export interface IntentOption {
    id: string;
    label: string;
}

export interface IntentSettings {
    enabled: boolean;
    question: string;
    options: IntentOption[];
    delaySeconds: number;
    highIntentEvent: string;
    conversionEvent: string;
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
    delaySeconds: 5,
    highIntentEvent: "high_intent",
    conversionEvent: "converted",
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
