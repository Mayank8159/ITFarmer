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

  // Filter to only show Work projects
  const displayProjects = projects.filter(p => p.category === "Work");

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
    <section className="relative w-full py-24 bg-[#fafafa] overflow-hidden flex flex-col items-center border-t-4 border-b-4 border-black">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

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
                opacity: offset === 0 ? 1 : 0.7,
                zIndex: offset === 0 ? 20 : 10,
                rotateY: offset === 0 ? 0 : offset === -1 ? 15 : -15
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute w-[90%] md:w-[850px] h-full bg-white border-4 border-black flex flex-col items-center justify-center overflow-hidden cursor-pointer group ${isCenter ? 'shadow-[16px_16px_0px_rgba(0,0,0,1)]' : 'shadow-[8px_8px_0px_rgba(0,0,0,1)]'}`}
              onClick={() => {
                if (!isCenter) {
                  paginate(offset);
                }
              }}
            >
              {/* Top Bar Accent */}
              <div className="w-full bg-black h-8 shrink-0 flex items-center px-4 gap-2">
                <div className="w-3 h-3 bg-[#ff6b00] rounded-full" />
                <div className="w-3 h-3 bg-white/20 rounded-full" />
                <div className="w-3 h-3 bg-white/20 rounded-full" />
                <span className="ml-auto font-mono text-[9px] text-white font-bold tracking-widest uppercase">
                  ID: {project.id.slice(0,8)}
                </span>
              </div>

              {/* Layout Split */}
              <div className="flex flex-col md:flex-row w-full h-full flex-1">
                {/* HOLOGRAPHIC Image Section */}
                <div className="relative w-full md:w-1/2 h-48 md:h-full border-b-4 md:border-b-0 md:border-r-4 border-black bg-black shrink-0 overflow-hidden shadow-[inset_0_0_50px_rgba(0,255,65,0.15)] flex items-center justify-center">
                  {project.image ? (
                    <>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                      
                      {/* Holographic scanning line effect */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff41]/50 shadow-[0_0_10px_#00ff41] animate-scan opacity-50" />
                      
                      {/* Holographic Corner Accents inside image */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#00ff41]" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#00ff41]" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#00ff41]" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#00ff41]" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center font-mono text-[#00ff41] font-bold uppercase tracking-widest relative">
                      <div className="absolute inset-0 bg-[#00ff41]/5 animate-pulse" />
                      <Cpu className="w-8 h-8 mb-2 opacity-50" />
                      NO IMAGE DATA
                    </div>
                  )}
                </div>

                {/* Content Section (Light Brutalist) */}
                <motion.div 
                  animate={{ opacity: isCenter ? 1 : 0.3 }}
                  className="p-8 w-full md:w-1/2 flex flex-col h-full overflow-y-auto bg-white"
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-black">
                    <span className="font-mono text-xs font-black uppercase text-black bg-[#ff6b00] px-2 py-1">
                      {project.client || "INTERNAL"}
                    </span>
                    <span className="font-mono text-xs font-black text-black">
                      {project.date}
                    </span>
                  </div>
                  
                  <h4 className="text-4xl font-black uppercase text-black tracking-tighter mb-4 leading-none">
                    {project.title}
                  </h4>

                  <p className="font-mono text-sm text-black font-bold leading-relaxed mb-8 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies?.split(',').slice(0, 4).map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-white border-2 border-black text-black text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Redirection CTA */}
                  {isCenter && (
                    <Link 
                      href={`/work#${project.id}`}
                      className="mt-auto px-6 py-4 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-[#ff6b00] hover:text-black transition-all border-4 border-transparent hover:border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                      Expand Specs <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </motion.div>
              </div>
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
