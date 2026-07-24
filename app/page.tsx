"use client"; // Smooth scroll requires client-side execution

import { JSX } from "react";
import TopBrandHeader from "@/components/TopBrandHeader";
import SideNav from "@/components/SideNav";
import HeroPage from "@/components/Hero";
import NextSection from "@/components/Body";
import dynamic from "next/dynamic";

const SmokeBackground = dynamic(() => import("@/components/SmokeBackground"), { ssr: false });
const OrbitChat = dynamic(() => import("@/components/orbit/OrbitChat"), { ssr: false });

export default function HomePage(): JSX.Element {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent">

      {/* SMOKE LAYER (BACKGROUND) */}
      <SmokeBackground />

      {/* UI LAYERS */}
      <TopBrandHeader />
      <SideNav />
      <HeroPage />
      <NextSection />
      <OrbitChat />

    </main>
  );
}