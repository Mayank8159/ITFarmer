import FloatingNavbar from "@/components/Navbar";
import HeroPage from "@/components/Hero"; 
import NextSection from "@/components/Body"; // Import the Operating System section
import { JSX } from "react";

export default function HomePage(): JSX.Element {
  return (
    /* Ensure the background is black (#020202) to match the components.
       The "relative" class allows the navbar to float correctly.
    */
    <main className="relative min-h-screen bg-[#020202] selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. Floating Navbar - Always stays on top */}
      <FloatingNavbar />

      {/* 2. Hero Section - The high-end SaaS entry point */}
      <HeroPage />

      {/* 3. The "How It Works / OS" Section (Body.tsx) 
          This replaces your previous placeholder section to maintain the 
          cinematic tech studio design language.
      */}
      <NextSection />

      {/* 4. Optional: Footer / Final CTA could go here */}
    </main>
  );
}