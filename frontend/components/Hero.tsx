"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code2, Cpu, Cloud, Palette, ArrowRight, ArrowLeft, Star, Zap, Globe, ShieldCheck } from "lucide-react";

const SERVICES = [
  { id: 0, title: "Full-Stack Engineering", tagline: "High-Performance Next.js Architectures", description: "Monolithic powerhouses and microservices with seamless liquid-glass interfaces.", icon: <Code2 className="w-6 h-6 text-white" />, color: "from-blue-600 to-cyan-400", glow: "rgba(37, 99, 235, 0.15)" },
  { id: 1, title: "AI & Neural Workflows", tagline: "LLM Integration & Automation", description: "Custom neural engines and automated logic flows to overhaul business intelligence.", icon: <Cpu className="w-6 h-6 text-white" />, color: "from-emerald-500 to-teal-400", glow: "rgba(16, 185, 129, 0.15)" },
  { id: 2, title: "Spatial UI/UX Design", tagline: "Apple-Inspired Aesthetics", description: "Design language focusing on depth, frosted surfaces, and intuitive motion.", icon: <Palette className="w-6 h-6 text-white" />, color: "from-pink-500 to-rose-400", glow: "rgba(236, 72, 153, 0.15)" },
  { id: 3, title: "Cloud DevSecOps", tagline: "Elastic Infrastructure", description: "Automated scaling with hardened security protocols. Fortress-locked data.", icon: <Cloud className="w-6 h-6 text-white" />, color: "from-indigo-500 to-blue-400", glow: "rgba(99, 102, 241, 0.15)" },
];

const LOGOS = [
  { name: "VERCEL", icon: <Globe className="w-4 h-4" /> },
  { name: "STRIPE", icon: <ShieldCheck className="w-4 h-4" /> },
  { name: "AWS", icon: <Cloud className="w-4 h-4" /> },
  { name: "NVIDIA", icon: <Cpu className="w-4 h-4" /> },
  { name: "OPENAI", icon: <Zap className="w-4 h-4" /> },
  { name: "REACT", icon: <Code2 className="w-4 h-4" /> },
];

export default function HeroPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 25 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const slideNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % SERVICES.length);
  }, []);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(slideNext, 10000);
    return () => clearInterval(timer);
  }, [slideNext, isPaused]);

  const slideVariants: Variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.95, filter: "blur(10px)" }),
    center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 140, damping: 24 } },
    exit: (d: number) => ({ x: d < 0 ? 80 : -80, opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.3 } }),
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-transparent text-white overflow-x-hidden pt-24 md:pt-32 pb-10 z-10"
    >
      {/* Grid Overlay - Set to transparent to let smoke show through */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center px-6 sm:px-12 lg:px-24">

        {/* Left Content */}
        <div className="flex flex-col space-y-6 text-center lg:text-left items-center lg:items-start">
          <motion.div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-fit backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">Elite IT Agency</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-black leading-[0.9] tracking-tighter cursor-default">
              <span>Building</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">Global Icons.</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-md font-light leading-relaxed">
              Elite remote developers and designers crafting digital experiences that feel like the future.
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="px-8 py-4 bg-white text-black rounded-2xl font-black hover:scale-105 transition-all duration-300">
              Hire Talent
            </button>
            <button className="px-8 py-4 border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all backdrop-blur-xl">
              Our Stack
            </button>
          </div>
        </div>

        {/* Right Content - Service Card */}
        <div className="flex flex-col items-center justify-center w-full">
          <motion.div
            style={{ rotateX, rotateY, perspective: 1000 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative w-full aspect-[4/5] max-w-[320px] sm:max-w-[440px] cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                {/* The card uses backdrop-blur, so the smoke video will be visible inside the card too! */}
                <div className="w-full h-full rounded-[2.5rem] bg-zinc-900/40 border border-white/20 backdrop-blur-[40px] p-8 md:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${SERVICES[activeIndex].color} flex items-center justify-center shadow-2xl`}>
                    {SERVICES[activeIndex].icon}
                  </div>
                  <div className="space-y-4">
                    <span className="text-blue-400 font-mono text-[9px] uppercase tracking-[0.4em] block font-bold">{SERVICES[activeIndex].tagline}</span>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none italic uppercase">{SERVICES[activeIndex].title}</h3>
                    <p className="text-zinc-400 text-sm md:text-lg font-light leading-relaxed">{SERVICES[activeIndex].description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-black tracking-widest uppercase text-zinc-300">RANK A+</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-zinc-500" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-8 mt-12 z-20">
            <button onClick={slidePrev} className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl hover:bg-white/10 transition-all text-zinc-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-3">
              {SERVICES.map((_, idx) => (
                <button key={idx} onClick={() => setActiveIndex(idx)} className={`h-1.5 rounded-full transition-all duration-700 ${activeIndex === idx ? "w-10 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "w-1.5 bg-zinc-800"}`} />
              ))}
            </div>
            <button onClick={slideNext} className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl hover:bg-white/10 transition-all text-zinc-400">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Logos Strip - Ensure background is black/40 to see smoke behind it */}
      <div className="w-full py-10 mt-auto border-t border-white/5 bg-black/40 overflow-hidden relative backdrop-blur-sm">
        <div className="flex animate-marquee items-center">
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <div key={i} className="flex items-center mx-10 md:mx-16 gap-3 opacity-60">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-zinc-400">{logo.icon}</span>
              </div>
              <span className="text-lg md:text-xl font-black tracking-[0.3em] text-zinc-200 uppercase">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
}