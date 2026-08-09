"use client";

import React, { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import { Terminal, Database, Server, Cpu, Radio, Layout, FileText } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";

export default function ArchivesPage(): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/postsContent.json?t=' + Date.now())
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

  const projects = posts.filter(p => p.category === "Project");
  const updates = posts.filter(p => p.category === "Update" || p.category === "Team");

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
              THE FORGE ARCHIVES
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black"
            >
              PROJECT <br /><span className="text-[#ff6b00]">CATALOG.</span>
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
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <BrutalistCard whiteBg className="h-full flex flex-col hover:border-[#ff6b00] transition-colors group">
                
                {/* PROJECT HEADER */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-black">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff6b00] transition-colors overflow-hidden">
                    {project.image ? (
                       <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale contrast-125" />
                    ) : (
                       <Cpu className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase text-black leading-tight mb-2">
                      {project.title}
                    </h2>
                    <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-white bg-black px-2 py-0.5 inline-block">
                      {project.date}
                    </div>
                  </div>
                </div>

                {/* PROJECT DETAILS */}
                <div className="flex-1 flex flex-col gap-6">
                  <div>
                    <h4 className="text-[10px] font-mono text-[#ff6b00] font-bold uppercase tracking-widest mb-1">
                      CORE ENGINEERING FOCUS
                    </h4>
                    <p className="font-black text-black uppercase leading-tight">
                      Infrastructure Execution
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-mono text-black/50 font-bold uppercase tracking-widest mb-1 border-b border-black/10 pb-1">
                      OVERVIEW
                    </h4>
                    <p className="font-mono text-sm text-black/70 leading-relaxed mt-2 whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>
                </div>
              </BrutalistCard>
            </motion.div>
          ))}
        </div>

        {/* LIVE UPDATES SECTION */}
        <div className="mt-32 pt-20 border-t-4 border-black">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="bg-[#ff6b00] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6 animate-pulse">
                LIVE FEED
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-black">
                SYSTEM <br />UPDATES.
              </h2>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory w-full">
            {updates.map((update, idx) => (
              <motion.div
                key={update.id || idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[85vw] md:min-w-[600px] snap-start bg-white border-2 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group flex flex-col md:flex-row gap-8"
              >
                {/* Meta */}
                <div className="w-full md:w-48 flex-shrink-0 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-black/50 mb-2">{update.date}</div>
                    <div className="text-[10px] font-mono font-bold text-white bg-black px-2 py-1 inline-block uppercase tracking-widest group-hover:bg-[#ff6b00] transition-colors">
                      {update.category}
                    </div>
                  </div>
                  {update.image && (
                     <div className="mt-4 w-full h-24 border border-black/10 overflow-hidden">
                        <img src={update.image} className="w-full h-full object-cover grayscale contrast-125" alt="" />
                     </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 border-l-2 border-black/10 pl-0 md:pl-8">
                  <h3 className="font-black text-2xl uppercase text-black mb-4 group-hover:text-[#ff6b00] transition-colors">{update.title}</h3>
                  <p className="font-mono text-sm text-black/70 leading-relaxed font-bold max-w-[500px] whitespace-pre-wrap">
                    {update.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}