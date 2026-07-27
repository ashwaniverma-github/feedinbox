"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyableFeedback = {
    message: string;
    category?: string | null;
    userEmail?: string | null;
    pageUrl?: string | null;
    createdAt: string | Date;
};

/**
 * Renders one feedback as a plain-text block that stays readable wherever it
 * lands: an email reply, Slack, or a GitHub issue. Header lines first (so the
 * context reads at a glance), then the message on its own, which also keeps a
 * multi-line message from tangling with the metadata.
 *
 * Absent fields are omitted rather than left as empty labels.
 */
export function formatFeedback(feedback: CopyableFeedback): string {
    const heading = feedback.category
        ? `${feedback.category.charAt(0).toUpperCase()}${feedback.category.slice(1)} feedback`
        : "Feedback";

    const lines = [heading];

    const received = new Date(feedback.createdAt);
    if (!Number.isNaN(received.getTime())) {
        lines.push(
            `Received: ${received.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
            })}`
        );
    }
    if (feedback.userEmail) lines.push(`From: ${feedback.userEmail}`);
    if (feedback.pageUrl) lines.push(`Page: ${feedback.pageUrl}`);

    lines.push("", feedback.message.trim());

    return lines.join("\n");
}

/**
 * Copies the whole feedback (message, sender, page, timestamp) in one click.
 */
export function CopyFeedback({
    feedback,
    className,
}: {
    feedback: CopyableFeedback;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const copy = async (e: React.MouseEvent) => {
        // These cards are swipeable and clickable, so this action must not bubble.
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(formatFeedback(feedback));
            setCopied(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be denied or unavailable outside a secure
            // context. Leave the state alone rather than claiming a copy.
            console.error("Could not copy feedback to clipboard");
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            title={copied ? "Copied" : "Copy feedback details"}
            aria-label={copied ? "Feedback copied to clipboard" : "Copy feedback details"}
            className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                className
            )}
        >
            {copied ? (
                <>
                    <Check className="h-3 w-3 text-green-600" aria-hidden="true" />
                    Copied
                </>
            ) : (
                <>
                    <Copy className="h-3 w-3" aria-hidden="true" />
                    Copy
                </>
            )}
            <span className="sr-only" role="status" aria-live="polite">
                {copied ? "Feedback copied to clipboard" : ""}
            </span>
        </button>
    );
}
