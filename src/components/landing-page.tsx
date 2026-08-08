import { auth } from "@/lib/auth";
import Navbar from "./sm-components/navbar";
import HeroSection from "./sm-components/hero-section";
import HowItWorksSection from "./sm-components/how-it-works-section";
import TwoToolsSection from "./sm-components/two-tools-section";
import VibeCodersCallout from "./sm-components/vibe-coders-callout";
import DashboardSection from "./sm-components/dashboard-section";
import PricingSection from "./sm-components/pricing-section";
import CTASection from "./sm-components/cta-section";
import Footer from "./sm-components/footer";

export default async function LandingPage() {
    const session = await auth();
    const isLoggedIn = !!session?.user;
    const subscriptionStatus = (session?.user as any)?.subscriptionStatus || null;

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
            <Navbar isLoggedIn={isLoggedIn} />
            <HeroSection isLoggedIn={isLoggedIn} />
            <HowItWorksSection />
            <TwoToolsSection />
            <VibeCodersCallout />
            <DashboardSection />
            <PricingSection isLoggedIn={isLoggedIn} subscriptionStatus={subscriptionStatus} />
            <CTASection isLoggedIn={isLoggedIn} />
            <Footer />
        </div>
    );
}