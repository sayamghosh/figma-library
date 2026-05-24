import { HeroSection } from "../components/HeroSection";
import { SectionHowItWorks } from "../components/SectionHowItWorks";
import { PremiumDesignsSection } from "../components/PremiumDesignsSection";
import { OperationsSection } from "../components/OperationsSection";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <OperationsSection />
      <SectionHowItWorks />
      <PremiumDesignsSection />
    </main>
  );
}
