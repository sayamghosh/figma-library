import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "../components/HeroSection";
import { BuildFasterSection } from "../components/BuildFasterSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { PremiumDesignsSection } from "../components/PremiumDesignsSection";
import { FAQSection } from "../components/FAQSection";
import { NewsletterSection } from "../components/NewsletterSection";
import { FooterSection } from "../components/FooterSection";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <BuildFasterSection />
      <HowItWorksSection />
      <PremiumDesignsSection />
      <FAQSection />
      <NewsletterSection />
      <FooterSection />
    </main>
  );
}
