export interface Alternative {
    slug: string;
    competitorName: string;
    metaTitle: string;
    metaDescription: string;
    heroHeadline: string;
    heroSubheadline: string;
    comparison: {
        feature: string;
        feedinbox: string;
        competitor: string;
    }[];
    advantages: {
        title: string;
        description: string;
    }[];
    keywords: string[];
}

export const alternatives: Alternative[] = [
    {
        slug: "canny",
        competitorName: "Canny",
        metaTitle: "Feedinbox vs Canny - Know Why Visitors Don't Buy",
        metaDescription: "Canny collects feature requests. Feedinbox tells you why visitors don't buy, with an exit-intent question, plus a feedback widget. Simpler and more affordable.",
        heroHeadline: "Canny alternative that tells you why they didn't buy",
        heroSubheadline: "Canny is a roadmap and voting tool. Feedinbox answers the commercial question Canny can't: why did the visitor not buy? Plus a feedback widget.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓ Boards" },
            { feature: "Answers in your inbox", feedinbox: "✓ Weekly digest", competitor: "✗ Dashboard only" },
            { feature: "Public Roadmap / Voting", feedinbox: "✗", competitor: "✓" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $79/mo" }
        ],
        advantages: [
            { title: "Answers the money question", description: "Learn why visitors don't buy, not just what features people want." },
            { title: "Feedback included", description: "A feedback widget for bugs and ideas, on the same script." },
            { title: "7x cheaper", description: "Start at $10.99/mo instead of $79/mo." },
            { title: "Inbox-first", description: "Reasons and feedback come to your email, not another portal." }
        ],
        keywords: ["canny alternative", "canny vs feedinbox", "why visitors don't buy", "exit intent alternative to canny", "conversion feedback tool"]
    },
    {
        slug: "uservoice",
        competitorName: "UserVoice",
        metaTitle: "Feedinbox vs UserVoice - Why-Not-Buy + Feedback",
        metaDescription: "UserVoice is enterprise feedback software. Feedinbox tells you why visitors don't buy and collects feedback, for indie hackers and small teams. From $10.99/mo.",
        heroHeadline: "UserVoice alternative for the rest of us",
        heroSubheadline: "UserVoice is built for enterprises. Feedinbox finds out why visitors don't buy and collects feedback, in a 2-minute setup.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓" },
            { feature: "Self-serve signup", feedinbox: "✓", competitor: "✗ Sales required" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "Hours to days" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $799/mo" }
        ],
        advantages: [
            { title: "The commercial question", description: "Find out why people don't buy, not just collect ideas." },
            { title: "No sales calls", description: "Sign up and set up in minutes." },
            { title: "72x cheaper", description: "Enterprise pricing not required." },
            { title: "Feedback too", description: "A feedback widget on the same script." }
        ],
        keywords: ["uservoice alternative", "uservoice vs feedinbox", "why visitors don't buy", "affordable uservoice alternative", "conversion feedback"]
    },
    {
        slug: "productboard",
        competitorName: "Productboard",
        metaTitle: "Feedinbox vs Productboard - Why-Not-Buy + Feedback",
        metaDescription: "Productboard is product management software. Feedinbox tells you why visitors don't buy and collects feedback. Simpler and cheaper for early-stage teams.",
        heroHeadline: "Productboard alternative for early-stage",
        heroSubheadline: "Productboard is for scaling roadmaps. If you're early and losing sales, Feedinbox tells you why visitors don't buy, plus collects feedback.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "Weeks" },
            { feature: "Roadmapping", feedinbox: "✗", competitor: "✓" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $25/user/mo" }
        ],
        advantages: [
            { title: "Fix the funnel first", description: "Learn why visitors don't buy before building the roadmap." },
            { title: "No per-seat pricing", description: "One flat price for your whole team." },
            { title: "Fast setup", description: "One script plus two events (high_intent and converted), or hand it to your AI agent." },
            { title: "Feedback included", description: "Bugs and ideas on the same widget." }
        ],
        keywords: ["productboard alternative", "productboard vs feedinbox", "why visitors don't buy", "early stage conversion tool", "affordable productboard"]
    },
    {
        slug: "typeform",
        competitorName: "Typeform",
        metaTitle: "Feedinbox vs Typeform - Exit-Intent Question Built In",
        metaDescription: "Typeform makes you build and link surveys. Feedinbox fires one exit-intent question automatically when visitors abandon, plus a feedback widget. From $10.99/mo.",
        heroHeadline: "Why-Not-Buy, not a survey you have to build",
        heroSubheadline: "Typeform is a survey builder. Feedinbox asks the one commercial question automatically when a visitor abandons, and collects feedback too.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Fires on abandonment", competitor: "~ Build it yourself" },
            { feature: "In-app / no context switch", feedinbox: "✓ Slides in", competitor: "✗ Separate page" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✗" },
            { feature: "Setup", feedinbox: "1 script + 2 events", competitor: "Build + embed a form" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $25/mo" }
        ],
        advantages: [
            { title: "Purpose-built", description: "The abandonment question is ready to go, not a form you design." },
            { title: "Zero context switch", description: "The card slides in on your site. Visitors never leave." },
            { title: "Feedback included", description: "A feedback widget on the same script." },
            { title: "Tagged answers", description: "Every reason is tagged by plan and country." }
        ],
        keywords: ["typeform alternative", "typeform vs feedinbox", "exit intent survey", "why visitors don't buy", "abandonment question"]
    },
    {
        slug: "hotjar",
        competitorName: "Hotjar",
        metaTitle: "Feedinbox vs Hotjar - Purpose-Built Why-Not-Buy",
        metaDescription: "Hotjar does heatmaps and generic surveys. Feedinbox is purpose-built for one question: why didn't you buy? Plus a feedback widget. Simpler and cheaper.",
        heroHeadline: "Hotjar alternative focused on why they don't buy",
        heroSubheadline: "Hotjar is an all-in-one analytics suite. Feedinbox does one commercial thing well: catch abandoning visitors and ask why, plus collect feedback.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Purpose-built", competitor: "~ Generic surveys" },
            { feature: "Tagged by plan & country", feedinbox: "✓", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓" },
            { feature: "Heatmaps / recordings", feedinbox: "✗", competitor: "✓" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $32/mo" }
        ],
        advantages: [
            { title: "One job, done well", description: "Built for the abandonment question, not a survey buried in analytics." },
            { title: "Commercial context", description: "Reasons tagged by plan viewed and country." },
            { title: "Lighter weight", description: "Smaller script, faster load times." },
            { title: "Feedback too", description: "A feedback widget on the same script." }
        ],
        keywords: ["hotjar alternative", "hotjar vs feedinbox", "exit intent survey", "why visitors don't buy", "hotjar surveys alternative"]
    },
    {
        slug: "intercom",
        competitorName: "Intercom",
        metaTitle: "Feedinbox vs Intercom - Why-Not-Buy Without the Overhead",
        metaDescription: "Intercom is a support and chat suite. Feedinbox tells you why visitors don't buy and collects feedback, without the cost or complexity. From $10.99/mo.",
        heroHeadline: "Why they didn't buy, without the chat suite",
        heroSubheadline: "Intercom is for support conversations. Feedinbox answers a different question, why visitors don't buy, and collects feedback.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "~ Via chat" },
            { feature: "Live chat", feedinbox: "✗", competitor: "✓" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "Hours" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $74/mo" }
        ],
        advantages: [
            { title: "The money question", description: "Learn why visitors don't buy, no conversations to manage." },
            { title: "6x cheaper", description: "A fraction of the cost for conversion insight." },
            { title: "No training", description: "Nothing for your team to learn." },
            { title: "Feedback included", description: "A feedback widget on the same script." }
        ],
        keywords: ["intercom alternative", "intercom vs feedinbox", "why visitors don't buy", "cheap intercom alternative", "conversion feedback"]
    },
    {
        slug: "zendesk",
        competitorName: "Zendesk",
        metaTitle: "Feedinbox vs Zendesk - Why-Not-Buy + Feedback",
        metaDescription: "Zendesk is a support suite. Feedinbox tells you why visitors don't buy and collects feedback, with a lightweight script. From $10.99/mo.",
        heroHeadline: "Lightweight alternative to Zendesk",
        heroSubheadline: "Zendesk is a full support and ticketing suite. Feedinbox is focused: why visitors don't buy, plus a feedback widget.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "~ Tickets" },
            { feature: "Ticketing / knowledge base", feedinbox: "✗", competitor: "✓" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "Days to weeks" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $19/agent/mo" }
        ],
        advantages: [
            { title: "Conversion focus", description: "Find out why people don't buy, no ticket queue to run." },
            { title: "Instant setup", description: "Live in 2 minutes." },
            { title: "No per-agent pricing", description: "One flat price for the whole team." },
            { title: "Feedback too", description: "A feedback widget on the same script." }
        ],
        keywords: ["zendesk alternative", "zendesk vs feedinbox", "why visitors don't buy", "lightweight zendesk alternative", "conversion feedback"]
    },
    {
        slug: "usersnap",
        competitorName: "Usersnap",
        metaTitle: "Feedinbox vs Usersnap - Why-Not-Buy + Feedback",
        metaDescription: "Usersnap does visual bug tracking from $69/mo. Feedinbox tells you why visitors don't buy and collects feedback for $10.99/mo. Simpler and far cheaper.",
        heroHeadline: "Usersnap alternative without the price tag",
        heroSubheadline: "Usersnap is for visual bug tracking. Feedinbox answers a bigger question, why visitors don't buy, and collects feedback, for 6x less.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓ Visual" },
            { feature: "Screenshot annotations", feedinbox: "✗", competitor: "✓" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "15+ minutes" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $69/mo" }
        ],
        advantages: [
            { title: "Answers the money question", description: "Learn why visitors don't buy, not just track bugs." },
            { title: "6x cheaper", description: "$10.99/mo instead of $69/mo." },
            { title: "Inbox-first", description: "Reasons and feedback come to your email." },
            { title: "Lighter script", description: "Smaller widget, faster loads." }
        ],
        keywords: ["usersnap alternative", "usersnap vs feedinbox", "why visitors don't buy", "cheaper than usersnap", "conversion feedback tool"]
    },
    {
        slug: "userback",
        competitorName: "Userback",
        metaTitle: "Feedinbox vs Userback - Why-Not-Buy + Feedback",
        metaDescription: "Userback charges per seat for visual feedback. Feedinbox tells you why visitors don't buy and collects feedback at one flat price. From $10.99/mo.",
        heroHeadline: "Userback alternative without per-seat pricing",
        heroSubheadline: "Userback is per-seat visual feedback. Feedinbox is one flat price and answers why visitors don't buy, plus collects feedback.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓ Visual" },
            { feature: "Per-seat pricing", feedinbox: "✗ Flat", competitor: "✓ From $7/seat/mo" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "10+ minutes" },
            { feature: "Free tier", feedinbox: "✓ 20/mo", competitor: "~ 7-day access" }
        ],
        advantages: [
            { title: "The commercial question", description: "Find out why people don't buy, not just annotate screenshots." },
            { title: "No per-seat costs", description: "One flat price for your full team." },
            { title: "Inbox-first", description: "No new dashboard to check." },
            { title: "Feedback included", description: "A feedback widget on the same script." }
        ],
        keywords: ["userback alternative", "userback vs feedinbox", "why visitors don't buy", "flat-price feedback tool", "conversion feedback"]
    },
    {
        slug: "sleekplan",
        competitorName: "Sleekplan",
        metaTitle: "Feedinbox vs Sleekplan - Why-Not-Buy + Feedback",
        metaDescription: "Sleekplan does public roadmaps and voting. Feedinbox tells you why visitors don't buy and collects feedback, delivered to your inbox. Simpler and cheaper.",
        heroHeadline: "Sleekplan alternative that finds the leak",
        heroSubheadline: "Sleekplan is a roadmap and changelog portal. Feedinbox answers why visitors don't buy, and collects feedback, straight to your inbox.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓" },
            { feature: "Answers in your inbox", feedinbox: "✓ Weekly digest", competitor: "✗ Portal" },
            { feature: "Roadmap / voting / changelog", feedinbox: "✗", competitor: "✓" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $13/mo" }
        ],
        advantages: [
            { title: "Fix the funnel", description: "Learn why visitors don't buy, not just gather votes." },
            { title: "Inbox-first", description: "Reasons in your email, not a portal you forget to check." },
            { title: "Faster setup", description: "One script and two events. Done in minutes." },
            { title: "Feedback included", description: "A feedback widget on the same script." }
        ],
        keywords: ["sleekplan alternative", "sleekplan vs feedinbox", "why visitors don't buy", "conversion feedback", "exit intent alternative"]
    },
    {
        slug: "bugherd",
        competitorName: "BugHerd",
        metaTitle: "Feedinbox vs BugHerd - Why-Not-Buy + Feedback",
        metaDescription: "BugHerd is visual bug tracking from $50/mo. Feedinbox tells you why visitors don't buy and collects feedback for $10.99/mo. Simpler and 4x cheaper.",
        heroHeadline: "BugHerd alternative that grows revenue",
        heroSubheadline: "BugHerd is for dev and QA teams. Feedinbox answers why visitors don't buy, and collects feedback, for 4x less.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓ Bug pinning" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "15+ minutes" },
            { feature: "Free tier", feedinbox: "✓ 20/mo", competitor: "~ 7-day trial" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $50/mo" }
        ],
        advantages: [
            { title: "The money question", description: "Learn why visitors don't buy, not just track bugs." },
            { title: "4x cheaper", description: "$10.99/mo vs $50/mo." },
            { title: "No team-size limits", description: "Flat pricing, no cost per member." },
            { title: "Works everywhere", description: "Any live site, not just sites in development." }
        ],
        keywords: ["bugherd alternative", "bugherd vs feedinbox", "why visitors don't buy", "cheaper than bugherd", "conversion feedback"]
    },
    {
        slug: "marker-io",
        competitorName: "Marker.io",
        metaTitle: "Feedinbox vs Marker.io - Why-Not-Buy + Feedback",
        metaDescription: "Marker.io is visual QA feedback from $39/mo. Feedinbox tells you why visitors don't buy and collects feedback for $10.99/mo. Built for real visitors.",
        heroHeadline: "Marker.io alternative for real visitors",
        heroSubheadline: "Marker.io is for internal QA. Feedinbox faces your real visitors, asking why they don't buy, and collecting feedback, for 3x less.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Exit-intent card", competitor: "✗" },
            { feature: "Feedback widget", feedinbox: "✓ End users", competitor: "✓ Internal QA" },
            { feature: "Screenshot annotations", feedinbox: "✗", competitor: "✓" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "10+ minutes" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $39/mo" }
        ],
        advantages: [
            { title: "Faces real visitors", description: "Built for the people deciding whether to buy, not internal QA." },
            { title: "The commercial question", description: "Find out why they don't buy." },
            { title: "3x cheaper", description: "$10.99/mo instead of $39/mo." },
            { title: "Inbox-first", description: "Reasons and feedback in your email." }
        ],
        keywords: ["marker.io alternative", "marker io alternative", "marker.io vs feedinbox", "why visitors don't buy", "conversion feedback"]
    },
    {
        slug: "qualaroo",
        competitorName: "Qualaroo",
        metaTitle: "Feedinbox vs Qualaroo - Purpose-Built Why-Not-Buy",
        metaDescription: "Qualaroo is a configurable survey nudge tool. Feedinbox is purpose-built for one question, why didn't you buy, plus a feedback widget. Simpler and cheaper.",
        heroHeadline: "Qualaroo alternative, ready out of the box",
        heroSubheadline: "Qualaroo makes you design survey nudges. Feedinbox ships the abandonment question ready to go, and collects feedback too.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Ready out of the box", competitor: "~ Configure nudges" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✗" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "30+ minutes" },
            { feature: "Learning curve", feedinbox: "None", competitor: "Moderate" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $39.99/mo" }
        ],
        advantages: [
            { title: "Ready to go", description: "The abandonment question ships built-in, no nudges to design." },
            { title: "3x cheaper", description: "$10.99/mo vs $39.99/mo." },
            { title: "Inbox-first", description: "Reasons in your email, not a dashboard." },
            { title: "Feedback included", description: "A feedback widget on the same script." }
        ],
        keywords: ["qualaroo alternative", "qualaroo vs feedinbox", "exit intent survey", "why visitors don't buy", "conversion feedback"]
    },
    {
        slug: "survicate",
        competitorName: "Survicate",
        metaTitle: "Feedinbox vs Survicate - Purpose-Built Why-Not-Buy",
        metaDescription: "Survicate is a full survey platform from $99/mo. Feedinbox is purpose-built for the abandonment question, plus a feedback widget, for $10.99/mo.",
        heroHeadline: "Survicate alternative for the one question that matters",
        heroSubheadline: "Survicate is a survey platform with 125+ templates. Feedinbox skips the template paralysis and asks the one commercial question, plus collects feedback.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Purpose-built", competitor: "~ Generic surveys" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✗" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "20+ minutes" },
            { feature: "Template paralysis", feedinbox: "✗ One card", competitor: "125+ templates" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $99/mo" }
        ],
        advantages: [
            { title: "Purpose-built", description: "One card for the abandonment question, not a survey suite." },
            { title: "9x cheaper", description: "$10.99/mo vs $99/mo." },
            { title: "No template paralysis", description: "Ready to go, nothing to configure." },
            { title: "Feedback included", description: "A feedback widget on the same script." }
        ],
        keywords: ["survicate alternative", "survicate vs feedinbox", "exit intent survey", "why visitors don't buy", "cheaper than survicate"]
    },
    {
        slug: "mopinion",
        competitorName: "Mopinion",
        metaTitle: "Feedinbox vs Mopinion - Why-Not-Buy for Startups",
        metaDescription: "Mopinion is enterprise feedback analytics from $229/mo. Feedinbox tells you why visitors don't buy and collects feedback for $10.99/mo. Built for makers.",
        heroHeadline: "Mopinion alternative for startups",
        heroSubheadline: "Mopinion is enterprise feedback analytics. Feedinbox is for makers: find out why visitors don't buy, and collect feedback, from your inbox.",
        comparison: [
            { feature: "Why-Not-Buy question", feedinbox: "✓ Purpose-built", competitor: "~ Generic surveys" },
            { feature: "Feedback widget", feedinbox: "✓", competitor: "✓" },
            { feature: "Setup time", feedinbox: "2 minutes", competitor: "Days to weeks" },
            { feature: "Target audience", feedinbox: "Startups & makers", competitor: "Enterprise" },
            { feature: "Pricing", feedinbox: "From $10.99/mo", competitor: "From $229/mo" }
        ],
        advantages: [
            { title: "The commercial question", description: "Find out why people don't buy, without an enterprise suite." },
            { title: "20x cheaper", description: "$10.99/mo vs $229/mo. Not a typo." },
            { title: "Instant setup", description: "One script tag, no enterprise onboarding." },
            { title: "Feedback included", description: "A feedback widget on the same script." }
        ],
        keywords: ["mopinion alternative", "mopinion vs feedinbox", "why visitors don't buy", "affordable conversion feedback", "cheaper than mopinion"]
    }
];

export function getAlternativeBySlug(slug: string): Alternative | undefined {
    return alternatives.find((a) => a.slug === slug);
}

export function getAllAlternativeSlugs(): string[] {
    return alternatives.map((a) => a.slug);
}
