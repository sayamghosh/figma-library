import { HeroSection } from "../components/HeroSection";
import { SectionHowItWorks } from "../components/SectionHowItWorks";
import { PremiumDesignsSection } from "../components/PremiumDesignsSection";
import { FooterSection } from "../components/FooterSection";
import { OperationsSection } from "../components/OperationsSection";

export default function Home() {
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
