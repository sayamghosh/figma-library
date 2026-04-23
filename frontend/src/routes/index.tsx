import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "../components/HeroSection";
import { Group18 } from "../components/Group18";
import { SectionHowItWorks } from "../components/SectionHowItWorks";
import { PremiumDesignsSection } from "../components/PremiumDesignsSection";
import { FAQSection } from "../components/FAQSection";
import { FooterSection } from "../components/FooterSection";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <Group18 />
      <SectionHowItWorks />
      <PremiumDesignsSection />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
