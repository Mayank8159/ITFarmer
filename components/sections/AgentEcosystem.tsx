"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BrutalistCard from "@/components/cards/BrutalistCard";
import { Terminal, Lock, Globe } from "lucide-react";

export default function AgentEcosystem() {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/ecosystemContent.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load ecosystem data:", err);
        setIsLoading(false);
      });
  }, []);

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "lock": return <Lock className="w-6 h-6 currentColor" />;
      case "globe": return <Globe className="w-6 h-6 currentColor" />;
      default: return <Terminal className="w-6 h-6 currentColor" />;
    }
  };

  return (
    <section id="agents" className="relative w-full py-32 bg-[#f0f0f0] border-b border-black">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-16 border-b border-black pb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b00] mb-4 block font-bold">SWARM INTELLIGENCE</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black uppercase max-w-3xl leading-[0.9]">
            AUTONOMOUS AGENT ECOSYSTEM.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!isLoading && agents.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <BrutalistCard className="h-full flex flex-col gap-6" whiteBg>
                <div className={`w-14 h-14 flex items-center justify-center ${item.accent}`}>
                  {getIcon(item.icon)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black uppercase mb-3">{item.title}</h3>
                  <p className="font-mono text-sm text-black/70 leading-relaxed border-l-2 border-black/20 pl-3">
                    {item.desc}
                  </p>
                </div>
              </BrutalistCard>
            </motion.div>
          ))}
        </div>

        {/* SWARM TELEMETRY EXPANSION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-[#111111] border-4 border-black p-1 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row h-[400px]"
        >
          {/* LEFT: Terminal Feed */}
          <div className="flex-1 border-r-2 border-black/30 p-6 flex flex-col font-mono relative z-10 bg-black/40">
            <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
              <div className="w-3 h-3 bg-[#00ff41] animate-pulse" />
              <span className="text-white text-sm font-bold tracking-widest uppercase">Live Swarm Telemetry</span>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              <motion.div 
                animate={{ y: ["0%", "-50%"] }} 
                transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                className="flex flex-col gap-3 text-[11px] text-[#00ff41]/80"
              >
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="opacity-50">[{
                      ["14:02:11", "14:02:12", "14:02:15", "14:02:18", "14:02:22"][i % 5]
                    }]</span>
                    <span className="text-white">SYS_OP:</span>
                    <span>{
                      ["Allocating neural resources...", 
                       "Scraping dynamic payload from endpoint...", 
                       "Compiling smart contract audit tree...", 
                       "Vector embedding generation complete.",
                       "Sub-agent #409 deployed to edge node."][i % 5]
                    }</span>
                  </div>
                ))}
              </motion.div>
              {/* Fade out bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111111] to-transparent" />
            </div>
          </div>

          {/* RIGHT: Agent Status Grid */}
          <div className="w-full md:w-96 p-6 flex flex-col bg-[#111111] z-10">
            <h4 className="text-white text-xs font-mono font-bold tracking-widest uppercase mb-6 opacity-70">
              Active Nodes
            </h4>
            <div className="grid grid-cols-2 gap-4 flex-1">
              {[
                { name: "Code_Gen_Alpha", load: "87%", status: "syncing" },
                { name: "Audit_Bot_V2", load: "42%", status: "idle" },
                { name: "OSINT_Scraper", load: "99%", status: "active" },
                { name: "Logic_Solver", load: "12%", status: "idle" },
              ].map((agent, i) => (
                <div key={i} className="border border-white/20 p-3 flex flex-col justify-between hover:bg-white/5 transition-colors cursor-crosshair">
                  <div className="text-[#00f0ff] font-mono text-[10px] truncate mb-2">{agent.name}</div>
                  <div className="flex justify-between items-end">
                    <span className="text-white font-black text-xl">{agent.load}</span>
                    <div className={`w-2 h-2 ${agent.status === 'active' || agent.status === 'syncing' ? 'bg-[#ff6b00] animate-pulse' : 'bg-white/30'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
        </motion.div>

      </div>
    </section>
  );
}