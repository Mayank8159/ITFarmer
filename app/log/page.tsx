"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, ArrowRight, Activity, Calendar } from "lucide-react";
import LeadMagnetGate from "@/components/sections/LeadMagnetGate";

export default function EngineeringLogPage() {
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
        console.error("Error loading posts:", err);
        setIsLoading(false);
      });
  }, []);

  const safePosts = Array.isArray(posts) ? posts : [];
  const logs = safePosts.filter(p => p.category === "Post");

  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-black/50 animate-pulse">Accessing Data...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-16 border-b-4 border-black pb-12">
          <div className="flex items-center gap-3 bg-black text-[#00ff41] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">
            <Activity className="w-3 h-3 animate-pulse" /> SYSTEM.LOGS
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black"
          >
            SYSTEM <br /><span className="text-[#ff6b00]">POSTS.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-black/70 font-mono text-sm max-w-xl bg-white border-2 border-black p-4 mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            Technical write-ups, architecture breakdowns, and system updates straight from the core team building production-ready AI.
          </motion.p>
        </div>

        {/* FEED */}
        <div className="flex flex-col gap-8 mb-24">
          {logs.map((log, idx) => (
            <motion.div
              key={log.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="block bg-white border-4 border-black p-6 md:p-8 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Meta & Client Avatar */}
                  <div className="w-full md:w-48 flex-shrink-0 flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/50 mb-2">
                        <Calendar className="w-3 h-3" /> {log.date}
                      </div>
                      <div className={`text-[10px] font-mono font-bold text-white px-2 py-1 inline-block uppercase tracking-widest ${log.scope === "Client" ? "bg-[#ff6b00]" : "bg-black"}`}>
                        {log.scope === "Client" ? "Client Post" : "Internal Post"}
                      </div>
                    </div>
                    {log.clientPic && (
                      <div className="w-24 h-24 border-2 border-black overflow-hidden bg-[#e5e5e5]">
                        <img src={log.clientPic} alt={log.client || "Client"} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all" />
                      </div>
                    )}
                    {log.client && (
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/70">
                        {log.client}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 border-l-0 md:border-l-2 border-black/10 pl-0 md:pl-8">
                    <h2 className="font-black text-3xl uppercase text-black mb-4 group-hover:text-[#ff6b00] transition-colors">{log.title}</h2>
                    <p className="font-mono text-sm text-black/70 leading-relaxed font-bold whitespace-pre-wrap mb-6">
                      {log.description}
                    </p>
                    {log.image && (() => {
                      // Dynamically determine theme based on title keywords
                      const titleLower = log.title?.toLowerCase() || "";
                      let themeStr = "default";
                      if (titleLower.includes("rag") || titleLower.includes("data") || titleLower.includes("architectures")) themeStr = "blueprint";
                      if (titleLower.includes("security") || titleLower.includes("zero-leakage")) themeStr = "scanner";
                      if (titleLower.includes("agent") || titleLower.includes("llm") || titleLower.includes("orchestration") || titleLower.includes("control")) themeStr = "matrix";

                      return (
                        <div className="w-full mt-6 relative overflow-hidden group/hud">
                          {themeStr === "blueprint" && (
                            <div className="relative w-full border-2 border-[#0055ff] bg-[#001133] p-1">
                              {/* Blueprint overlays */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,85,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,85,255,0.2)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-10" />
                              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00aaff] z-20" />
                              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00aaff] z-20" />
                              <div className="absolute top-2 left-3 z-20 font-mono text-[9px] text-[#00aaff] uppercase tracking-widest font-bold bg-[#001133]/80 px-1">
                                SYS.ARCH // SCHEMATIC VIEW
                              </div>
                              <div className="relative w-full h-full bg-black">
                                <img src={log.image} alt={log.title} className="w-full object-contain relative z-0 grayscale contrast-125 opacity-80" />
                                <div className="absolute inset-0 mix-blend-color opacity-90 pointer-events-none" style={{ background: 'linear-gradient(to top right, black, #0055ff 60%, transparent)' }} />
                                <div className="absolute inset-0 mix-blend-overlay opacity-50 pointer-events-none bg-[#0055ff]" />
                              </div>
                            </div>
                          )}

                          {themeStr === "scanner" && (
                            <div className="relative w-full border-2 border-red-600 bg-[#220000] p-1">
                              {/* Scanner overlays */}
                              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.1)_2px,rgba(255,0,0,0.1)_4px)] pointer-events-none z-10" />
                              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500/50 shadow-[0_0_10px_red] z-20 animate-pulse" />
                              <div className="absolute top-2 right-3 z-20 font-mono text-[9px] text-red-500 uppercase tracking-widest font-bold flex items-center gap-1 bg-[#220000]/80 px-1 border border-red-500/30">
                                <Activity className="w-3 h-3" /> THREAT_ANALYSIS
                              </div>
                              <div className="relative w-full h-full bg-black">
                                <img src={log.image} alt={log.title} className="w-full object-contain relative z-0 grayscale contrast-125 opacity-90" />
                                <div className="absolute inset-0 mix-blend-color opacity-90 pointer-events-none" style={{ background: 'linear-gradient(to top right, black, #dc2626 60%, transparent)' }} />
                                <div className="absolute inset-0 mix-blend-overlay opacity-50 pointer-events-none bg-red-600" />
                              </div>
                            </div>
                          )}

                          {themeStr === "matrix" && (
                            <div className="relative w-full border-2 border-[#00ff41] bg-black p-1">
                              {/* Matrix overlays */}
                              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.15)_0%,transparent_100%)] pointer-events-none z-10" />
                              <div className="absolute bottom-2 left-3 z-20 font-mono text-[9px] text-[#00ff41] uppercase tracking-widest font-bold bg-black/80 px-1">
                                [ NEURAL_NODE_ACTIVE ]
                              </div>
                              <div className="relative w-full h-full bg-black">
                                <img src={log.image} alt={log.title} className="w-full object-contain relative z-0 grayscale contrast-125 opacity-90" />
                                <div className="absolute inset-0 mix-blend-color opacity-90 pointer-events-none" style={{ background: 'linear-gradient(to top right, black, #00ff41 60%, transparent)' }} />
                                <div className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none bg-[#00ff41]" />
                              </div>
                            </div>
                          )}

                          {themeStr === "default" && (
                            <div className="w-full border-2 border-black bg-[#e5e5e5] p-1 relative">
                              <div className="absolute top-2 right-2 bg-black text-white font-mono text-[9px] uppercase px-1 z-10">IMG_RAW</div>
                              <img src={log.image} alt={log.title} className="w-full object-contain relative z-0 grayscale contrast-125 group-hover/hud:grayscale-0 transition-all duration-500" />
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {logs.length === 0 && !isLoading && (
            <div className="text-center p-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black uppercase mb-4 text-black">[ SYSTEM STATUS: INDEXING LOGS ]</h3>
              <p className="font-mono text-sm text-black/70 mb-8 max-w-md mx-auto">
                Engineering logs are currently being compiled and will be published shortly.
              </p>
            </div>
          )}
        </div>

        {/* LEAD MAGNET */}
        <div className="border-t-4 border-black pt-16">
          <LeadMagnetGate />
        </div>

      </div>
    </main>
  );
}
