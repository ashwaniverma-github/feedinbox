import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Script from 'next/script'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://feedinbox.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Feedinbox: Find out why visitors don't buy",
    template: "%s | Feedinbox",
  },
  description: "When someone abandons your pricing or checkout, Feedinbox asks one question and tells you why, tagged by plan and country. Plus a feedback widget. One script tag, free to start.",
  keywords: ["exit intent", "why visitors don't buy", "checkout abandonment", "pricing page abandonment", "conversion feedback", "cart abandonment survey", "exit survey", "feedback widget", "user feedback tool", "customer feedback widget", "in-app feedback", "saas feedback tool"],
  authors: [{ name: "Feedinbox" }],
  creator: "Feedinbox",
  publisher: "Feedinbox",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Feedinbox",
    title: "Feedinbox - Collect User Feedback to Your Inbox",
    description: "Collect feedback, bug reports, and feature requests from your users. Embed one snippet of code, receive everything straight to your inbox.",
    images: [
      {
        url: "/OG.png?v=2",
        width: 1200,
        height: 630,
        alt: "Feedinbox - Feedback for Founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feedinbox - Collect User Feedback to Your Inbox",
    description: "Collect feedback, bug reports, and feature requests from your users. Embed one snippet of code, receive everything straight to your inbox.",
    images: ["/OG.png?v=2"],
    creator: "@feedinbox",
  },

  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Analytics />
          {/* Self-embed only when an explicit project key is configured, so local
              builds and previews don't load the widget with a stray key. */}
          {process.env.NEXT_PUBLIC_FEEDINBOX_WIDGET_KEY && (
            <>
              {/* Queue stub so events fired before widget.js loads (e.g. high_intent
                  on pricing modal open) aren't lost */}
              <Script id="feedinbox-stub" strategy="beforeInteractive">
                {`window.feedinbox=window.feedinbox||function(){(window.feedinbox.q=window.feedinbox.q||[]).push(arguments)}`}
              </Script>
              <Script
                src="/widget.js"
                data-project-key={process.env.NEXT_PUBLIC_FEEDINBOX_WIDGET_KEY}
                strategy="lazyOnload"
              />
            </>
          )}

          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-81LYZN8CPG"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-81LYZN8CPG');
            `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}

