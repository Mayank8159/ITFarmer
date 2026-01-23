import FloatingNavbar from "@/components/Navbar";
import HeroPage from "@/components/Hero";
import NextSection from "@/components/Body";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";
import { JSX } from "react";

export default function HomePage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-[#020202] overflow-x-hidden">

      {/* SMOKE LAYER (BACKGROUND) */}
      <SmokeBackground />

      {/* UI LAYERS */}
      <FloatingNavbar />
      <HeroPage />
      <NextSection />
      <OrbitChat />

    </main>
  );
}
