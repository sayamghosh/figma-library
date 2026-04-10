import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "../components/HeroSection";
import { BuildFasterSection } from "../components/BuildFasterSection";
import { HowItWorksSection } from "../components/HowItWorksSection";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <BuildFasterSection />
      <HowItWorksSection />
    </main>
  );
}
