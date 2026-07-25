"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { ProjectSelector } from "@/components/ui/project-selector";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { PricingModal } from "@/components/ui/pricing-modal";
import { SwipeableFeedbackCard } from "@/components/ui/swipeable-feedback-card";
import { formatDate } from "@/lib/utils";
import { OverviewGraph } from "@/components/dashboard/overview-graph";
import { WhyNotBuyOverview } from "@/components/dashboard/why-not-buy-overview";
import { Plus, MessageSquare, Bug, Lightbulb, HelpCircle, ArrowUpRight, Inbox, CheckCircle2 } from "lucide-react";

interface Analytics {
    total: number;
    unread: number;
    today: number;
    thisWeek: number;
    categories: {
        general: number;
        bug: number;
        feature: number;
        question: number;
    };
    chartData: { date: number; label: string; count: number; general: number; bug: number; feature: number; question: number }[];
}

interface Feedback {
    id: string;
    message: string;
    category: string;
    isRead: boolean;
    createdAt: string;
    project: { name: string };
}

interface Project {
    id: string;
    name: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([]);
    const [dateRange, setDateRange] = useState("30d");
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    const isPro = session?.user?.subscriptionStatus === "active";

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchDashboardData(selectedProject, dateRange);
        }
    }, [selectedProject, dateRange]);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();

            // Check if data is an array (valid response)
            if (!Array.isArray(data)) {
                console.error("Invalid projects response:", data);
                setLoading(false);
                return;
            }

            // Redirect to onboarding if no projects
            if (data.length === 0) {
                router.replace("/onboarding");
                return;
            }

            setProjects(data);
            setSelectedProject(data[0].id);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            setLoading(false);
        }
    };

    const fetchDashboardData = async (projectId: string, range: string) => {
        setLoading(true);
        try {
            const [analyticsRes, feedbacksRes] = await Promise.all([
                fetch(`/api/projects/${projectId}/analytics?range=${range}`),
                fetch(`/api/projects/${projectId}/feedbacks?limit=5`),
            ]);

            const analyticsData = await analyticsRes.json();
            const feedbacksData = await feedbacksRes.json();

            setAnalytics(analyticsData);
            setRecentFeedbacks(feedbacksData.feedbacks || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "bug":
                return <Bug className="h-4 w-4 text-destructive" />;
            case "feature":
                return <Lightbulb className="h-4 w-4 text-warning" />;
            case "question":
                return <HelpCircle className="h-4 w-4 text-blue-500" />;
            default:
                return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
        }
    };

    if (status === "loading" || loading) {
        return <LoadingPage />;
    }

    if (projects.length === 0) {
        return (
            <>
                <Header title="Dashboard" />
                <div className="flex flex-col items-center justify-center p-8 py-24 text-center">
                    <div className="rounded-full bg-muted p-4">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold text-foreground">No projects yet</h2>
                    <p className="mt-2 text-muted-foreground max-w-sm">
                        Create your first project to start collecting feedback.
                    </p>
                    <Link href="/projects/new" className="mt-6">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                        </Button>
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Header
                title="Dashboard"
                action={
                    <ProjectSelector
                        projects={projects}
                        selectedId={selectedProject}
                        onSelect={setSelectedProject}
                    />
                }
            />

            <div className="p-4 md:p-8">
                {/* Why-Not-Buy: the headline of the product */}
                {selectedProject && <WhyNotBuyOverview projectId={selectedProject} />}

                {/* Feedback section header with Export */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <MessageSquare className="h-5 w-5" />
                        Feedback
                    </h2>
                    {selectedProject && (
                        <ExportDropdown
                            projectId={selectedProject}
                            isPro={isPro}
                            onUpgradeClick={() => setIsPricingOpen(true)}
                        />
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Inbox className="h-4 w-4" />
                                Total Feedback
                            </div>
                            <p className="mt-2 text-3xl font-bold text-foreground">{analytics?.total || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                Unread
                            </div>
                            <p className="mt-2 text-3xl font-bold text-foreground">{analytics?.unread || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4" />
                                Today
                            </div>
                            <p className="mt-2 text-3xl font-bold text-foreground">{analytics?.today || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <ArrowUpRight className="h-4 w-4" />
                                This Week
                            </div>
                            <p className="mt-2 text-3xl font-bold text-foreground">{analytics?.thisWeek || 0}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Overview Graph */}
                <div className="mt-8">
                    <OverviewGraph
                        data={analytics?.chartData || []}
                        range={dateRange}
                        onRangeChange={setDateRange}
                        loading={loading}
                    />
                </div>

                {/* Recent Feedback */}
                <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Recent Feedback</h2>
                        <Link
                            href={`/projects/${selectedProject}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            View all →
                        </Link>
                    </div>

                    {recentFeedbacks.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                    <Inbox className="h-6 w-6" />
                                </div>
                                <p className="mt-4 text-muted-foreground">No feedback yet</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {recentFeedbacks.map((feedback, index) => (
                                <SwipeableFeedbackCard
                                    key={feedback.id}
                                    isRead={feedback.isRead}
                                    isFirstCard={index === 0}
                                    onDelete={async () => {
                                        try {
                                            const res = await fetch(`/api/projects/${selectedProject}/feedbacks/${feedback.id}`, {
                                                method: "DELETE",
                                            });
                                            if (res.ok) {
                                                setRecentFeedbacks(prev => prev.filter(f => f.id !== feedback.id));
                                            }
                                        } catch (error) {
                                            console.error("Failed to delete feedback:", error);
                                        }
                                    }}
                                    onMarkAsRead={async () => {
                                        try {
                                            const res = await fetch(`/api/projects/${selectedProject}/feedbacks/${feedback.id}`, {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ isRead: true }),
                                            });
                                            if (res.ok) {
                                                setRecentFeedbacks(prev =>
                                                    prev.map(f => f.id === feedback.id ? { ...f, isRead: true } : f)
                                                );
                                            }
                                        } catch (error) {
                                            console.error("Failed to mark as read:", error);
                                        }
                                    }}
                                >
                                    <Card className="p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 rounded-lg bg-muted p-2">
                                                {getCategoryIcon(feedback.category)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm text-foreground">{feedback.message}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge variant={feedback.isRead ? "secondary" : "default"}>
                                                        {feedback.category}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(feedback.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </SwipeableFeedbackCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pricing Modal */}
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        </>
    );
}
