"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

import Hero3DModel from "@/components/hero/Hero3DModel";
import BrutalistMarquee from "@/components/Marquee";
import ScrambleText from "@/components/ScrambleText";

export default function HeroPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data/heroContent')
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.error("Error loading hero data:", err));
  }, []);

  const headlineWords = heroData?.headline ? heroData.headline.split(" ") : ["BUILD.", "CONNECT.", "INFER."];
  const lastWord = headlineWords.length > 0 ? headlineWords.pop() : "";
  
  return (
    <section 
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-black overflow-hidden pt-28 pb-10 z-10 border-b border-black/15 bg-[#e5e5e5]"
    >
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Strict Brutalist Grid */}
        <div className="absolute inset-0 grid-background opacity-100" />
        
        {/* Floating Brutalist Shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-1/4 left-[10%] w-32 h-32 border-4 border-black/10 flex items-center justify-center"
        >
          <div className="w-16 h-16 border-2 border-[#ff6b00]/20" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -50, 0], rotate: [0, 45, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[40%] w-20 h-20 bg-black/5"
        />

        <motion.div 
          animate={{ x: [0, 100, 0], rotate: -360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-1/3 right-[10%] w-24 h-24 border-2 border-dashed border-black/15 rounded-full"
        />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: Copy & CTAs */}
        <div className="flex flex-col items-start text-left order-1 pt-10 lg:pt-0">
          
          <div className="border border-black px-3 py-1 mb-10 bg-white inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ff6b00]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">Systems Online</span>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-mono text-[#ff6b00] tracking-[0.2em] text-xs font-bold uppercase"
            >
              NEURAL FORGE HUB / AI & SOFTWARE ENGINEERING STUDIO
            </motion.div>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-black leading-[0.9] tracking-tighter text-black uppercase flex flex-col">
              {headlineWords.map((word: string, i: number) => (
                <ScrambleText key={i} text={word} delay={3.2 + i * 0.4} />
              ))}
              <span className="text-[#ff6b00]">
                <ScrambleText text={lastWord || ""} delay={3.2 + headlineWords.length * 0.4} />
              </span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg sm:text-xl text-black/70 max-w-xl font-mono leading-[1.6] tracking-wide mt-8 border-l-4 border-[#ff6b00] pl-6"
          >
            {heroData?.subheadline || "Advanced AI infrastructure laboratory engineered for researchers, developers, and autonomous agents. Scale GPU computation and deploy specialized inference networks with uncompromised velocity."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch gap-4 pt-10 w-full sm:w-auto"
          >
            {/* Primary CTA */}
            <motion.div whileHover={{ y: -4, x: -4, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="w-full sm:w-auto">
              <Link href={heroData?.primaryCta?.href || "/contact"} className="w-full sm:w-auto px-8 py-5 bg-[#ff6b00] text-white font-mono text-xs uppercase tracking-widest border border-black flex items-center justify-center gap-3 group">
                <Terminal className="w-4 h-4" />
                <span>{heroData?.primaryCta?.label || heroData?.primaryCta?.text || "Launch Neural Forge"}</span>
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div whileHover={{ y: -4, x: -4, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="w-full sm:w-auto">
              <Link
                href={heroData?.secondaryCta?.href || "/#agents"}
                className="w-full sm:w-auto px-8 py-5 bg-white text-black font-mono text-xs uppercase tracking-widest border border-black flex items-center justify-center gap-3 group"
              >
                <span>{heroData?.secondaryCta?.label || heroData?.secondaryCta?.text || "Explore Ecosystem"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Visual Anchor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="order-2 w-full flex justify-center lg:justify-end"
        >
           {/* Brutalist Hero Graphic */}
           <div className="relative w-full aspect-square max-w-[500px] border border-black bg-white flex flex-col p-8">
             <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-black" />
             <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-black" />
             <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-black" />
             <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-black" />
             
             <div className="flex justify-between items-center border-b border-black pb-4 mb-4">
               <span className="font-mono text-xs font-bold uppercase tracking-widest text-black">Core Engine v2.4</span>
               <div className="w-3 h-3 bg-[#ff6b00]" />
             </div>
             
             <div className="flex-1 border border-black/10 bg-[#e5e5e5] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 grid-background opacity-50 pointer-events-none" />
                <Hero3DModel />
             </div>
             
             <div className="mt-4 pt-4 border-t border-black flex justify-between font-mono text-[10px] uppercase tracking-widest text-black/50">
                <span>SYSTEMS ONLINE</span>
             </div>
           </div>
        </motion.div>
        
      </div>

      {/* INFINITE MARQUEE STRIP */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <BrutalistMarquee 
          items={[
            "AUTONOMOUS AGENTS ONLINE",
            "GPU CLUSTERS ALLOCATED",
            "NEURAL PIPELINES ACTIVE",
            "C++ KERNELS COMPILED",
            "HIPAA COMPLIANT TELEMETRY",
            "SUB-10MS LATENCY"
          ]}
          speed={30}
        />
      </div>
    </section>
  );
}