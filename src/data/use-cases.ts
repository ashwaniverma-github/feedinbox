export interface UseCase {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    description: string;
    icon: string;
    heroHeadline: string;
    heroSubheadline: string;
    problemStatement: string;
    benefits: {
        title: string;
        description: string;
    }[];
    keywords: string[];
}

export const useCases: UseCase[] = [
    {
        slug: "saas-feedback",
        title: "Why-Not-Buy for SaaS",
        metaTitle: "Find Out Why SaaS Trials Don't Convert | Feedinbox",
        metaDescription: "Feedinbox asks abandoning SaaS visitors why they didn't upgrade, and collects product feedback too. Learn why trials don't convert and fix the leak. Free to start.",
        description: "The easiest way to learn why SaaS visitors don't upgrade, plus a feedback widget for bugs and ideas.",
        icon: "Cloud",
        heroHeadline: "Know why trials don't upgrade",
        heroSubheadline: "Most people who open your pricing never subscribe. Feedinbox asks them why, and gives your users a feedback widget for everything else.",
        problemStatement: "SaaS founders can see the drop-off in analytics but never learn the reason. You have theories about why trials don't convert, not data.",
        benefits: [
            { title: "Catch upgrade drop-off", description: "When a trial user opens pricing and doesn't subscribe, one question asks why." },
            { title: "Tagged by plan", description: "Every reason is tagged with the plan they viewed, so you see which tier is losing people." },
            { title: "Feedback widget included", description: "Bug reports and feature requests, on the same script and dashboard." },
            { title: "Answers in your inbox", description: "Every reason someone didn't upgrade is emailed to you as soon as they submit it, alongside instant feedback emails." }
        ],
        keywords: ["why saas trials don't convert", "saas conversion feedback", "saas exit intent", "saas upgrade drop-off", "saas feedback widget"]
    },
    {
        slug: "mobile-app-feedback",
        title: "Why-Not-Buy and feedback for apps",
        metaTitle: "App Paywall Drop-off and Feedback Collection | Feedinbox",
        metaDescription: "Find out why app users don't hit the paywall's buy button, and collect bug reports. Feedinbox works in your web app or WebView. Delivered to your inbox.",
        description: "Learn why users bounce off your paywall, and give them a quick way to report bugs, all in your web app.",
        icon: "Smartphone",
        heroHeadline: "Why users don't tap buy",
        heroSubheadline: "When someone reaches your paywall and backs out, Feedinbox asks why. Plus a feedback widget so users can report bugs in the wild.",
        problemStatement: "Paywall drop-off and hard-to-reproduce bugs both cost you. You need the reason people don't upgrade and the context behind bugs.",
        benefits: [
            { title: "Paywall drop-off reasons", description: "Fire the high-intent event when the paywall opens and learn why people don't buy." },
            { title: "Bug reports with context", description: "The feedback widget captures what users were doing when something broke." },
            { title: "Web and WebView ready", description: "Use the script in your web app or mobile WebView." },
            { title: "Instant alerts", description: "Bug reports and reasons people didn't buy, both emailed as soon as they arrive." }
        ],
        keywords: ["app paywall drop-off", "why users don't upgrade app", "mobile app feedback", "app conversion feedback", "webview feedback"]
    },
    {
        slug: "e-commerce-feedback",
        title: "Why-Not-Buy for e-commerce",
        metaTitle: "Find Out Why Shoppers Abandon Checkout | Feedinbox",
        metaDescription: "Feedinbox asks abandoning shoppers why they didn't buy and collects store feedback. Understand cart abandonment and fix conversion leaks. Easy setup.",
        description: "Every abandoned cart has a reason. Feedinbox asks for it, and collects general store feedback too.",
        icon: "ShoppingCart",
        heroHeadline: "Know why carts get abandoned",
        heroSubheadline: "Analytics show you the abandonment rate but never the reason. Feedinbox asks shoppers what stopped them, right as they leave.",
        problemStatement: "E-commerce sites lose buyers to friction they never hear about. By the time you see a bad review, the sale is long gone.",
        benefits: [
            { title: "Checkout abandonment reasons", description: "Fire high-intent at checkout and learn why shoppers don't complete the purchase." },
            { title: "Price vs product vs trust", description: "Preset answers reveal whether it's price, unclear value, or a missing detail." },
            { title: "Store feedback included", description: "A feedback widget for product and site issues, on the same script." },
            { title: "Fix the leak", description: "Turn drop-off reasons into concrete checkout and pricing fixes." }
        ],
        keywords: ["why shoppers abandon checkout", "cart abandonment feedback", "ecommerce exit intent", "checkout drop-off reasons", "ecommerce conversion feedback"]
    },
    {
        slug: "startup-feedback",
        title: "Why-Not-Buy for startups",
        metaTitle: "Find Out Why Visitors Don't Buy | Startup Tool | Feedinbox",
        metaDescription: "Perfect for early-stage products. Learn why visitors don't buy and collect feedback without complex setup. Free tier available.",
        description: "Startups can't afford to guess at their funnel. Feedinbox tells you why visitors don't buy, plus collects feedback.",
        icon: "Rocket",
        heroHeadline: "Stop guessing why they don't buy",
        heroSubheadline: "You're moving fast but flying blind on conversion. Feedinbox asks abandoning visitors why, and collects feedback, in one 2-minute setup.",
        problemStatement: "Early-stage startups have theories about why people don't convert, not data. You need the real reason to fix the leak blocking revenue.",
        benefits: [
            { title: "Free tier", description: "Start learning why visitors don't buy without spending a dime." },
            { title: "Minutes to set up", description: "One script plus one event, or hand it to your AI agent." },
            { title: "Funnel validation", description: "Find out if it's price, positioning, or a missing feature stopping sales." },
            { title: "Feedback too", description: "A feedback widget for the bugs and ideas that also matter early on." }
        ],
        keywords: ["why visitors don't buy", "startup conversion feedback", "mvp conversion", "indie hacker conversion tool", "early stage exit intent"]
    },
    {
        slug: "landing-page-feedback",
        title: "Why-Not-Buy for landing pages",
        metaTitle: "Why Landing Page Visitors Don't Convert | Feedinbox",
        metaDescription: "Find out why landing page visitors don't sign up or buy. Feedinbox asks them, and collects feedback. Improve conversion before spending more on ads.",
        description: "Your landing page gets traffic but not conversions. Feedinbox asks visitors why, and collects feedback.",
        icon: "Layout",
        heroHeadline: "Why visitors don't convert",
        heroSubheadline: "Before you spend more on ads, find out why the traffic you already have doesn't sign up or buy.",
        problemStatement: "You can track clicks and bounces, but not why. Sometimes you just need to ask visitors what stopped them.",
        benefits: [
            { title: "Conversion drop-off reasons", description: "Ask visitors who reach your CTA and leave why they didn't take the next step." },
            { title: "Message validation", description: "Learn whether your headline, offer, or pricing is the blocker." },
            { title: "Feedback widget", description: "Collect general reactions to your page alongside the buy-intent question." },
            { title: "Quick iterations", description: "Change copy and offers based on what real visitors tell you." }
        ],
        keywords: ["why visitors don't convert", "landing page conversion feedback", "landing page exit intent", "conversion drop-off", "why not signup"]
    },
    {
        slug: "beta-testing-feedback",
        title: "Feedback and drop-off for betas",
        metaTitle: "Beta Feedback and Why Testers Don't Convert | Feedinbox",
        metaDescription: "Collect beta tester feedback and learn why testers don't convert to paid. Feedinbox delivers both to your inbox. Simple script setup.",
        description: "Beta testers are your most valuable users. Collect their feedback, and learn why they don't upgrade to paid.",
        icon: "TestTube",
        heroHeadline: "Beta feedback, plus why they don't pay",
        heroSubheadline: "Give testers an easy way to report bugs, and ask the ones who don't convert what stopped them.",
        problemStatement: "Beta feedback scatters across Slack, email, and DMs, and you rarely learn why engaged testers don't become paying customers.",
        benefits: [
            { title: "Structured feedback", description: "Bug reports and feature requests, clearly categorized in your inbox." },
            { title: "Conversion drop-off", description: "Ask testers who hit pricing and don't buy why not." },
            { title: "One place", description: "Feedback and drop-off reasons in one dashboard and one inbox." },
            { title: "Iteration ready", description: "Turn both into a prioritized list of fixes." }
        ],
        keywords: ["beta testing feedback", "why beta testers don't convert", "beta conversion", "beta user feedback", "beta feedback tool"]
    },
    {
        slug: "website-feedback",
        title: "Why-Not-Buy and feedback for websites",
        metaTitle: "Find Out Why Website Visitors Don't Buy | Feedinbox",
        metaDescription: "Ask website visitors why they didn't buy, and collect general feedback. One simple script. Understand user intent and improve your site.",
        description: "Analytics tell you what visitors do. Feedinbox tells you why they didn't buy, and collects feedback.",
        icon: "Globe",
        heroHeadline: "Understand why visitors leave",
        heroSubheadline: "Your visitors know what stopped them. Feedinbox asks the ones who don't buy, and gives everyone a way to send feedback.",
        problemStatement: "Analytics show what users do, not why. The only way to understand intent is to ask them directly, at the right moment.",
        benefits: [
            { title: "Ask at the right moment", description: "Fire the question when a visitor shows buying intent and then leaves." },
            { title: "Non-intrusive feedback", description: "A quiet feedback button that sits until users need it. No annoying popups." },
            { title: "Any site type", description: "Works on marketing sites, apps, blogs, and portfolios." },
            { title: "One script", description: "Both features from a single embed, toggled in the dashboard." }
        ],
        keywords: ["why website visitors don't buy", "website exit intent", "website feedback tool", "visitor intent feedback", "site conversion feedback"]
    },
    {
        slug: "product-feedback",
        title: "Product feedback and drop-off reasons",
        metaTitle: "Product Feedback and Why Users Don't Buy | Feedinbox",
        metaDescription: "Centralize product feedback and learn why users don't convert. Feature requests, bug reports, and drop-off reasons in one inbox.",
        description: "Collect product feedback and the reasons people don't buy, all in one place: your inbox.",
        icon: "Package",
        heroHeadline: "Feedback and the reasons behind lost sales",
        heroSubheadline: "Feature requests in Slack, bugs in email, and no idea why people don't upgrade? Feedinbox brings it all together.",
        problemStatement: "Product signals get lost across channels, and the most important one, why people don't buy, usually isn't captured at all.",
        benefits: [
            { title: "One collection point", description: "Feedback and Why-Not-Buy answers land in one dashboard and one inbox." },
            { title: "Commercial signal", description: "See the top reason people don't convert, not just general opinions." },
            { title: "Prioritize with data", description: "Know what to fix first based on what's actually blocking sales." },
            { title: "Team visibility", description: "Share access with your whole team." }
        ],
        keywords: ["product feedback tool", "why users don't buy", "conversion feedback", "feature request collection", "product drop-off reasons"]
    },
    {
        slug: "wordpress-feedback",
        title: "Why-Not-Buy and feedback for WordPress",
        metaTitle: "Why Visitors Don't Buy on WordPress | Feedinbox",
        metaDescription: "Find out why WordPress visitors don't buy and collect feedback. No plugin required, just one script tag. Delivered to your inbox.",
        description: "Add Why-Not-Buy and a feedback widget to your WordPress site without a plugin. One script tag.",
        icon: "Globe",
        heroHeadline: "Why WordPress visitors don't buy",
        heroSubheadline: "Most WordPress feedback plugins are bloated. Feedinbox is one script tag that asks why visitors don't buy, and collects feedback.",
        problemStatement: "Plugins add bloat and security risk, and none of them tell you why visitors leave without buying.",
        benefits: [
            { title: "No plugin needed", description: "One script tag in your theme footer. No plugin updates to manage." },
            { title: "Why-Not-Buy built in", description: "Ask abandoning visitors why they didn't buy, right on your WordPress site." },
            { title: "Works with any theme", description: "Elementor, Divi, GeneratePress, Astra, any theme." },
            { title: "Answers by email", description: "Why-Not-Buy answers and feedback, both emailed the moment they arrive." }
        ],
        keywords: ["wordpress exit intent", "why wordpress visitors don't buy", "wordpress conversion feedback", "wordpress feedback widget", "wordpress feedback no plugin"]
    },
    {
        slug: "shopify-feedback",
        title: "Why-Not-Buy for Shopify",
        metaTitle: "Find Out Why Shopify Shoppers Don't Buy | Feedinbox",
        metaDescription: "Feedinbox asks abandoning Shopify shoppers why they didn't buy, and collects store feedback. Understand cart abandonment. Easy theme.liquid setup.",
        description: "Learn why Shopify shoppers abandon, and collect store feedback, with one script tag.",
        icon: "ShoppingCart",
        heroHeadline: "Why Shopify shoppers don't buy",
        heroSubheadline: "Add Feedinbox to your Shopify store in minutes. Ask abandoning shoppers what stopped them, and collect feedback too.",
        problemStatement: "Shopify analytics tell you what shoppers do, not why. Every abandoned cart and return has a reason you never hear.",
        benefits: [
            { title: "Cart drop-off reasons", description: "Fire high-intent from your cart or product page (Shopify checkout isn't themeable) to learn why shoppers don't buy." },
            { title: "Easy Shopify setup", description: "Paste one script in your theme.liquid file. Done." },
            { title: "Store feedback", description: "A feedback widget for product and site issues, on the same script." },
            { title: "Reduce returns", description: "Fix confusion before it becomes a return or a bad review." }
        ],
        keywords: ["why shopify shoppers don't buy", "shopify cart abandonment", "shopify exit intent", "shopify conversion feedback", "shopify feedback widget"]
    },
    {
        slug: "agency-feedback",
        title: "Why-Not-Buy and client feedback for agencies",
        metaTitle: "Conversion Insight and Client Feedback for Agencies | Feedinbox",
        metaDescription: "Show clients why their visitors don't buy, and collect feedback during development. One script per project, straight to your inbox.",
        description: "Give clients proof of why their visitors don't convert, and collect feedback during builds, with one script per project.",
        icon: "Users",
        heroHeadline: "Show clients why visitors don't buy",
        heroSubheadline: "Add Feedinbox to client sites to surface why visitors don't convert, and collect review feedback during development.",
        problemStatement: "Clients ask why their site isn't converting, and feedback during builds scatters across email, Slack, and docs.",
        benefits: [
            { title: "Conversion proof", description: "Bring clients real reasons their visitors don't buy, not guesses." },
            { title: "No client training", description: "The feedback button is one click for review comments." },
            { title: "Per-project setup", description: "Each client project gets its own script and data stream." },
            { title: "Delivered by email", description: "Drop-off reasons and feedback in your inbox, no new tool for the team." }
        ],
        keywords: ["agency conversion tool", "why client site doesn't convert", "client feedback tool agency", "agency exit intent", "client website feedback"]
    },
    {
        slug: "portfolio-feedback",
        title: "Why-Not-Buy and feedback for portfolios",
        metaTitle: "Why Portfolio Visitors Don't Reach Out | Feedinbox",
        metaDescription: "Find out why portfolio visitors don't contact you, and collect feedback on your work. Free to start. One simple script.",
        description: "Your portfolio gets traffic but few inquiries. Feedinbox asks visitors why they didn't reach out, and collects feedback.",
        icon: "Palette",
        heroHeadline: "Why visitors don't reach out",
        heroSubheadline: "Traffic but not enough inquiries? Feedinbox asks visitors who leave without contacting you why, and collects feedback on your work.",
        problemStatement: "Freelancers polish their portfolio for hours but never learn what stops visitors from getting in touch.",
        benefits: [
            { title: "Inquiry drop-off reasons", description: "Ask visitors who view your contact section and leave what held them back." },
            { title: "Feedback on your work", description: "Collect honest reactions to your portfolio with the feedback widget." },
            { title: "Free to start", description: "20 responses a month free. Perfect for personal sites." },
            { title: "Non-intrusive", description: "A small card that doesn't distract from your work." }
        ],
        keywords: ["why portfolio visitors don't contact", "portfolio conversion", "freelancer conversion tool", "portfolio feedback widget", "portfolio exit intent"]
    }
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
    return useCases.find((uc) => uc.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
    return useCases.map((uc) => uc.slug);
}
