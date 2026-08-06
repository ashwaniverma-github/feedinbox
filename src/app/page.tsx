import LandingPage from "@/components/landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedinbox: Know why they closed your pricing modal",
  description: "The moment someone closes your pricing modal without buying, Feedinbox asks one question and tells you why, tagged by plan and country. Plus a feedback widget. One script tag, free to start.",
  alternates: {
    canonical: "https://feedinbox.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Feedinbox",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Exit-intent tool that asks visitors why they didn't buy the moment they close your pricing modal, plus a feedback widget, delivered to your dashboard and a weekly email.",
  url: "https://feedinbox.com",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
      description: "20 submissions/month",
    },
    {
      "@type": "Offer",
      price: "10.99",
      priceCurrency: "USD",
      name: "Pro",
      description: "Unlimited submissions",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
