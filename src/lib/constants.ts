// Single source of truth for the support address, so pages/components (some
// client-side) don't need to import lib/email.ts, which constructs a Resend
// client at module scope and would drag that SDK into their bundle.
export const SUPPORT_EMAIL = "support@feedinbox.com";
