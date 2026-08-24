"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Project } from "@/lib/projects";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Crosshair, Terminal, ShieldAlert, Cpu } from "lucide-react";

// Theme generator based on category
const getTheme = (category: string = "") => {
  const cat = category.toLowerCase();
  
  if (cat.includes("security") || cat.includes("zero-leakage")) {
    return {
      id: "security",
      primary: "#ef4444", // red-500
      accentClass: "text-red-500",
      borderClass: "border-red-500",
      bgClass: "bg-red-500",
      hoverShadow: "hover:shadow-[6px_6px_0px_0px_#ef4444]",
      expandedGradient: "from-red-600/20 via-black/80 to-red-900/10",
      icon: <ShieldAlert className="w-4 h-4 text-red-500" />
    };
  }
  
  if (cat.includes("ai") || cat.includes("agent") || cat.includes("llm") || cat.includes("ml")) {
    return {
      id: "ai",
      primary: "#22c55e", // green-500
      accentClass: "text-green-500",
      borderClass: "border-green-500",
      bgClass: "bg-green-500",
      hoverShadow: "hover:shadow-[6px_6px_0px_0px_#22c55e]",
      expandedGradient: "from-green-600/20 via-black/80 to-emerald-900/10",
      icon: <Cpu className="w-4 h-4 text-green-500" />
    };
  }
  
  if (cat.includes("architecture") || cat.includes("system") || cat.includes("infrastructure")) {
    return {
      id: "architecture",
      primary: "#06b6d4", // cyan-500
      accentClass: "text-cyan-500",
      borderClass: "border-cyan-500",
      bgClass: "bg-cyan-500",
      hoverShadow: "hover:shadow-[6px_6px_0px_0px_#06b6d4]",
      expandedGradient: "from-cyan-600/20 via-black/80 to-blue-900/10",
      icon: <ScanLine className="w-4 h-4 text-cyan-500" />
    };
  }
  
  // Default Obsidian Tempest
  return {
    id: "default",
    primary: "#ff6b00",
    accentClass: "text-[#ff6b00]",
    borderClass: "border-[#ff6b00]",
    bgClass: "bg-[#ff6b00]",
    hoverShadow: "hover:shadow-[6px_6px_0px_0px_#ff6b00]",
    expandedGradient: "from-[#ff6b00]/20 via-black/80 to-[#ff6b00]/10",
    icon: <Terminal className="w-4 h-4 text-[#ff6b00]" />
  };
};

export default function WorksClient({ initialProjects }: { initialProjects: Project[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSlug(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // Check if we navigated here with a specific project parameter
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const proj = params.get("project");
      if (proj) {
        setSelectedSlug(proj);
        // Clean up URL without reloading
        window.history.replaceState({}, '', '/works');
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#e5e5e5] text-black pt-20">
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black pb-8">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-[#ff6b00] uppercase mb-4">
              {"// ARCHIVE_INDEX"}
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              Selected <span className="text-[#ff6b00]">Architecture</span>
            </h1>
          </div>
          <p className="font-mono text-xs text-black/60 font-bold">
            12 SYSTEMS // VERIFIED BUILDS // NO VAPORWARE
          </p>
        </div>
        <p className="mt-8 max-w-2xl text-black/80 leading-relaxed font-bold">
          A verified catalog of production-grade systems, autonomous agents, and
          high-throughput platforms. No conceptual mockups. Only deployed engineering.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence initial={false}>
            {initialProjects.map((p) => {
              const isSelected = selectedSlug === p.slug;
              const theme = getTheme(p.category);

              return (
                <motion.div
                  key={p.slug}
                  layout
                  className={`${isSelected ? "md:col-span-2" : "col-span-1"} w-full`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {!isSelected ? (
                    <button
                      onClick={() => setSelectedSlug(p.slug)}
                      className={`w-full h-full flex flex-col group text-left bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${theme.hoverShadow} hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 overflow-hidden`}
                    >
                      {/* DYNAMIC IMAGE FRAME */}
                      <div className={`relative w-full aspect-[16/9] bg-black overflow-hidden border-b-2 ${theme.borderClass}`}>
                        {p.image && (
                          <div className="relative w-full h-full">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.04] grayscale"
                            />
                            {/* Colorizing Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-tr from-black via-${theme.primary}/40 to-transparent mix-blend-color transition-opacity duration-500 group-hover:opacity-100 opacity-80`} style={{
                              background: `linear-gradient(to top right, black, ${theme.primary} 50%, transparent)`
                            }} />
                            <div className={`absolute inset-0 bg-${theme.bgClass.replace('bg-', '')}/30 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0`} style={{ backgroundColor: theme.primary, opacity: 0.3, mixBlendMode: 'overlay' }} />
                          </div>
                        )}
                        
                        {/* Structural Overlays based on theme */}
                        {theme.id === "security" && (
                          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.15)_10px,rgba(239,68,68,0.15)_20px)] pointer-events-none" />
                        )}
                        {theme.id === "ai" && (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0%,transparent_100%)] pointer-events-none" />
                        )}
                        {theme.id === "architecture" && (
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                        )}

                        {/* Top-left HUD badge */}
                        <div className={`absolute top-0 left-0 flex items-center bg-black border-r border-b ${theme.borderClass} px-3 py-2 gap-2`}>
                          {theme.icon}
                          <span className={`font-mono text-[10px] font-bold tracking-widest uppercase ${theme.accentClass}`}>
                            {p.index}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h2 className="text-2xl font-black tracking-tight">{p.title}</h2>
                          <span className={`font-mono text-xs font-bold whitespace-nowrap mt-2 group-hover:${theme.accentClass} transition-colors`}>
                            OPEN +
                          </span>
                        </div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/60 mb-3">
                          {p.category}
                        </p>
                        <p className="text-sm leading-relaxed text-black/80 mb-5 font-medium flex-1">
                          {p.summary}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {p.stack.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-black text-white"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="w-full relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group"
                    >
                      {/* DYNAMIC HOLOGRAPHIC BACKGROUND */}
                      <div className="absolute inset-0 bg-black/90 z-0">
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.expandedGradient}`} />
                        {p.image && (
                          <Image 
                            src={p.image} 
                            alt={p.title} 
                            fill 
                            className="object-cover opacity-20 mix-blend-overlay blur-md"
                          />
                        )}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay"></div>
                      </div>

                      {/* CONTENT */}
                      <div className={`relative z-10 p-6 md:p-10 border ${theme.borderClass}/40 backdrop-blur-xl flex flex-col md:flex-row gap-8`}>
                        <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-4">
                          <button
                            onClick={() => setSelectedSlug(null)}
                            className={`font-mono text-xs font-bold border ${theme.borderClass}/50 bg-black/50 ${theme.accentClass} px-4 py-2 hover:${theme.bgClass} hover:text-white transition-colors`}
                          >
                            MINIMIZE -
                          </button>
                        </div>

                        {/* LEFT COLUMN */}
                        <div className="flex-1 space-y-6">
                          <div className="flex items-center gap-3">
                            {theme.icon}
                            <p className={`font-mono text-xs ${theme.accentClass} font-bold uppercase tracking-widest`}>
                              {p.index} {"//"} {p.category}
                            </p>
                          </div>
                          
                          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                            {p.title}
                          </h2>
                          <p className="text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-2xl">
                            {p.summary}
                          </p>
                          
                          {/* Expanded Image with Dynamic Frame */}
                          <div className={`relative w-full aspect-[16/9] border ${theme.borderClass}/30 bg-black overflow-hidden shadow-[0_0_30px_${theme.primary}25]`}>
                            {p.image && (
                              <div className="relative w-full h-full">
                                <Image src={p.image} alt={p.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover grayscale" />
                                <div className="absolute inset-0 mix-blend-color opacity-90" style={{
                                  background: `linear-gradient(to top right, black, ${theme.primary} 60%, transparent)`
                                }} />
                                <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ backgroundColor: theme.primary }} />
                              </div>
                            )}
                            {theme.id === "security" && (
                              <>
                                <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-red-500/30" />
                                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500/50" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500/50" />
                              </>
                            )}
                            {theme.id === "ai" && (
                               <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(34,197,94,0.05)_2px,transparent_2px)] bg-[size:100%_4px] pointer-events-none" />
                            )}
                            {theme.id === "architecture" && (
                               <div className="absolute inset-0 border-[4px] border-cyan-500/10 m-4 pointer-events-none" />
                            )}
                          </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex-1 space-y-8 md:mt-24">
                          <div className="space-y-6">
                            <div className={`border ${theme.borderClass}/30 bg-black/40 backdrop-blur-md p-6`}>
                              <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${theme.accentClass} mb-3`}>
                                The Problem
                              </h3>
                              <p className="text-sm font-medium leading-relaxed text-white/90">
                                {p.problem}
                              </p>
                            </div>
                            <div className={`border ${theme.borderClass} ${theme.bgClass}/10 backdrop-blur-md p-6 shadow-[0_0_20px_${theme.primary}25]`}>
                              <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${theme.accentClass} mb-3`}>
                                The Engineering Response
                              </h3>
                              <p className="text-sm font-medium leading-relaxed text-white/90">
                                {p.solution}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className={`font-mono text-xs font-bold uppercase tracking-widest border-b ${theme.borderClass}/30 ${theme.accentClass} pb-2 mb-4`}>
                              System Architecture
                            </h3>
                            <ul className="grid grid-cols-1 gap-2">
                              {p.architecture.map((a) => (
                                <li key={a} className={`flex gap-3 text-sm font-medium text-white/80 leading-relaxed bg-black/40 border ${theme.borderClass}/20 px-4 py-3`}>
                                  <span className={`${theme.accentClass} font-mono font-bold`}>▸</span>
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className={`font-mono text-xs font-bold uppercase tracking-widest border-b ${theme.borderClass}/30 ${theme.accentClass} pb-2 mb-4`}>
                              Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {p.stack.map((t) => (
                                <span key={t} className="px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-white text-black">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
