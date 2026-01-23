import FloatingNavbar from "@/components/Navbar";
import HeroPage from "@/components/Hero"; 
import NextSection from "@/components/Body";
import OrbitChat from "@/components/orbit/OrbitChat"; // IMPORT THE AI SYSTEM
import { JSX } from "react";

export default function HomePage(): JSX.Element {
  return (
    /* Main Container:
      - bg-[#020202]: Matches the deep space theme of all components.
      - overflow-x-hidden: Prevents scrollbars from entrance animations.
    */
    <main className="relative min-h-screen bg-[#020202] selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. Navigation Layer */}
      <FloatingNavbar />

      {/* 2. Hero Section (Entry Point) */}
      <HeroPage />

      {/* 3. The "Operating System" / Content Section */}
      <NextSection />

      {/* 4. PROPRIETARY AI LAYER 
         This sits fixed on top of the UI (z-index is handled inside the component).
      */}
      <OrbitChat />

    </main>
  );
}