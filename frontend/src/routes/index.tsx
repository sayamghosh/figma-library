import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "../components/HeroSection";
import { SectionHowItWorks } from "../components/SectionHowItWorks";
import { PremiumDesignsSection } from "../components/PremiumDesignsSection";
import { FooterSection } from "../components/FooterSection";
import { OperationsSection } from "../components/OperationsSection";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <OperationsSection />
      <SectionHowItWorks />
      <PremiumDesignsSection />
      <FooterSection />
    </main>
  );
}
