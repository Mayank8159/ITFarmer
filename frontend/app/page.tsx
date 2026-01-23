"use client"; // Smooth scroll requires client-side execution

import { useEffect, JSX } from "react";
import Lenis from "@studio-freight/lenis";
import FloatingNavbar from "@/components/Navbar";
import HeroPage from "@/components/Hero";
import NextSection from "@/components/Body";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";

export default function HomePage(): JSX.Element {
  
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Cleanup on unmount
    };
  }, []);

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