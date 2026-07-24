"use client";

import React, { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  LayoutGrid, 
  Users, 
  Zap, 
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import SmokeBackground from "@/components/SmokeBackground";
import TopBrandHeader from "@/components/TopBrandHeader";
import SideNav from "@/components/SideNav";

interface Update {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  tags?: string[];
  image?: string;
}

export default function UpdatesPage(): JSX.Element {
  const [filter, setFilter] = useState<string>("all");
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch from dynamic JSON CMS with cache busting
        const response = await fetch('/data/postsContent.json?t=' + Date.now());
        
        if (!response.ok) {
          throw new Error("Failed to fetch updates from CMS");
        }
        
        const data = await response.json();
        setUpdates(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to load updates:", err);
        setError(err.message || "Failed to load updates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Filter the data on the client side
  const filteredUpdates = filter === "all" 
    ? updates 
    : updates.filter(update => (update.category || "").toLowerCase() === filter.toLowerCase());

  return (
      <main className="relative min-h-screen bg-transparent text-[#E5E4E2] selection:bg-[#FFD700]/30 overflow-x-hidden">
        
        <SmokeBackground />
        
        <TopBrandHeader />
      <SideNav />

        {/* SUBTLE OVERLAY GRID */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-[#FFD700] font-mono text-xs uppercase tracking-[0.4em] mb-4 block"
              >
                System Feed
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter font-serif text-white"
              >
                Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Intel.</span>
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
                      ? "bg-white text-[#0a0e27] border-white" 
                      : "bg-white/5 border-white/10 text-[#E5E4E2]/50 hover:border-[#FFD700]/30 hover:text-[#FFD700]"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40"
            >
              <Loader2 className="w-12 h-12 animate-spin text-[#FFD700] mb-4" />
              <p className="text-[#E5E4E2]/50 font-mono text-[10px] uppercase tracking-widest">Loading system feed...</p>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {error && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-8 text-red-400 text-sm font-mono uppercase tracking-widest"
            >
              ⚠ {error}
            </motion.div>
          )}

          {/* FEED GRID */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredUpdates.length > 0 ? (
                  filteredUpdates.map((item, idx) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="group relative flex flex-col bg-[#020202]/60 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl hover:border-[#FFD700]/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                    >
                      {/* OPTIONAL COVER IMAGE */}
                      {item.image && (
                        <div className="relative w-full h-48 border-b border-white/5 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* CONTENT AREA */}
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <span className="flex items-center gap-2 text-[10px] font-mono text-[#FFD700] uppercase tracking-widest">
                            {(item.category || "").toLowerCase() === "project" && <LayoutGrid className="w-3 h-3" />}
                            {(item.category || "").toLowerCase() === "team" && <Users className="w-3 h-3" />}
                            {(item.category || "").toLowerCase() === "update" && <Zap className="w-3 h-3" />}
                            {item.category || "Uncategorized"}
                          </span>
                          <span className="text-[9px] font-mono text-[#E5E4E2]/40 uppercase tracking-widest">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#FFD700] transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-[#E5E4E2]/70 text-sm leading-relaxed mb-6 flex-1 font-light">
                          {item.description}
                        </p>

                        {/* FOOTER */}
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {item.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] bg-white/5 px-2 py-1 rounded text-[#E5E4E2]/50 font-mono">#{tag}</span>
                            ))}
                          </div>
                          {(item.category || "").toLowerCase() === "project" && (
                            <button className="p-2 bg-white/5 rounded-full hover:bg-[#FFD700]/20 text-[#E5E4E2]/50 hover:text-[#FFD700] transition-all">
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-[#E5E4E2]/40 font-mono text-[10px] uppercase tracking-[0.5em]">No updates found in this sector</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <footer className="py-10 text-center border-t border-white/5 text-[9px] font-mono text-[#E5E4E2]/40 uppercase tracking-widest relative z-10">
          © 2026 IT FARM GLOBAL DELIVERY NETWORK.
        </footer>
      </main>
  );
}