"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Activity, Globe, Database, HardDrive, Network, Zap } from "lucide-react";
import ParticleNetwork from "@/components/hero/ParticleNetwork";
import ScrambleText from "@/components/hero/ScrambleText";

const ADVANCED_SKILLS = [
  "Computer Vision (YOLO, CNNs)", "NLP & RAG", "Model Quantization", "Custom Training & Optimizer Tuning", "LLM Integration (Qwen, LLaMA)",
  "End-to-End CI/CD", "Serverless GPU Wrappers", "High-Performance Linux (Ubuntu/Fedora)", "Edge AI", "Microservices",
  "Zero-Exfiltration EDR", "Wire-Speed VPN Interception", "Semantic Policy Auditing", "Vulnerability Analysis", "Exploit Research",
  "React & Next.js", "Automated Data & Media Pipelines", "Hardware-Optimized Runtimes (NVIDIA/CUDA)"
];

// Production Fallback Data
const FALLBACK_HERO = {
  headline: "THE IT FARM",
  subheadline: "Global delivery network engineered for scale, security, and velocity. Verified top 1% engineering talent deployed on-demand.",
  primaryCta: { label: "Initialize Project", href: "/services" },
  secondaryCta: { label: "View Architecture", href: "#modules" },
  metrics: ["0ms Latency", "100% Uptime"]
};

export default function HeroPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/heroContent.json?t=' + Date.now())
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => setHeroData(data))
      .catch(err => {
        console.error("Error loading hero data, using fallback:", err);
        setHeroData(FALLBACK_HERO);
      });
  }, []);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  // Scroll to section function for secondary CTA
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (!heroData) {
    return (
      <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 rounded-full border-2 border-[#FFD700] border-t-transparent animate-spin" />
      </section>
    );
  }

  return (
    <section 
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-transparent text-[#E5E4E2] overflow-hidden pt-24 md:pt-32 pb-10 z-10"
    >
      {/* BACKGROUND EFFECTS */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(10,14,39,0.5),rgba(2,2,2,0.5))] pointer-events-none" />
        {/* Film Grain (Noise Overlay) */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        {/* 2D Particle Network (Proof of Work) */}
        <ParticleNetwork />
      </motion.div>

      {/* CONTENT CONTAINER */}
      <motion.div 
        style={{ y: yContent }}
        className="relative z-10 max-w-5xl w-full px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center space-y-12"
      >
        
        {/* EXPANDED CAPABILITIES MARQUEE (Above the Fold) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full overflow-hidden relative flex flex-col gap-3 py-4 max-w-[100vw]"
        >
          {/* Gradient Masks for fading edges */}
          <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#0a0e27] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#0a0e27] to-transparent z-10" />
          
          <div className="flex whitespace-nowrap animate-marquee-fast">
            {[...ADVANCED_SKILLS, ...ADVANCED_SKILLS].map((item, idx) => (
              <div key={`row1-${idx}`} className="flex items-center gap-3 px-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-[#FFD700]/70 border border-[#FFD700]/20 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="flex whitespace-nowrap animate-marquee-slow-reverse">
            {[...ADVANCED_SKILLS.reverse(), ...ADVANCED_SKILLS.reverse()].map((item, idx) => (
              <div key={`row2-${idx}`} className="flex items-center gap-3 px-4 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-[#E5E4E2]/50 border border-white/10 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* HEADLINE & SUBHEADLINE */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-black leading-[1.1] tracking-tighter cursor-default font-serif text-white">
            <ScrambleText text={heroData.headline} delay={0.5} />
          </h1>
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-base sm:text-lg md:text-xl text-[#E5E4E2]/80 max-w-2xl mx-auto font-light leading-relaxed font-sans"
          >
            {heroData.subheadline}
          </motion.p>
        </div>

        {/* DUAL-TIER CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-8"
        >
          {/* Primary CTA: Magnetic/Glow Button with Gold Gradient */}
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-white text-[#0a0e27] rounded-full font-black uppercase tracking-[0.1em] text-xs transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] border border-transparent hover:border-[#FFD700]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">{heroData.primaryCta.label}</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
            </motion.button>
          </Link>

          {/* Secondary CTA: Ghost Button */}
          <a
            href="#modules"
            onClick={(e) => scrollToSection(e, "#modules")}
            className="group flex items-center gap-3 px-6 py-4 rounded-full text-[#E5E4E2]/80 text-xs font-bold uppercase tracking-[0.1em] hover:text-white transition-colors"
          >
            {heroData.secondaryCta.label}
            <div className="w-8 h-[1px] bg-[#E5E4E2]/40 group-hover:w-12 group-hover:bg-[#FFD700] transition-all duration-300" />
          </a>
        </motion.div>

        {/* LIVE METRIC TICKER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="flex flex-wrap justify-center gap-6 pt-12 border-t border-[#E5E4E2]/10"
        >
          {heroData.metrics?.map((metric: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
              <span className="text-[10px] font-mono tracking-[0.1em] text-[#E5E4E2]/60 uppercase">
                {metric}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#E5E4E2]/50">
          Explore Capabilities
        </span>
        <div className="w-[1px] h-12 bg-[#E5E4E2]/10 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD700] to-transparent"
          />
        </div>
      </motion.div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-fast {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-slow-reverse {
          animation: marquee-reverse 50s linear infinite;
        }
        .animate-marquee-fast:hover, .animate-marquee-slow-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}