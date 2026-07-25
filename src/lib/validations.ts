import { z } from "zod/v4";

// Helper to normalize domain - adds https:// if no protocol
const normalizeDomain = (val: string | undefined) => {
    if (!val || val.trim() === "") return undefined;
    const trimmed = val.trim();
    // If it already has a protocol, validate as-is
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }
    // Otherwise, add https:// prefix
    return `https://${trimmed}`;
};

export const createProjectSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    domain: z.string().optional().transform(normalizeDomain).pipe(z.string().url("Please enter a valid domain").optional()),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    domain: z.string().optional().transform(normalizeDomain).pipe(z.string().url("Please enter a valid domain").optional()),
});

export const createFeedbackSchema = z.object({
    projectKey: z.string().min(1, "Project key is required"),
    message: z.string().min(1, "Message is required").max(5000),
    category: z.enum(["general", "bug", "feature", "question"]).default("general"),
    userEmail: z.string().optional().transform((val) => {
        if (!val || val.trim() === "") return undefined;
        return val;
    }).pipe(z.string().email().optional()),
    // pageUrl is intentionally lenient: the widget is a public API embedded on any
    // website, so it can receive non-standard URLs (localhost, file://, chrome-extension://).
    // Rather than rejecting the whole submission with a 400, we strip invalid URLs to
    // undefined so feedback is still saved and the email notification is still sent.
    pageUrl: z.string().optional().transform((val) => {
        if (!val || val.trim() === '') return undefined;
        try { new URL(val); return val; } catch { return undefined; }
    }),
});

export const createIntentResponseSchema = z.object({
    projectKey: z.string().min(1, "Project key is required"),
    sessionId: z.string().min(1).max(200),
    eventName: z.string().min(1).max(100),
    optionId: z.string().max(100).optional(),
    optionLabel: z.string().max(200).optional(),
    text: z.string().max(2000).optional().transform((val) => {
        if (!val || val.trim() === "") return undefined;
        return val.trim();
    }),
    context: z.record(z.string(), z.unknown()).optional().default({}),
    // Lenient like createFeedbackSchema: the widget runs on any site, so strip
    // invalid URLs to undefined rather than rejecting the whole submission.
    pageUrl: z.string().optional().transform((val) => {
        if (!val || val.trim() === '') return undefined;
        try { new URL(val); return val; } catch { return undefined; }
    }),
});

export const feedbackFilterSchema = z.object({
    category: z.enum(["all", "general", "bug", "feature", "question"]).default("all"),
    isRead: z.enum(["all", "read", "unread"]).default("all"),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type CreateIntentResponseInput = z.infer<typeof createIntentResponseSchema>;
export type FeedbackFilterInput = z.infer<typeof feedbackFilterSchema>;
