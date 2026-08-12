"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";

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

export default function ProjectShowcaseClient({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show projects, filtering by Project or Work (or just taking top ones)
  const displayProjects = projects.filter(p => p.category === "Work" || p.category === "Project");

  const paginate = (newDirection: number) => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = displayProjects.length - 1;
      if (nextIndex >= displayProjects.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (!displayProjects || displayProjects.length === 0) return null;

  // Determine indices for 3D carousel effect
  const getVisibleIndices = () => {
    if (displayProjects.length === 1) return [0];
    if (displayProjects.length === 2) return [currentIndex, (currentIndex + 1) % 2];
    const prev = (currentIndex - 1 + displayProjects.length) % displayProjects.length;
    const next = (currentIndex + 1) % displayProjects.length;
    return [prev, currentIndex, next];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="relative w-full py-24 bg-[#e5e5e5] overflow-hidden flex flex-col items-center border-b border-black/15">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-100" />
        
        {/* Floating Brutalist Shapes (Synced with Hero) */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-1/4 right-[10%] w-32 h-32 border-2 border-dashed border-black/10 flex items-center justify-center"
        >
          <div className="w-16 h-16 border-4 border-black/5" />
        </motion.div>
      </div>

      {/* Header (Light Brutalist) */}
      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col md:flex-row md:items-end justify-between mb-16 border-b-4 border-black pb-6">
        <div>
          <div className="border-4 border-black px-4 py-2 mb-4 bg-white inline-flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Cpu className="w-4 h-4 text-[#ff6b00]" />
            <span className="font-mono text-xs uppercase tracking-widest text-black font-black">
              System Deployments
            </span>
          </div>
          <h3 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-[0.9]">
            Production <span className="text-[#ff6b00]">Assets</span>
          </h3>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-4 mt-8 md:mt-0">
          <button
            onClick={() => paginate(-1)}
            className="w-14 h-14 flex items-center justify-center border-4 border-black text-black hover:bg-[#ff6b00] hover:text-white transition-all bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            <ChevronLeft className="w-8 h-8 font-black" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="w-14 h-14 flex items-center justify-center border-4 border-black text-black hover:bg-[#ff6b00] hover:text-white transition-all bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            <ChevronRight className="w-8 h-8 font-black" />
          </button>
        </div>
      </div>

      {/* 3D Slider Container */}
      <div className="relative w-full h-[650px] flex items-center justify-center z-10 perspective-1000">
        {displayProjects.map((project, idx) => {
          let offset = 0;
          if (idx === currentIndex) offset = 0;
          else if (idx === visibleIndices[0]) offset = -1;
          else if (idx === visibleIndices[2]) offset = 1;
          else return null;

          const isCenter = offset === 0;

          return (
            <motion.div
              key={project.id}
              animate={{
                x: offset === 0 ? "0%" : offset === -1 ? "-60%" : "60%",
                scale: offset === 0 ? 1 : 0.85,
                opacity: offset === 0 ? 1 : 0.4,
                zIndex: offset === 0 ? 20 : 10,
                rotateY: offset === 0 ? 0 : offset === -1 ? 15 : -15
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute w-[90%] md:w-[900px] h-[550px] md:h-[600px] bg-black border-4 border-black overflow-hidden cursor-pointer group ${isCenter ? 'shadow-[16px_16px_0px_rgba(0,0,0,1)]' : 'shadow-[8px_8px_0px_rgba(0,0,0,1)]'}`}
              onClick={() => {
                if (!isCenter) {
                  paginate(offset);
                }
              }}
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center">
                    <Cpu className="w-16 h-16 text-[#00ff41] opacity-20" />
                  </div>
                )}
                {/* Gradient Overlays for readability */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Holographic scanning line effect */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff41]/50 shadow-[0_0_10px_#00ff41] animate-scan opacity-30 group-hover:opacity-60" />
              </div>

              {/* Top Bar Accent */}
              <div className="absolute top-0 left-0 w-full bg-black/80 backdrop-blur-sm h-8 flex items-center px-4 gap-2 z-20 border-b border-white/10">
                <div className="w-3 h-3 bg-[#ff6b00]" />
                <div className="w-3 h-3 bg-white/20" />
                <div className="w-3 h-3 bg-white/20" />
                <span className="ml-auto font-mono text-[9px] text-white/70 font-bold tracking-widest uppercase">
                  ID: {project.id.slice(0,8)}
                </span>
              </div>

              {/* Holographic Info Card */}
              {isCenter && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-6 left-6 md:left-10 w-[85%] md:w-[450px] p-6 bg-white/10 backdrop-blur-md border border-white/20 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                  {/* Holographic Corner Accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#00ff41]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#00ff41]" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#00ff41]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#00ff41]" />
                  
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/20">
                    <span className="font-mono text-[10px] font-black uppercase text-black bg-[#00ff41] px-2 py-0.5">
                      {project.client || "INTERNAL"}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-white/70 tracking-widest">
                      {project.date}
                    </span>
                  </div>
                  
                  <h4 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tighter mb-3 leading-none drop-shadow-md">
                    {project.title}
                  </h4>

                  <p className="font-mono text-xs text-white/80 leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.split(',').slice(0, 3).map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 bg-black/40 border border-white/20 text-white text-[9px] font-bold uppercase"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Expand Button at Bottom Right */}
                  <div className="absolute -bottom-4 -right-4 md:-bottom-5 md:-right-5">
                    <Link 
                      href={`/work#${project.id}`}
                      className="w-12 h-12 md:w-16 md:h-16 bg-[#ff6b00] border-2 border-white flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group/btn"
                    >
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover/btn:-rotate-45 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Indicator Tracker */}
      <div className="relative z-10 flex items-center gap-3 mt-16">
        {displayProjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-4 transition-all duration-300 border-2 border-black ${
              idx === currentIndex ? "w-12 bg-[#ff6b00]" : "w-4 bg-white hover:bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
