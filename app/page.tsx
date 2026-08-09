"use client";

import { JSX } from "react";
import HeroPage from "@/components/Hero";
import MetricsStrip from "@/components/sections/MetricsStrip";
import BentoGrid from "@/components/sections/BentoGrid";
import ApiPlayground from "@/components/sections/ApiPlayground";
import AgentEcosystem from "@/components/sections/AgentEcosystem";
import ResearchSection from "@/components/sections/ResearchSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
import FinalCTA from "@/components/sections/FinalCTA";
import dynamic from "next/dynamic";

const SmokeBackground = dynamic(() => import("@/components/SmokeBackground"), { ssr: false });
const OrbitChat = dynamic(() => import("@/components/orbit/OrbitChat"), { ssr: false });

export default function HomePage(): JSX.Element {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent flex flex-col">

      {/* UI LAYERS */}
      <HeroPage />
      <MetricsStrip />
      <AgentEcosystem />
      <BentoGrid />
      <ApiPlayground />
      <ResearchSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCTA />
    </main>
  );
}