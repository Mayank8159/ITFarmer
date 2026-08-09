
import { JSX } from "react";
import HeroPage from "@/components/Hero";
import CapabilitiesSection from "@/components/sections/CapabilitiesSection";
import GithubActivity from "@/components/sections/GithubActivity";
import LeadMagnetGate from "@/components/sections/LeadMagnetGate";
import AgentEcosystem from "@/components/sections/AgentEcosystem";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import BentoGrid from "@/components/sections/BentoGrid";
import ResearchSection from "@/components/sections/ResearchSection";
import FaqSection from "@/components/sections/FaqSection";
import FinalCTA from "@/components/sections/FinalCTA";
export default function HomePage(): JSX.Element {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent flex flex-col">

      {/* UI LAYERS */}
      <HeroPage />
      <GithubActivity />
      <CapabilitiesSection />
      <AgentEcosystem />
      <MarqueeStrip />
      <BentoGrid />
      <ResearchSection />
      <FaqSection />
      
      <div className="py-24 bg-[#e5e5e5]">
        <LeadMagnetGate />
      </div>

      <FinalCTA />
    </main>
  );
}