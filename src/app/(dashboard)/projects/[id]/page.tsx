"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SwipeableFeedbackCard } from "@/components/ui/swipeable-feedback-card";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { PricingModal } from "@/components/ui/pricing-modal";
import { IntentResponses } from "@/components/dashboard/intent-responses";
import { formatDate } from "@/lib/utils";
import { Settings, MessageSquare, Bug, Lightbulb, HelpCircle, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Feedback, Project } from "@/types";

interface FeedbacksResponse {
    feedbacks: Feedback[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: session } = useSession();
    const isPro = session?.user?.subscriptionStatus === "active";
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [tab, setTab] = useState<"feedback" | "intent">("intent");
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [category, setCategory] = useState("all");
    const [isRead, setIsRead] = useState("all");

    useEffect(() => {
        const t = new URLSearchParams(window.location.search).get("tab");
        if (t === "feedback") setTab("feedback");
        else if (t === "intent") setTab("intent");
    }, []);

    useEffect(() => {
        fetchProject();
    }, [id]);

    useEffect(() => {
        fetchFeedbacks();
    }, [id, category, isRead, pagination.page]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${id}`);
            const data = await res.json();
            setProject(data);
        } catch (error) {
            console.error("Failed to fetch project:", error);
        }
    };

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: "20",
                ...(category !== "all" && { category }),
                ...(isRead !== "all" && { isRead }),
            });

            const res = await fetch(`/api/projects/${id}/feedbacks?${params}`);
            const data: FeedbacksResponse = await res.json();
            setFeedbacks(data.feedbacks);
            setPagination((prev) => ({ ...prev, totalPages: data.pagination.totalPages }));
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (feedbackId: string) => {
        try {
            await fetch(`/api/projects/${id}/feedbacks/${feedbackId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: true }),
            });
            setFeedbacks((prev) =>
                prev.map((f) => (f.id === feedbackId ? { ...f, isRead: true } : f))
            );
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const deleteFeedback = async (feedbackId: string) => {
        try {
            await fetch(`/api/projects/${id}/feedbacks/${feedbackId}`, {
                method: "DELETE",
            });
            setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
        } catch (error) {
            console.error("Failed to delete feedback:", error);
        }
    };

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case "bug":
                return <Bug className="h-4 w-4 text-rose-400" />;
            case "feature":
                return <Lightbulb className="h-4 w-4 text-amber-400" />;
            case "question":
                return <HelpCircle className="h-4 w-4 text-blue-400" />;
            default:
                return <MessageSquare className="h-4 w-4 text-neutral-500" />;
        }
    };

    if (!project && loading) {
        return <LoadingPage />;
    }

    return (
        <>
            <Header
                title={project?.name || "Project"}
                action={
                    <div className="flex gap-1 sm:gap-2">
                        <Link href={`/projects/${id}/widget`}>
                            <Button variant="secondary" size="sm" className="px-2 sm:px-3">
                                <Palette className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Widget</span>
                            </Button>
                        </Link>
                        <Link href={`/projects/${id}/settings`}>
                            <Button variant="secondary" size="sm" className="px-2 sm:px-3">
                                <Settings className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Settings</span>
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="p-4 md:p-8">
                {/* Tabs */}
                <div className="mb-6 flex items-center justify-between gap-2">
                    <div className="flex gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 w-fit">
                        <button
                            onClick={() => setTab("intent")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                                tab === "intent"
                                    ? "bg-white dark:bg-black text-foreground shadow-sm"
                                    : "text-neutral-500 hover:text-foreground"
                            )}
                        >
                            <Zap className="h-4 w-4" />
                            Why-Not-Buy
                        </button>
                        <button
                            onClick={() => setTab("feedback")}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                                tab === "feedback"
                                    ? "bg-white dark:bg-black text-foreground shadow-sm"
                                    : "text-neutral-500 hover:text-foreground"
                            )}
                        >
                            <MessageSquare className="h-4 w-4" />
                            Feedback
                        </button>
                    </div>
                    {tab === "intent" && (
                        <div className="flex gap-2">
                            <ExportDropdown
                                projectId={id}
                                isPro={isPro}
                                onUpgradeClick={() => setIsPricingOpen(true)}
                                endpoint={`/api/projects/${id}/intent-responses/export`}
                                filenamePrefix="why-not-buy-export"
                            />
                            <Link href={`/projects/${id}/why-not-buy`}>
                                <Button variant="secondary" size="sm">
                                    <Settings className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Configure</span>
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {tab === "intent" ? (
                    <IntentResponses projectId={id} />
                ) : (
                <>
                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={[
                            { value: "all", label: "All Categories" },
                            { value: "general", label: "General" },
                            { value: "bug", label: "Bug" },
                            { value: "feature", label: "Feature" },
                            { value: "question", label: "Question" },
                        ]}
                    />
                    <Select
                        value={isRead}
                        onChange={(e) => setIsRead(e.target.value)}
                        options={[
                            { value: "all", label: "All Status" },
                            { value: "unread", label: "Unread" },
                            { value: "read", label: "Read" },
                        ]}
                    />
                </div>

                {/* Feedbacks List */}
                {feedbacks.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <MessageSquare className="mx-auto h-8 w-8 text-neutral-300" />
                            <p className="mt-2 text-neutral-500">No feedback found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {feedbacks.map((feedback, index) => (
                            <SwipeableFeedbackCard
                                key={feedback.id}
                                isRead={feedback.isRead}
                                isFirstCard={index === 0}
                                onDelete={() => deleteFeedback(feedback.id)}
                                onMarkAsRead={() => markAsRead(feedback.id)}
                            >
                                <Card className={!feedback.isRead ? "border-l-4 border-l-neutral-900 dark:border-l-white" : ""}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">{getCategoryIcon(feedback.category)}</div>
                                            <div className="flex-1">
                                                <p className="text-sm">{feedback.message}</p>
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    <Badge>{feedback.category}</Badge>
                                                    {feedback.userEmail && (
                                                        <span className="text-xs text-neutral-500">
                                                            {feedback.userEmail}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-neutral-400">
                                                        {formatDate(feedback.createdAt)}
                                                    </span>
                                                </div>
                                                {feedback.pageUrl && (
                                                    <p className="mt-1 truncate text-xs text-neutral-400">
                                                        {feedback.pageUrl}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SwipeableFeedbackCard>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-neutral-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                )}
                </>
                )}
            </div>

            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        </>
    );
}
