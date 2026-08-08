"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    ChevronDown,
    AlertTriangle,
    Sparkles,
    Zap,
    MessageSquare,
} from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { AISetupPrompt } from "@/components/dashboard/ai-setup-prompt";
import { getEmbedCode } from "@/lib/snippets";
import Image from "next/image";

interface OnboardingData {
    goal: string;
    projectName: string;
    projectDomain: string;
}

const GOALS = [
    {
        id: "why_not_buy",
        label: "Find out why visitors don't buy",
        desc: "Ask one question when they abandon pricing or checkout",
        icon: Zap,
    },
    {
        id: "feedback",
        label: "Collect feedback",
        desc: "A widget for bug reports, ideas, and questions",
        icon: MessageSquare,
    },
    {
        id: "both",
        label: "Both",
        desc: "Start with the full toolkit",
        icon: Sparkles,
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [projectKey, setProjectKey] = useState("");
    const [projectId, setProjectId] = useState("");
    const [intentEnabled, setIntentEnabled] = useState(false);
    const [error, setError] = useState("");
    const [origin, setOrigin] = useState("");

    const [data, setData] = useState<OnboardingData>({
        goal: "",
        projectName: "",
        projectDomain: "",
    });

    const wantsWhyNotBuy = data.goal === "why_not_buy" || data.goal === "both";
    const setupMode: "feedback" | "why_not_buy" | "both" =
        data.goal === "both" ? "both" : data.goal === "feedback" ? "feedback" : "why_not_buy";
    const [showManual, setShowManual] = useState(false);

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    // Check if user already has projects
    useEffect(() => {
        const checkProjects = async () => {
            try {
                const res = await fetch("/api/projects");
                const projects = await res.json();
                if (Array.isArray(projects) && projects.length > 0) {
                    router.replace("/dashboard");
                }
            } catch (error) {
                console.error("Failed to check projects:", error);
            }
        };
        if (status === "authenticated") {
            checkProjects();
        }
    }, [status, router]);

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return !!data.goal;
            case 2:
                return data.projectName.trim().length > 0;
            case 3:
                return true;
            default:
                return false;
        }
    };

    const createProject = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.projectName,
                    domain: data.projectDomain || undefined,
                }),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || "Failed to create project");
            }

            const project = await res.json();
            setProjectKey(project.widgetKey);
            setProjectId(project.id);

            // Auto-enable Why-Not-Buy if that's their goal. Track whether it actually
            // succeeded so Step 3 only claims it's on when it really is.
            if (wantsWhyNotBuy) {
                try {
                    const enableRes = await fetch(`/api/projects/${project.id}/intent-settings`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ enabled: true }),
                    });
                    setIntentEnabled(enableRes.ok);
                } catch {
                    setIntentEnabled(false); // non-fatal; they can enable it in settings
                }
            }

            setCurrentStep(3);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep === 2) {
            createProject();
        } else if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const handleFinish = () => {
        router.push("/dashboard");
    };

    const eventSnippet = `// When a visitor opens pricing or starts checkout:
window.feedinbox('event', 'high_intent', { plan: 'pro' })

// When they close it without buying (shows the question right away):
window.feedinbox('event', 'abandoned')

// When they actually buy (this cancels the question):
window.feedinbox('event', 'converted')`;

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card/50 backdrop-blur-xl">
                <div className="mx-auto max-w-3xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Image
                                src="/feedinbox.png"
                                alt="Feedinbox"
                                width={120}
                                height={32}
                                className="h-8 rounded-full w-auto"
                            />
                            <span className="ml-2 text-lg font-bold tracking-tight">Feedinbox</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((step) => (
                                <div
                                    key={step}
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                                        currentStep === step
                                            ? "bg-primary text-primary-foreground"
                                            : currentStep > step
                                                ? "bg-primary/20 text-primary"
                                                : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {currentStep > step ? <Check className="h-4 w-4" /> : step}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-12">
                {/* Step 1: Goal */}
                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-foreground">
                                Welcome{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}! 👋
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                What do you want to do first?
                            </p>
                        </div>

                        <div className="space-y-3 max-w-xl mx-auto">
                            {GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setData((prev) => ({ ...prev, goal: goal.id }))}
                                    className={cn(
                                        "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                                        data.goal === goal.id
                                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                                            data.goal === goal.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        <goal.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-foreground">{goal.label}</div>
                                        <div className="text-sm text-muted-foreground">{goal.desc}</div>
                                    </div>
                                    {data.goal === goal.id && <Check className="h-5 w-5 text-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Create Project */}
                {currentStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-foreground">Create your first project</h1>
                            <p className="mt-2 text-muted-foreground">
                                A project is the site or app you'll install Feedinbox on.
                            </p>
                        </div>

                        <Card className="mx-auto max-w-md">
                            <CardContent className="p-6 space-y-6">
                                <Input
                                    label="Project Name"
                                    placeholder="My Awesome App"
                                    value={data.projectName}
                                    onChange={(e) => setData((prev) => ({ ...prev, projectName: e.target.value }))}
                                />
                                <Input
                                    label="Domain (optional)"
                                    placeholder="myapp.com"
                                    value={data.projectDomain}
                                    onChange={(e) => setData((prev) => ({ ...prev, projectDomain: e.target.value }))}
                                />
                                {error && <p className="text-sm text-destructive">{error}</p>}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Install */}
                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-10">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <Check className="h-7 w-7 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">Project created</h1>
                            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                                One last step: get the script onto your site. Hand the prompt to your
                                AI agent, or install it yourself.
                            </p>
                        </div>

                        <div className="mx-auto max-w-2xl space-y-5">
                            {/* State of the project, as one quiet list rather than the pair of
                                coloured banners that used to float between the sections. */}
                            <div className="rounded-xl border border-border bg-card p-5">
                                <h2 className="text-sm font-semibold text-foreground">What&apos;s ready</h2>
                                <ul className="mt-3 space-y-2.5 text-sm">
                                    <li className="flex items-start gap-2.5">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                                        <span className="text-muted-foreground">
                                            <span className="font-medium text-foreground">{data.projectName}</span>{" "}
                                            created, with its own project key.
                                        </span>
                                    </li>
                                    {wantsWhyNotBuy && (
                                        <li className="flex items-start gap-2.5">
                                            {intentEnabled ? (
                                                <>
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                                                    <span className="text-muted-foreground">
                                                        <span className="font-medium text-foreground">Why-Not-Buy is on.</span>{" "}
                                                        Change the question and options anytime in settings.
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                                    <span className="text-muted-foreground">
                                                        <span className="font-medium text-foreground">Why-Not-Buy is off.</span>{" "}
                                                        Turn it on from the project&apos;s Why-Not-Buy tab to start collecting.
                                                    </span>
                                                </>
                                            )}
                                        </li>
                                    )}
                                    {setupMode !== "why_not_buy" && (
                                        <li className="flex items-start gap-2.5">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                                            <span className="text-muted-foreground">
                                                <span className="font-medium text-foreground">Feedback widget is on.</span>{" "}
                                                It needs no extra code beyond the script.
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Primary path: AI agent */}
                            <AISetupPrompt projectKey={projectKey} mode={setupMode} origin={origin} />

                            {/* Secondary path: a real disclosure rather than a bare text link,
                                so it reads as an alternative and not an afterthought. */}
                            <div className="overflow-hidden rounded-xl border border-border">
                                <button
                                    onClick={() => setShowManual((s) => !s)}
                                    aria-expanded={showManual}
                                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                                >
                                    Prefer to install it yourself?
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                                            showManual && "rotate-180"
                                        )}
                                    />
                                </button>

                                {showManual && (
                                    <div className="space-y-6 border-t border-border p-5">
                                        <div className="space-y-3">
                                            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">1</span>
                                                Add the script to your site
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Paste this before the closing{" "}
                                                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">&lt;/body&gt;</code> tag.
                                            </p>
                                            <CodeBlock code={getEmbedCode("html", projectKey, origin)} language="html" filename="Your website" />
                                        </div>

                                        {wantsWhyNotBuy && (
                                            <div className="space-y-3">
                                                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">2</span>
                                                    Tell it when a visitor shows intent
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Call these from your pricing or checkout code. When a visitor
                                                    leaves without buying, the question appears.
                                                </p>
                                                <CodeBlock code={eventSnippet} language="javascript" filename="Your pricing / checkout code" />
                                            </div>
                                        )}

                                        <p className="text-sm text-muted-foreground">
                                            Full reference:{" "}
                                            <a href="/docs" target="_blank" rel="noopener" className="text-primary hover:underline">/docs</a>.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation. The final step centres its single button in its own row:
                    mx-auto inside justify-between does not actually centre it, since the
                    empty spacer and the button share the space between them. */}
                {currentStep < 3 ? (
                    <div className="mt-10 flex items-center justify-between">
                        {currentStep > 1 ? (
                            <Button variant="ghost" onClick={handleBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        <Button onClick={handleNext} disabled={!canProceed() || loading}>
                            {loading ? (
                                <Loading size="sm" />
                            ) : (
                                <>
                                    {currentStep === 2 ? "Create Project" : "Continue"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="mt-10 flex justify-center">
                        <Button onClick={handleFinish} size="lg">
                            Go to Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
