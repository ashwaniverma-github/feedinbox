export type Framework = "nextjs" | "react" | "html";

export function getEmbedCode(framework: Framework, projectKey: string, origin: string) {
  if (framework === "nextjs") {
    return `import Script from 'next/script'

// Add to your app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Queue stub so events fired before the widget loads aren't lost */}
        <Script id="feedinbox-stub" strategy="beforeInteractive">
          {\`window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}\`}
        </Script>
        <Script
          src="${origin}/widget.js"
          data-project-key="${projectKey}"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}

// Then, from your pricing/checkout code, fire the events:
//   window.feedinbox('event', 'high_intent', { plan: 'pro' }) // e.g. pricing modal opened
//   window.feedinbox('event', 'abandoned')                    // pricing/checkout closed without buying
//   window.feedinbox('event', 'converted')                    // on successful purchase`;
  }

  if (framework === "react") {
    return `<!-- Add to your public/index.html before </body> -->
<script>window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}</script>
<script async src="${origin}/widget.js" data-project-key="${projectKey}"></script>

<!-- Then fire the events from your pricing/checkout code:
     window.feedinbox('event', 'high_intent', { plan: 'pro' })  // pricing modal opened
     window.feedinbox('event', 'abandoned')                     // pricing/checkout closed without buying
     window.feedinbox('event', 'converted')                     // on successful purchase -->`;
  }

  // HTML
  return `<!-- Add before </body> -->
<script>window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}</script>
<script async src="${origin}/widget.js" data-project-key="${projectKey}"></script>

<!-- Then fire the events from your pricing/checkout code:
     window.feedinbox('event', 'high_intent', { plan: 'pro' })  // pricing modal opened
     window.feedinbox('event', 'abandoned')                     // pricing/checkout closed without buying
     window.feedinbox('event', 'converted')                     // on successful purchase -->`;
}
