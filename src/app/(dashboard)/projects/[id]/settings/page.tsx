"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { CodeBlock } from "@/components/ui/code-block";
import { Trash2, Code2, FileCode, Cpu, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmbedCode } from "@/lib/snippets";
import { AISetupPrompt } from "@/components/dashboard/ai-setup-prompt";
import type { Project } from "@/types";

export default function ProjectSettingsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [framework, setFramework] = useState<"nextjs" | "react" | "html">("nextjs");
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${id}`);
            const data = await res.json();
            setProject(data);
            setName(data.name);
            setDomain(data.domain || "");
        } catch (error) {
            console.error("Failed to fetch project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, domain: domain || null }),
            });
            setProject((p) => (p ? { ...p, name, domain } : null));
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }
        setDeleting(true);
        try {
            await fetch(`/api/projects/${id}`, { method: "DELETE" });
            router.push("/projects");
        } catch (error) {
            console.error("Failed to delete:", error);
            setDeleting(false);
        }
    };

    // Local getEmbedCode removed coverage

    if (loading || !origin) {
        return (
            <>
                <Header title="Settings" />
                <div className="flex items-center justify-center p-8">
                    <Loading size="lg" />
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Project Settings" description={project?.name} />

            <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-8">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Update your project settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <Input
                                label="Project Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Input
                                label="Domain (optional)"
                                placeholder="https://myapp.com"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                            />
                            <Button type="submit" disabled={saving}>
                                {saving ? <Loading size="sm" /> : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* AI-assisted install (fastest) */}
                {project?.widgetKey && (
                    <AISetupPrompt projectKey={project.widgetKey} mode="both" origin={origin} />
                )}

                {/* Widget Code */}
                <Card>
                    <CardHeader>
                        <CardTitle>Manual installation</CardTitle>
                        <CardDescription>
                            Prefer to wire it up yourself? Copy the snippet for your framework.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Framework Selector */}
                        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <button
                                onClick={() => setFramework("nextjs")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                                    framework === "nextjs"
                                        ? "bg-white dark:bg-black text-foreground shadow-sm"
                                        : "text-neutral-500 hover:text-foreground"
                                )}
                            >
                                <Cpu className="h-4 w-4" />
                                Next.js
                            </button>
                            <button
                                onClick={() => setFramework("react")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                                    framework === "react"
                                        ? "bg-white dark:bg-black text-foreground shadow-sm"
                                        : "text-neutral-500 hover:text-foreground"
                                )}
                            >
                                <Code2 className="h-4 w-4" />
                                React
                            </button>
                            <button
                                onClick={() => setFramework("html")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                                    framework === "html"
                                        ? "bg-white dark:bg-black text-foreground shadow-sm"
                                        : "text-neutral-500 hover:text-foreground"
                                )}
                            >
                                <FileCode className="h-4 w-4" />
                                HTML
                            </button>
                        </div>
                        <CodeBlock
                            code={getEmbedCode(
                                framework,
                                project?.widgetKey || "pk_xxx",
                                origin
                            )}
                            language={framework === "html" ? "html" : "typescript"}
                            filename={
                                framework === "nextjs" ? "app/layout.tsx" :
                                    framework === "react" ? "App.tsx" :
                                        "index.html"
                            }
                        />

                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
                            <p className="text-sm text-neutral-500">
                                <strong>Project Key:</strong>{" "}
                                <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">
                                    {project?.widgetKey}
                                </code>
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <a
                                    href="/docs"
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    Read the docs
                                </a>
                                <a
                                    href={`${origin}/llms.txt`}
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-foreground"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    AI integration guide (llms.txt)
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200 dark:border-red-900">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>
                            Permanently delete this project and all its feedback
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <Loading size="sm" />
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Project
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
