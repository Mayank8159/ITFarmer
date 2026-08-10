"use client";

import React, { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import { Terminal, Database, Server, Cpu, Radio, Layout, FileText } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";

export default function ArchivesPage(): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/postsContent')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading posts data:", err);
        setIsLoading(false);
      });
  }, []);

  const projects = posts.filter(p => p.category === "Work");
  
  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-black/50 animate-pulse">Accessing Archives...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden">
      
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-16 border-b-4 border-black pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">
              PRODUCTION ENGINEERING PORTFOLIO
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black"
            >
              CASE <br /><span className="text-[#ff6b00]">STUDIES.</span>
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-black/70 font-mono text-sm max-w-sm bg-white border-2 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            A comprehensive index of our engineering executions. The Problem, The Architecture, and The Engineering Impact.
          </motion.p>
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 gap-16">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <BrutalistCard whiteBg className="flex flex-col hover:border-[#ff6b00] transition-colors group p-0 overflow-hidden">
                
                {/* PROJECT HEADER */}
                <div className="p-8 md:p-12 border-b-4 border-black">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-white bg-black px-3 py-1 mb-4 inline-block">
                        [{project.scope === "Client" ? "CLIENT BUILD" : "INTERNAL BUILD"}] • {project.client ? project.client : "Neural Forge Hub"} • {project.date}
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black uppercase text-black leading-[0.9] tracking-tighter">
                        {project.title}
                      </h2>
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="flex-shrink-0 px-6 py-3 bg-[#ff6b00] text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                        View Live Deployment
                      </a>
                    )}
                  </div>
                  
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech: string, i: number) => (
                        <span key={i} className="font-mono text-[10px] uppercase tracking-widest font-bold text-black border border-black/20 px-2 py-1 bg-black/5">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* PROJECT BODY */}
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left Column: Image/Architecture */}
                  <div className="border-r-0 md:border-r-4 border-black border-b-4 md:border-b-0 flex flex-col h-full bg-[#f8f8f8]">
                    {project.architectureImage ? (
                      <div className="w-full flex-1 min-h-[300px] border-b-4 border-black bg-white flex items-center justify-center p-8 relative overflow-hidden group-hover:bg-black/5 transition-colors">
                        <img src={project.architectureImage} alt={`${project.title} Architecture`} className="w-full h-full object-contain mix-blend-multiply drop-shadow-md hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 bg-black text-[#ff6b00] px-2 py-1 text-[8px] font-mono font-bold uppercase tracking-widest border border-black/20">SYSTEM DIAGRAM</div>
                      </div>
                    ) : project.image ? (
                      <div className="w-full flex-1 min-h-[300px] border-b-4 border-black bg-black flex items-center justify-center p-4">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700 border border-white/10" />
                      </div>
                    ) : (
                      <div className="w-full flex-1 min-h-[300px] border-b-4 border-black flex items-center justify-center bg-black/5">
                        <Server className="w-12 h-12 text-black/20" />
                      </div>
                    )}
                    <div className="p-8 bg-white">
                       <h4 className="text-[10px] font-mono text-black/50 font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">
                         OVERVIEW
                       </h4>
                       <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
                         {project.description || "No overview provided."}
                       </p>
                    </div>
                  </div>

                  {/* Right Column: Challenge, Solution, Results */}
                  <div className="flex flex-col bg-white">
                    <div className="p-8 border-b-4 border-black flex-1">
                      <h4 className="text-[10px] font-mono text-[#ff6b00] font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2 flex items-center gap-2">
                        <Radio className="w-3 h-3" /> THE CHALLENGE
                      </h4>
                      <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
                        {project.challenge || "Engineering problem definition pending."}
                      </p>
                    </div>
                    <div className="p-8 border-b-4 border-black flex-1 bg-black/5">
                      <h4 className="text-[10px] font-mono text-black font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2 flex items-center gap-2">
                        <Layout className="w-3 h-3" /> THE SOLUTION
                      </h4>
                      <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
                        {project.solution || "Technical implementation details pending."}
                      </p>
                    </div>
                    <div className="p-8 flex-1 bg-black text-white relative overflow-hidden group-hover:bg-[#111] transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/10 rounded-full blur-3xl" />
                      <h4 className="text-[10px] font-mono text-[#ff6b00] font-bold uppercase tracking-widest mb-4 border-b border-white/20 pb-2 flex items-center gap-2 relative z-10">
                        <Terminal className="w-3 h-3" /> ENGINEERING RESULTS
                      </h4>
                      <p className="font-mono text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-bold relative z-10">
                        {project.results || "Performance metrics pending."}
                      </p>
                    </div>
                  </div>
                </div>

              </BrutalistCard>
            </motion.div>
          ))}
        </div>

        </div>
    </main>
  );
}