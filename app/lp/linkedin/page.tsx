"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, Layout, Terminal } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";
import TerminalEstimator from "@/components/sections/TerminalEstimator";

export default function LinkedinLandingPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/data/postsContent')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error loading posts:", err));
  }, []);

  const projects = posts.filter(p => p.category === "Project").slice(0, 2);

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        
        {/* HERO */}
        <div className="mb-20 text-center flex flex-col items-center">
          <div className="bg-[#ff6b00] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">
            NEURAL FORGE HUB ENGINEERING
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black mb-8"
          >
            SHIP PRODUCTION AI IN <span className="text-[#ff6b00]">WEEKS,</span> NOT QUARTERS.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-black/70 font-mono text-sm md:text-base max-w-2xl bg-white border-2 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            We are the elite engineering studio you wish you had in-house. We build, scale, and deploy complex AI architectures and full-stack software.
          </motion.p>
        </div>

        {/* B2B CASE STUDIES */}
        <div className="grid grid-cols-1 gap-16 mb-24">
          <div className="border-b-4 border-black pb-4 mb-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Verified Deployments</h2>
          </div>
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BrutalistCard whiteBg className="flex flex-col p-0 overflow-hidden">
                <div className="p-8 md:p-12 border-b-4 border-black">
                  <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-white bg-black px-3 py-1 mb-4 inline-block">
                    {project.client || "Internal Project"}
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase text-black leading-[0.9] tracking-tighter mb-6">
                    {project.title}
                  </h3>
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
                
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="border-r-0 md:border-r-4 border-black border-b-4 md:border-b-0 flex flex-col h-full bg-[#f8f8f8]">
                    {project.architectureImage ? (
                      <div className="w-full flex-1 min-h-[300px] border-b-4 border-black bg-white flex items-center justify-center p-8 relative overflow-hidden group-hover:bg-black/5 transition-colors">
                        <img src={project.architectureImage} alt={`${project.title} Architecture`} className="w-full h-full object-contain mix-blend-multiply drop-shadow-md" />
                      </div>
                    ) : null}
                    <div className="p-8 bg-white flex-1">
                       <h4 className="text-[10px] font-mono text-[#ff6b00] font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2 flex items-center gap-2">
                         <Radio className="w-3 h-3" /> THE CHALLENGE
                       </h4>
                       <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
                         {project.challenge || project.description}
                       </p>
                    </div>
                  </div>

                  <div className="flex flex-col bg-white">
                    <div className="p-8 border-b-4 border-black flex-1 bg-black/5">
                      <h4 className="text-[10px] font-mono text-black font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2 flex items-center gap-2">
                        <Layout className="w-3 h-3" /> THE SOLUTION
                      </h4>
                      <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
                        {project.solution || "Technical implementation details."}
                      </p>
                    </div>
                    <div className="p-8 flex-1 bg-black text-white relative overflow-hidden">
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

        {/* ESTIMATOR CTA */}
        <div className="flex flex-col items-center">
          <div className="mb-12 text-center max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Initialize Your Build</h2>
            <p className="font-mono text-sm text-black/70">Define your scope and budget below. A core engineer will review your payload and contact you to begin deployment.</p>
          </div>
          <div className="w-full flex justify-center">
             <TerminalEstimator />
          </div>
        </div>
      </div>
    </main>
  );
}
