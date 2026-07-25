export interface Integration {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  logo: string;
  heroHeadline: string;
  heroSubheadline: string;
  installMethod: "script";
  codeExample: string;
  steps: {
    title: string;
    description: string;
    code?: string;
  }[];
  keywords: string[];
}

// Shared queue stub. Placed before the widget script so events fired early
// (e.g. high_intent on pricing open) are not lost.
const STUB = `<script>window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}</script>`;

export const integrations: Integration[] = [
  {
    slug: "nextjs",
    name: "Next.js",
    metaTitle: "Add Feedinbox to Next.js | Why-Not-Buy + Feedback",
    metaDescription: "Find out why visitors don't buy on your Next.js app, and collect feedback. Add one script, fire a high_intent event, done. Works with App and Pages Router.",
    description: "The fastest way to add Why-Not-Buy and feedback collection to your Next.js application.",
    logo: "/integrations/nextjs.svg",
    heroHeadline: "Feedinbox for Next.js apps",
    heroSubheadline: "Add the script, then fire a high_intent event when someone opens pricing. Works with App Router and Pages Router.",
    installMethod: "script",
    codeExample: `import Script from 'next/script'

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="feedinbox-stub" strategy="beforeInteractive">
          {\`window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}\`}
        </Script>
        <Script
          src="https://feedinbox.com/widget.js"
          data-project-key="your_project_key"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

// Then, when a visitor opens pricing / starts checkout:
window.feedinbox('event', 'high_intent', { plan: 'pro' })
// And on your payment-success step:
window.feedinbox('event', 'converted')`,
    steps: [
      { title: "Add the scripts", description: "Drop the stub and widget Script tags into app/layout.tsx", code: "" },
      { title: "Fire high_intent", description: "Call it when a visitor opens pricing or starts checkout", code: "window.feedinbox('event', 'high_intent', { plan: 'pro' })" },
      { title: "Fire converted", description: "Call it on your payment-success step so buyers aren't asked", code: "window.feedinbox('event', 'converted')" }
    ],
    keywords: ["nextjs exit intent", "why visitors don't buy nextjs", "next.js conversion feedback", "nextjs feedback widget", "next.js why not buy"]
  },
  {
    slug: "react",
    name: "React",
    metaTitle: "Add Feedinbox to React | Why-Not-Buy + Feedback",
    metaDescription: "Learn why React app visitors don't buy, and collect feedback. One script plus a high_intent event. Works with Vite, CRA, Remix, and more.",
    description: "Add Why-Not-Buy and feedback collection to any React setup.",
    logo: "/integrations/react.svg",
    heroHeadline: "Feedinbox for React apps",
    heroSubheadline: "Add one script, then fire a high_intent event from your pricing code. Works with Vite, CRA, Remix, and any React setup.",
    installMethod: "script",
    codeExample: `<!-- public/index.html, before </body> -->
${STUB}
<script async src="https://feedinbox.com/widget.js" data-project-key="your_project_key"></script>

// In your pricing component, call these from event handlers (never on page load):
// when the pricing modal opens
window.feedinbox('event', 'high_intent', { plan: 'pro' })
// on purchase success
window.feedinbox('event', 'converted')`,
    steps: [
      { title: "Add the scripts", description: "Paste the stub and widget script into public/index.html before </body>", code: "" },
      { title: "Fire high_intent", description: "Call it when your pricing modal opens", code: "window.feedinbox('event', 'high_intent', { plan: 'pro' })" },
      { title: "Fire converted", description: "Call it on purchase success", code: "window.feedinbox('event', 'converted')" }
    ],
    keywords: ["react exit intent", "why react visitors don't buy", "react conversion feedback", "react feedback widget", "react why not buy"]
  },
  {
    slug: "vue",
    name: "Vue.js",
    metaTitle: "Add Feedinbox to Vue.js | Why-Not-Buy + Feedback",
    metaDescription: "Find out why Vue app visitors don't buy, and collect feedback. One script plus a high_intent event. Works with Vue 2, Vue 3, and Nuxt.",
    description: "Add Why-Not-Buy and feedback to your Vue.js app with a simple script.",
    logo: "/integrations/vue.svg",
    heroHeadline: "Feedinbox for Vue apps",
    heroSubheadline: "Add the script, then fire a high_intent event when a visitor reaches pricing.",
    installMethod: "script",
    codeExample: `<!-- index.html, before </body> -->
${STUB}
<script async src="https://feedinbox.com/widget.js" data-project-key="your_project_key"></script>

// In your pricing component method:
window.feedinbox('event', 'high_intent', { plan: 'pro' })
// On purchase success:
window.feedinbox('event', 'converted')`,
    steps: [
      { title: "Add the scripts", description: "Paste the stub and widget script into index.html", code: "" },
      { title: "Fire high_intent", description: "Call it when the pricing view opens", code: "window.feedinbox('event', 'high_intent', { plan: 'pro' })" },
      { title: "Fire converted", description: "Call it on purchase success", code: "window.feedinbox('event', 'converted')" }
    ],
    keywords: ["vue exit intent", "why vue visitors don't buy", "vue conversion feedback", "vue feedback widget", "vue why not buy"]
  },
  {
    slug: "angular",
    name: "Angular",
    metaTitle: "Add Feedinbox to Angular | Why-Not-Buy + Feedback",
    metaDescription: "Learn why Angular app visitors don't buy, and collect feedback. Simple script plus a high_intent event. Works with any Angular version.",
    description: "Add Why-Not-Buy and feedback to your Angular app with a simple script.",
    logo: "/integrations/angular.svg",
    heroHeadline: "Feedinbox for Angular apps",
    heroSubheadline: "Add the script, then fire a high_intent event when a visitor opens pricing.",
    installMethod: "script",
    codeExample: `<!-- index.html, before </body> -->
${STUB}
<script async src="https://feedinbox.com/widget.js" data-project-key="your_project_key"></script>

// In your pricing component:
window.feedinbox('event', 'high_intent', { plan: 'pro' })
// On purchase success:
window.feedinbox('event', 'converted')`,
    steps: [
      { title: "Add the scripts", description: "Paste the stub and widget script into index.html", code: "" },
      { title: "Fire high_intent", description: "Call it when the pricing view opens", code: "window.feedinbox('event', 'high_intent', { plan: 'pro' })" },
      { title: "Fire converted", description: "Call it on purchase success", code: "window.feedinbox('event', 'converted')" }
    ],
    keywords: ["angular exit intent", "why angular visitors don't buy", "angular conversion feedback", "angular feedback widget", "angular why not buy"]
  },
  {
    slug: "wordpress",
    name: "WordPress",
    metaTitle: "Add Feedinbox to WordPress | Why-Not-Buy + Feedback",
    metaDescription: "Find out why WordPress visitors don't buy, and collect feedback. No plugin required, just a code snippet in your theme.",
    description: "Add Why-Not-Buy and feedback to any WordPress site without a plugin.",
    logo: "/integrations/wordpress.svg",
    heroHeadline: "Feedinbox for WordPress",
    heroSubheadline: "Learn why visitors don't buy and collect feedback. No plugin required, just a snippet in your theme footer.",
    installMethod: "script",
    codeExample: `<!-- theme footer.php, or via an 'Insert Headers and Footers' plugin -->
${STUB}
<script async src="https://feedinbox.com/widget.js" data-project-key="your_project_key"></script>

<!-- If you sell on WordPress (WooCommerce etc.), fire high_intent from your
     pricing/checkout button handler, not as a global script on every page: -->
<!-- window.feedinbox('event', 'high_intent', { plan: 'pro' }) -->`,
    steps: [
      { title: "Access your theme", description: "Go to Appearance > Theme File Editor, or use a header/footer plugin", code: "" },
      { title: "Paste before </body>", description: "Add the stub and widget script", code: "" },
      { title: "Fire high_intent", description: "On your pricing or checkout page, if you sell online", code: "window.feedinbox('event', 'high_intent')" }
    ],
    keywords: ["wordpress exit intent", "why wordpress visitors don't buy", "wordpress conversion feedback", "wordpress feedback widget", "wordpress why not buy"]
  },
  {
    slug: "shopify",
    name: "Shopify",
    metaTitle: "Add Feedinbox to Shopify | Why Shoppers Don't Buy",
    metaDescription: "Find out why Shopify shoppers abandon checkout, and collect store feedback. Paste one snippet in theme.liquid and fire a high_intent event.",
    description: "Learn why Shopify shoppers don't buy, and collect feedback, with a theme.liquid snippet.",
    logo: "/integrations/shopify.svg",
    heroHeadline: "Feedinbox for Shopify stores",
    heroSubheadline: "Add the script to theme.liquid, then fire a high_intent event at checkout to learn why shoppers don't complete the purchase.",
    installMethod: "script",
    codeExample: `<!-- theme.liquid, before </body> -->
${STUB}
<script async src="https://feedinbox.com/widget.js" data-project-key="your_project_key"></script>

<!-- Shopify checkout isn't themeable, so fire high_intent from your product or
     cart page (e.g. a checkout-button click handler), not from checkout itself: -->
<!-- window.feedinbox('event', 'high_intent', { plan: 'pro' }) -->`,
    steps: [
      { title: "Edit your theme code", description: "Online Store > Themes > Edit Code", code: "" },
      { title: "Paste into theme.liquid", description: "Add the stub and widget script before </body>", code: "" },
      { title: "Fire high_intent on product/cart", description: "Trigger it from a checkout-button handler on your product or cart page (checkout isn't themeable)", code: "window.feedinbox('event', 'high_intent')" }
    ],
    keywords: ["shopify exit intent", "why shopify shoppers don't buy", "shopify cart abandonment feedback", "shopify conversion feedback", "shopify feedback widget"]
  },
  {
    slug: "webflow",
    name: "Webflow",
    metaTitle: "Add Feedinbox to Webflow | Why-Not-Buy + Feedback",
    metaDescription: "Find out why Webflow visitors don't buy, and collect feedback. No code, just paste into Custom Code and publish.",
    description: "Add Why-Not-Buy and feedback to your Webflow site with a custom code embed.",
    logo: "/integrations/webflow.svg",
    heroHeadline: "Feedinbox for Webflow sites",
    heroSubheadline: "Add the script via Custom Code, then fire a high_intent event from an element interaction on your pricing page.",
    installMethod: "script",
    codeExample: `<!-- Project Settings > Custom Code > Footer Code -->
${STUB}
<script async src="https://feedinbox.com/widget.js" data-project-key="your_project_key"></script>

// On your pricing button's click interaction (not a global script):
// window.feedinbox('event', 'high_intent', { plan: 'pro' })`,
    steps: [
      { title: "Open Project Settings", description: "Go to your Webflow project settings", code: "" },
      { title: "Paste in Footer Code", description: "Add the stub and widget script, then publish", code: "" },
      { title: "Fire high_intent", description: "Trigger it from your pricing interaction or an embed", code: "window.feedinbox('event', 'high_intent')" }
    ],
    keywords: ["webflow exit intent", "why webflow visitors don't buy", "webflow conversion feedback", "webflow feedback widget", "webflow why not buy"]
  },
  {
    slug: "html",
    name: "HTML / Static Sites",
    metaTitle: "Add Feedinbox to Any Website | Why-Not-Buy + Feedback",
    metaDescription: "Find out why visitors don't buy on any HTML site, and collect feedback. Two script tags plus a high_intent event. Works anywhere.",
    description: "The simplest way to add Why-Not-Buy and feedback to any HTML page.",
    logo: "/integrations/html.svg",
    heroHeadline: "Feedinbox for any website",
    heroSubheadline: "Two script tags, then a high_intent event on your pricing page. Works on any static site or web app.",
    installMethod: "script",
    codeExample: `<!-- Before </body> -->
${STUB}
<script async src="https://feedinbox.com/widget.js" data-project-key="your_project_key"></script>

// From your pricing/buy button's click handler (not a global script):
// window.feedinbox('event', 'high_intent', { plan: 'pro' })
// From your success page:
// window.feedinbox('event', 'converted')`,
    steps: [
      { title: "Open your HTML file", description: "Find your index.html or main HTML file", code: "" },
      { title: "Add before </body>", description: "Paste the stub and widget script", code: "" },
      { title: "Fire the events", description: "high_intent on pricing, converted on success", code: "window.feedinbox('event', 'high_intent')" }
    ],
    keywords: ["exit intent script", "why visitors don't buy", "static site conversion feedback", "html feedback widget", "why not buy script"]
  },
  {
    slug: "nuxt",
    name: "Nuxt.js",
    metaTitle: "Add Feedinbox to Nuxt.js | Why-Not-Buy + Feedback",
    metaDescription: "Find out why Nuxt app visitors don't buy, and collect feedback. Add the script in nuxt.config and fire a high_intent event. Nuxt 2 and 3.",
    description: "Add Why-Not-Buy and feedback to your Nuxt.js app with minimal config.",
    logo: "/integrations/nuxt.svg",
    heroHeadline: "Feedinbox for Nuxt apps",
    heroSubheadline: "Add the script via nuxt.config, then fire a high_intent event when a visitor opens pricing.",
    installMethod: "script",
    codeExample: `// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        { innerHTML: 'window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}' },
        { src: 'https://feedinbox.com/widget.js', 'data-project-key': 'your_project_key', async: true }
      ]
    }
  }
})

// In your pricing component:
window.feedinbox('event', 'high_intent', { plan: 'pro' })
window.feedinbox('event', 'converted')`,
    steps: [
      { title: "Open nuxt.config", description: "Find your nuxt.config.ts or nuxt.config.js", code: "" },
      { title: "Add head scripts", description: "Add the stub and widget script", code: "" },
      { title: "Fire the events", description: "high_intent on pricing, converted on success", code: "window.feedinbox('event', 'high_intent')" }
    ],
    keywords: ["nuxt exit intent", "why nuxt visitors don't buy", "nuxt conversion feedback", "nuxt feedback widget", "nuxt why not buy"]
  },
  {
    slug: "gatsby",
    name: "Gatsby",
    metaTitle: "Add Feedinbox to Gatsby | Why-Not-Buy + Feedback",
    metaDescription: "Find out why Gatsby site visitors don't buy, and collect feedback. Add the script via gatsby-ssr.js and fire a high_intent event.",
    description: "Add Why-Not-Buy and feedback to your Gatsby site with minimal setup.",
    logo: "/integrations/gatsby.svg",
    heroHeadline: "Feedinbox for Gatsby sites",
    heroSubheadline: "Add the script via gatsby-ssr.js, then fire a high_intent event on your pricing page.",
    installMethod: "script",
    codeExample: `// gatsby-ssr.js
import React from 'react';

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <script key="feedinbox-stub" dangerouslySetInnerHTML={{
      __html: 'window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}'
    }} />,
    <script key="feedinbox-widget" async src="https://feedinbox.com/widget.js" data-project-key="your_project_key" />
  ]);
};

// In your pricing component:
window.feedinbox('event', 'high_intent', { plan: 'pro' })
window.feedinbox('event', 'converted')`,
    steps: [
      { title: "Open gatsby-ssr.js", description: "Create or edit gatsby-ssr.js in your project root", code: "" },
      { title: "Add onRenderBody", description: "Add the stub and widget script", code: "" },
      { title: "Fire the events", description: "high_intent on pricing, converted on success", code: "window.feedinbox('event', 'high_intent')" }
    ],
    keywords: ["gatsby exit intent", "why gatsby visitors don't buy", "gatsby conversion feedback", "gatsby feedback widget", "gatsby why not buy"]
  }
];

export function getIntegrationBySlug(slug: string): Integration | undefined {
  return integrations.find((i) => i.slug === slug);
}

export function getAllIntegrationSlugs(): string[] {
  return integrations.map((i) => i.slug);
}
