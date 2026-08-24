'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/lib/projects';

// Theme generator based on category
const getTheme = (category: string = "") => {
  const cat = category.toLowerCase();
  
  if (cat.includes("security") || cat.includes("zero-leakage")) {
    return { id: "security", primary: "#ef4444", bgClass: "bg-red-500", gradient: "linear-gradient(to top right, black, #ef4444 50%, transparent)" };
  }
  if (cat.includes("ai") || cat.includes("agent") || cat.includes("llm") || cat.includes("ml")) {
    return { id: "ai", primary: "#22c55e", bgClass: "bg-green-500", gradient: "linear-gradient(to top right, black, #22c55e 50%, transparent)" };
  }
  if (cat.includes("architecture") || cat.includes("system") || cat.includes("infrastructure")) {
    return { id: "architecture", primary: "#06b6d4", bgClass: "bg-cyan-500", gradient: "linear-gradient(to top right, black, #06b6d4 50%, transparent)" };
  }
  return { id: "default", primary: "#ff6b00", bgClass: "bg-[#ff6b00]", gradient: "linear-gradient(to top right, black, #ff6b00 50%, transparent)" };
};

export default function ProjectShowcaseClient({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledProjects, setShuffledProjects] = useState<Project[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Shuffle and pick 6 random projects on client-side to avoid hydration mismatch
    const shuffled = [...projects].sort(() => 0.5 - Math.random()).slice(0, 6);
    setShuffledProjects(shuffled);
  }, [projects]);

  const paginate = (newDirection: number) => {
    setCurrentIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex < 0) nextIndex = shuffledProjects.length - 1;
      if (nextIndex >= shuffledProjects.length) nextIndex = 0;
      return nextIndex;
    });
  };

  useEffect(() => {
    if (shuffledProjects.length === 0 || isHovered) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 4500); // Shift every 4.5 seconds
    return () => clearInterval(timer);
  }, [shuffledProjects, isHovered]);

  // Prevent hydration mismatch by rendering skeleton
  if (shuffledProjects.length === 0) {
    return <section className="relative w-full py-16 bg-[#e5e5e5] z-10 min-h-[600px] flex items-center justify-center">
      <div className="font-mono text-xs uppercase tracking-widest text-black/50 animate-pulse">Loading Featured Architecture...</div>
    </section>;
  }

  const project = shuffledProjects[currentIndex];
  const theme = project ? getTheme(project.category) : getTheme("");

  return (
    <section className="relative w-full py-16 bg-[#e5e5e5] z-10 overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Background aesthetic */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#ff6b00]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b-2 border-black/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-[#ff6b00]" />
              <span className="font-mono text-xs uppercase tracking-widest text-black font-black">
                Featured Works
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none">
              Project <span className="text-[#ff6b00]">Review</span>
            </h3>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(-1)}
              className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black text-black hover:bg-[#ff6b00] hover:text-white transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black text-black hover:bg-[#ff6b00] hover:text-white transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Single Image Focused Slider */}
        <div className="relative w-full h-[350px] md:h-[400px] overflow-hidden border-4 border-black bg-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full group"
            >
              {/* Image */}
              {project.image ? (
                <div className="relative w-full h-full bg-black">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale"
                  />
                  {/* Colorizing Gradient Overlay */}
                  <div className="absolute inset-0 mix-blend-color opacity-80 transition-opacity duration-500 group-hover:opacity-100" style={{ background: theme.gradient }} />
                  <div className="absolute inset-0 mix-blend-overlay opacity-30 transition-opacity duration-500 group-hover:opacity-10" style={{ backgroundColor: theme.primary }} />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <Layers className="w-12 h-12 text-gray-500 opacity-50" />
                </div>
              )}

              {/* Glassmorphic overlay for bottom content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

              {/* Info Container */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                
                <div className="flex-1">
                  <span className="font-mono text-[10px] md:text-xs font-bold uppercase text-black bg-[#ff6b00] px-2 py-1 mb-3 inline-block">
                    {project.category}
                  </span>
                  
                  <h4 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-2 drop-shadow-md">
                    {project.title}
                  </h4>

                  <p className="font-sans text-sm md:text-base text-white/90 leading-relaxed max-w-xl line-clamp-2">
                    {project.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link 
                    href={`/works?project=${project.slug}`}
                    className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 group/btn"
                  >
                    View Project <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {shuffledProjects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 ${
                idx === currentIndex ? "w-10 bg-[#ff6b00]" : "w-3 bg-black/20 hover:bg-black/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
