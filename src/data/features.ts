import {
    Mail,
    Zap,
    Bell,
    Eye,
    Inbox
} from "lucide-react";

export interface Feature {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    description: string;
    icon: string;
    heroHeadline: string;
    heroSubheadline: string;
    benefits: {
        title: string;
        description: string;
    }[];
    keywords: string[];
}

export const features: Feature[] = [
    {
        slug: "feedback-to-email",
        title: "Answers and feedback in your inbox",
        metaTitle: "Get Feedback and Drop-off Reasons in Your Email Inbox",
        metaDescription: "Feedinbox tells you why visitors don't buy and collects feedback, delivered to your inbox. A weekly Why-Not-Buy digest plus instant feedback emails. Set up in minutes.",
        description: "Feedinbox is two things in one: a Why-Not-Buy question that catches abandoning visitors, and a feedback widget. Both land in your inbox, no dashboard hopping required.",
        icon: "Mail",
        heroHeadline: "Why they didn't buy, straight to your inbox",
        heroSubheadline: "Feedinbox asks abandoning visitors one question and emails you a weekly summary of the reasons, plus instant emails for any feedback your users send.",
        benefits: [
            {
                title: "Weekly Why-Not-Buy digest",
                description: "The top reasons people didn't buy, summarized and emailed to you every week. No dashboard to babysit."
            },
            {
                title: "Instant feedback alerts",
                description: "Bug reports and ideas from the feedback widget hit your inbox the second they're submitted."
            },
            {
                title: "Context included",
                description: "Every Why-Not-Buy answer is tagged with the plan the visitor viewed and their country, so you know who is dropping off."
            },
            {
                title: "Works with any email client",
                description: "Gmail, Outlook, Apple Mail, Superhuman. If it reads email, it works with Feedinbox."
            }
        ],
        keywords: ["why visitors don't buy", "drop-off reasons email", "feedback to email", "exit intent email", "conversion feedback"]
    },
    {
        slug: "email-feedback-widget",
        title: "One widget, two jobs",
        metaTitle: "Exit-Intent Question and Feedback Widget in One Script",
        metaDescription: "One embeddable script gives you a Why-Not-Buy exit-intent question and a feedback widget. Find out why visitors don't buy and collect feedback, all in your inbox.",
        description: "A single lightweight script that does two jobs: catches abandoning visitors with one question, and collects feedback the rest of the time.",
        icon: "Inbox",
        heroHeadline: "The widget that tells you why they left",
        heroSubheadline: "Most tools only collect general feedback. Feedinbox also asks the one commercial question that matters: what stopped you from buying?",
        benefits: [
            {
                title: "Why-Not-Buy at the core",
                description: "When a visitor abandons pricing or checkout, a small card asks why. Two taps, and you have the reason."
            },
            {
                title: "Feedback widget included",
                description: "A floating button for bugs, ideas, and questions, on the same script and dashboard."
            },
            {
                title: "One lightweight embed",
                description: "Just one script tag. No heavy SDKs, no performance hit on your site."
            },
            {
                title: "Turn either on or off",
                description: "Run Why-Not-Buy on its own, the feedback button on its own, or both. Toggle it in the dashboard."
            }
        ],
        keywords: ["exit intent widget", "why not buy widget", "feedback widget", "abandonment survey widget", "one line feedback"]
    },
    {
        slug: "instant-email-alerts",
        title: "Instant alerts and weekly summaries",
        metaTitle: "Instant Feedback Alerts and Weekly Why-Not-Buy Summaries",
        metaDescription: "Get instant email alerts for user feedback and a weekly summary of why visitors didn't buy. Never miss a critical bug or a costly drop-off pattern.",
        description: "Feedback reaches you instantly. Why-Not-Buy reasons are rolled up into a weekly summary so you see the pattern, not the noise.",
        icon: "Bell",
        heroHeadline: "Never miss a reason or a bug",
        heroSubheadline: "Critical bug from the feedback widget? Emailed in seconds. Why people didn't buy this week? Summarized every Monday.",
        benefits: [
            {
                title: "Instant feedback delivery",
                description: "Feedback emails are sent within milliseconds of submission. No batching, no delays."
            },
            {
                title: "Weekly Why-Not-Buy roundup",
                description: "The reasons people abandoned, ranked, so you can act on the pattern instead of one-off replies."
            },
            {
                title: "Clear subject lines",
                description: "Feedback type and drop-off reason are labeled in the subject so you can triage from the inbox."
            },
            {
                title: "Reply from anywhere",
                description: "It's all email, so you get it on your phone and can act from wherever you are."
            }
        ],
        keywords: ["feedback alerts", "why not buy summary", "conversion drop-off report", "bug report notifications", "weekly feedback digest"]
    },
    {
        slug: "no-dashboard-feedback",
        title: "Insights without dashboard fatigue",
        metaTitle: "Know Why Visitors Don't Buy, No Dashboard Required",
        metaDescription: "Feedinbox emails you why visitors didn't buy and any feedback they send. Less dashboard hopping, more acting on what's blocking your sales.",
        description: "You already have too many dashboards. Feedinbox pushes the reasons people don't buy, and any feedback, straight to your email.",
        icon: "Eye",
        heroHeadline: "One less dashboard to check",
        heroSubheadline: "You already live in your inbox. Feedinbox delivers Why-Not-Buy reasons and feedback there, with a dashboard waiting only when you want to dig deeper.",
        benefits: [
            {
                title: "Comes to you",
                description: "Drop-off reasons and feedback arrive by email. Your inbox is the command center."
            },
            {
                title: "Dashboard when you want it",
                description: "A full dashboard is there for trends and filtering, but you're not forced to check it."
            },
            {
                title: "Act on patterns fast",
                description: "See the number one reason people don't buy without logging into anything."
            },
            {
                title: "Focus on building",
                description: "Less tab-switching, more time fixing the leak that's blocking your revenue."
            }
        ],
        keywords: ["simple exit intent tool", "no dashboard feedback", "why not buy email", "minimal conversion tool", "drop-off reasons"]
    },
    {
        slug: "inbox-feedback-tool",
        title: "Built for founders who live in their inbox",
        metaTitle: "Why-Not-Buy and Feedback Tool for Founders and Developers",
        metaDescription: "Find out why visitors don't buy and collect feedback, delivered to your inbox. Built for founders and developers who value simplicity. Free to start.",
        description: "A tool for people who'd rather get answers in email than log into another app. One script, Why-Not-Buy plus feedback.",
        icon: "Zap",
        heroHeadline: "Answers where you already work",
        heroSubheadline: "Built for founders and developers who move fast. Add one script, find out why visitors don't buy, and collect feedback, all in your inbox.",
        benefits: [
            {
                title: "Developer friendly",
                description: "One script tag, and one line to fire the high-intent event. Under a few minutes with your AI agent."
            },
            {
                title: "Founder focused",
                description: "Perfect for indie hackers and early-stage startups trying to fix a leaky funnel."
            },
            {
                title: "No vendor lock-in",
                description: "Answers arrive by email and export anytime. No data held hostage."
            },
            {
                title: "Generous free tier",
                description: "Start for free. Upgrade only when you're ready to customize."
            }
        ],
        keywords: ["why not buy tool", "exit intent for founders", "conversion feedback tool", "indie hacker conversion tool", "inbox feedback tool"]
    }
];

export function getFeatureBySlug(slug: string): Feature | undefined {
    return features.find((f) => f.slug === slug);
}

export function getAllFeatureSlugs(): string[] {
    return features.map((f) => f.slug);
}
