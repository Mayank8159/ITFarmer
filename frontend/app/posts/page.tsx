"use client";

import React, { useState, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
/* 1. IMPORT LENIS */
import { ReactLenis } from "@studio-freight/react-lenis";
import { 
  LayoutGrid, 
  Users, 
  Zap, 
  ArrowUpRight, 
} from "lucide-react";

/* COMPONENTS */
import SmokeBackground from "@/components/SmokeBackground";
import FloatingNavbar from "@/components/Navbar";

// Mock Data
const UPDATES_DATA = [
  {
    id: 1,
    category: "project",
    title: "Nebula AI Infrastructure",
    description: "Successfully deployed a high-concurrency LLM processing engine for a fintech startup. Achieved 40% reduction in latency.",
    date: "JAN 20, 2026",
    tags: ["Next.js", "Python", "AWS"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
    link: "#"
  },
  {
    id: 2,
    category: "team",
    title: "New Talent: Senior DevOps",
    description: "Welcome Elena Rodriguez to the Farm. Elena brings 8 years of experience in military-grade security protocols and Kubernetes scaling.",
    date: "JAN 15, 2026",
    role: "DevOps Architecture",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: 3,
    category: "update",
    title: "System v2.4 Patch Notes",
    description: "Optimized our QA pipeline. Automated testing now covers 98% of edge cases in production-ready builds.",
    date: "JAN 10, 2026",
    tags: ["Internal OS", "QA", "Automation"],
  }
];

export default function UpdatesPage(): JSX.Element {
  const [filter, setFilter] = useState<string>("all");

  const filteredUpdates = filter === "all" 
    ? UPDATES_DATA 
    : UPDATES_DATA.filter(u => u.category === filter);

  return (
    /* 2. WRAP WITH REACTLENIS */
    /* We use lerp 0.1 for a high-end weighty feel */
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <main className="relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* BACKGROUND LAYER */}
        <SmokeBackground />
        
        <FloatingNavbar />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-32">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4 block"
              >
                System Feed
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter"
              >
                Latest <span className="text-zinc-500">Updates</span>
              </motion.h1>
            </div>

            {/* FILTER PILLS */}
            <div className="flex flex-wrap gap-2">
              {["all", "project", "team", "update"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all
                    ${filter === cat 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FEED GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredUpdates.map((item, idx) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative flex flex-col bg-zinc-950/50 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl hover:border-blue-500/50 transition-colors"
                >
                  {/* IMAGE AREA */}
                  {item.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={item.image} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                        alt={item.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* CONTENT AREA */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-2 text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                        {item.category === "project" && <LayoutGrid className="w-3 h-3" />}
                        {item.category === "team" && <Users className="w-3 h-3" />}
                        {item.category === "update" && <Zap className="w-3 h-3" />}
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                      {item.description}
                    </p>

                    {/* FOOTER */}
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-2">
                        {item.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] bg-white/5 px-2 py-1 rounded text-zinc-500">#{tag}</span>
                        ))}
                        {item.role && <span className="text-[9px] text-blue-500 uppercase font-bold tracking-tighter">{item.role}</span>}
                      </div>
                      {item.category === "project" && (
                        <button className="p-2 bg-white/5 rounded-full hover:bg-white text-zinc-400 hover:text-black transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <footer className="py-10 text-center border-t border-white/5 text-[9px] font-mono text-zinc-600 uppercase tracking-widest relative z-10">
          © 2026 IT FARM GLOBAL DELIVERY NETWORK.
        </footer>
      </main>
    </ReactLenis>
  );
}