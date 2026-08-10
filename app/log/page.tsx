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

  const logs = posts.filter(p => p.category === "Post");

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
                    {log.image && (
                      <div className="w-full border-2 border-black mt-6">
                         <img src={log.image} alt={log.title} className="w-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {logs.length === 0 && (
            <div className="text-center p-12 border-4 border-black bg-white font-mono text-sm text-black/50 uppercase tracking-widest">
              [ NO INTEL LOGS FOUND IN DATABASE ]
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
