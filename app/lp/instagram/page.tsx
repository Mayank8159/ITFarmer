"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";

export default function InstagramLandingPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/data/postsContent')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Error loading posts:", err));
  }, []);

  const projects = posts.filter(p => p.category === "Project").slice(0, 3);

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[800px] mx-auto px-6">
        
        {/* HERO */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">
            NEURAL FORGE HUB
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-black mb-6"
          >
            STOP BUILDING PROTOTYPES. LET'S BUILD THE <span className="text-[#ff6b00]">PRODUCT.</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full sticky top-24 z-40 mb-8"
          >
            <Link 
              href="/contact" 
              className="w-full block px-8 py-5 bg-[#ff6b00] text-black font-black uppercase tracking-widest text-lg border-4 border-black hover:bg-black hover:text-white transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 flex items-center justify-center gap-3"
            >
              <Terminal className="w-5 h-5" />
              Book a Strategy Call
            </Link>
          </motion.div>
        </div>

        {/* VISUAL CASE STUDIES */}
        <div className="grid grid-cols-1 gap-12 mb-20">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BrutalistCard whiteBg className="flex flex-col p-0 overflow-hidden border-4">
                <div className="p-6 border-b-4 border-black bg-white">
                  <h3 className="text-3xl font-black uppercase text-black leading-[0.9] tracking-tighter">
                    {project.title}
                  </h3>
                  <p className="font-mono text-sm text-black/60 mt-3">{project.description?.slice(0, 100)}...</p>
                </div>
                
                <div className="w-full bg-[#f8f8f8] flex items-center justify-center p-6 relative overflow-hidden">
                  {project.architectureImage || project.image ? (
                    <img 
                      src={project.architectureImage || project.image} 
                      alt={project.title} 
                      className="w-full h-auto object-contain mix-blend-multiply max-h-[400px]" 
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center">
                       <span className="font-mono text-xs text-black/30">[ VISUAL ASSET PENDING ]</span>
                    </div>
                  )}
                </div>
                <div className="bg-black p-4 text-white text-center">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff6b00]">{project.results?.slice(0, 120)}</p>
                </div>
              </BrutalistCard>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="flex flex-col items-center pb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-center">Ready to Forge?</h2>
          <Link 
            href="/contact" 
            className="w-full md:w-auto px-12 py-6 bg-black text-white font-black uppercase tracking-widest text-lg hover:bg-[#ff6b00] hover:text-black transition-colors border-4 border-black flex items-center justify-center gap-3"
          >
            Book a Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
