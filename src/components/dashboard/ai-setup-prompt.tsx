"use client";

import { CodeBlock } from "@/components/ui/code-block";
import { Sparkles } from "lucide-react";

type Mode = "feedback" | "why_not_buy" | "both";

function buildPrompt(mode: Mode, projectKey: string, origin: string) {
    const guide = `Read ${origin}/llms.txt (the Feedinbox integration guide) and integrate Feedinbox into my app. Detect my framework and use the right approach.`;

    if (mode === "feedback") {
        return `${guide}

Add the Feedinbox feedback widget using data-project-key="${projectKey}". Include the queue stub line before the script.`;
    }

    const bothLine =
        mode === "both"
            ? `\n5. This also turns on the floating feedback widget, which needs no extra code.`
            : "";

    return `${guide}

Project key: ${projectKey}

1. Add the widget script with data-project-key="${projectKey}" (include the queue stub line before it).
2. Fire window.feedinbox('event', 'high_intent', { plan: '<plan the visitor viewed>' }) when someone opens pricing or starts checkout.
3. Fire window.feedinbox('event', 'abandoned') from a deliberate close action (the pricing modal's close button, checkout cancel) so the question appears right then. Do NOT fire it from a useEffect cleanup, unmount, or beforeunload: React Strict Mode double-invokes effects so it would fire on arrival, and the widget already detects page-level exits on its own.
4. Fire window.feedinbox('event', 'converted') on my payment-success step so buyers are never asked.${bothLine}`;
}

export function AISetupPrompt({
    projectKey,
    mode,
    origin,
}: {
    projectKey: string;
    mode: Mode;
    origin: string;
}) {
    const prompt = buildPrompt(mode, projectKey, origin);

    return (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Set it up with your AI assistant</h3>
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Fastest
                </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                Paste this into Cursor, Claude Code, Copilot, or any AI coding agent. It reads our guide
                and wires Feedinbox into your codebase for you.
            </p>
            <CodeBlock code={prompt} language="text" filename="Prompt for your AI assistant" />
            <p className="text-xs text-muted-foreground mt-3">
                It reads{" "}
                <a href={`${origin}/llms.txt`} target="_blank" rel="noopener" className="text-primary hover:underline">
                    {origin.replace(/^https?:\/\//, "")}/llms.txt
                </a>
                , a complete plain-text guide written for AI agents. Full docs:{" "}
                <a href="/docs" target="_blank" rel="noopener" className="text-primary hover:underline">
                    /docs
                </a>
                .
            </p>
        </div>
    );
}
