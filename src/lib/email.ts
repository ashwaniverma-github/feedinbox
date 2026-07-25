import { Resend } from "resend";

// Resend's constructor throws on a missing/empty key, which would crash at import
// time (500-ing every route that imports this module) when RESEND_API_KEY isn't set
// locally. Fall back to a placeholder so imports never throw; actual .send() calls
// are always wrapped in try/catch and will no-op/fail gracefully without a real key.
export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

export const resend = new Resend(process.env.RESEND_API_KEY || "re_missing_key_placeholder");

export const FROM_EMAIL = "Feedinbox <hello@feedinbox.com>";
