"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Cpu } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  client: string;
  technologies: string;
  challenge: string;
  solution: string;
  results: string;
};

const BACKGROUND_TERMS = [
  "IT_FARMER", "NEURAL_FORGE_HUB", "CYBER_SEC", "AI_PIPELINE", "ZERO_TRUST", 
  "LLM_ORCHESTRATION", "EDGE_COMPUTING", "QUANTUM_RESISTANT", "AUTONOMOUS_AGENTS"
];

export default function ProjectShowcaseClient({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // We only show Works in the slider. Let's filter to be safe, though parent might have passed all.
  const displayProjects = projects.filter(p => p.category === "Work");

  const paginate = (newDirection: number) => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = displayProjects.length - 1;
      if (nextIndex >= displayProjects.length) nextIndex = 0;
      return nextIndex;
    });
  };

  // For dynamic background glitch text
  const [glitchTerm, setGlitchTerm] = useState(BACKGROUND_TERMS[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchTerm(BACKGROUND_TERMS[Math.floor(Math.random() * BACKGROUND_TERMS.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!displayProjects || displayProjects.length === 0) return null;

  // We want to render the current, previous, and next slides.
  // We'll calculate the array of 3 indices.
  const getVisibleIndices = () => {
    if (displayProjects.length === 1) return [0];
    if (displayProjects.length === 2) return [currentIndex, (currentIndex + 1) % 2];
    const prev = (currentIndex - 1 + displayProjects.length) % displayProjects.length;
    const next = (currentIndex + 1) % displayProjects.length;
    return [prev, currentIndex, next];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="relative w-full py-24 bg-[#0a0a0a] overflow-hidden flex flex-col items-center border-t-4 border-b-4 border-black">
      
      {/* Background Animated Terms */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden z-0">
        <motion.h1 
          key={glitchTerm}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-[12vw] font-black uppercase text-white tracking-tighter whitespace-nowrap"
        >
          {glitchTerm}
        </motion.h1>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col md:flex-row md:items-end justify-between mb-16 border-b-2 border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-6 h-6 text-[#00ff41] animate-pulse" />
            <h2 className="text-[#00ff41] font-mono text-sm font-bold tracking-widest uppercase">
              Build Infrastructure
            </h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Holographic <span className="text-[#00ff41]">Deployments</span>
          </h3>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <button
            onClick={() => paginate(-1)}
            className="w-12 h-12 flex items-center justify-center border-2 border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all bg-black shadow-[4px_4px_0px_#00ff41]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="w-12 h-12 flex items-center justify-center border-2 border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all bg-black shadow-[4px_4px_0px_#00ff41]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 3D Slider Container */}
      <div className="relative w-full h-[600px] flex items-center justify-center z-10 perspective-1000">
        {displayProjects.map((project, idx) => {
          // Determine position relative to current
          let offset = 0; // default hidden
          if (idx === currentIndex) offset = 0;
          else if (idx === visibleIndices[0]) offset = -1; // prev
          else if (idx === visibleIndices[2]) offset = 1;  // next
          else return null; // don't render others

          const isCenter = offset === 0;

          return (
            <motion.div
              key={project.id}
              animate={{
                x: offset === 0 ? "0%" : offset === -1 ? "-60%" : "60%",
                scale: offset === 0 ? 1 : 0.8,
                opacity: offset === 0 ? 1 : 0.4,
                zIndex: offset === 0 ? 20 : 10,
                rotateY: offset === 0 ? 0 : offset === -1 ? 15 : -15
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute w-[90%] md:w-[800px] h-full bg-black border-2 border-[#00ff41]/50 shadow-[0_0_50px_rgba(0,255,65,0.15)] flex items-center justify-center overflow-hidden cursor-pointer group"
              onClick={() => {
                if (!isCenter) {
                  paginate(offset);
                }
              }}
            >
              {/* Main Image as Absolute Background */}
              {project.image && (
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                </div>
              )}

              {/* Holographic Box in the Middle */}
              <motion.div 
                animate={{
                  scale: isCenter ? 1 : 0.9,
                  opacity: isCenter ? 1 : 0,
                  y: isCenter ? 0 : 20
                }}
                className="relative z-10 w-[85%] md:w-[600px] bg-black/60 backdrop-blur-md border border-[#00ff41] p-8 shadow-[0_0_30px_rgba(0,255,65,0.2)]"
              >
                {/* Holographic Corner Accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-[#00ff41]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-[#00ff41]" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-[#00ff41]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-[#00ff41]" />

                <div className="text-[#00ff41]/70 font-mono text-[10px] uppercase tracking-widest mb-4 flex justify-between">
                  <span>CLIENT: {project.client || "INTERNAL"}</span>
                  <span>{project.date}</span>
                </div>
                
                <h4 className="text-3xl font-black uppercase text-white mb-4 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {project.title}
                </h4>

                <p className="font-mono text-sm text-white/80 leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies?.split(',').slice(0, 4).map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] text-[10px] font-bold uppercase"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Indicator dots */}
      <div className="relative z-10 flex items-center gap-2 mt-12">
        {displayProjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-[#00ff41] shadow-[0_0_10px_#00ff41]" : "w-2 bg-white/20 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
