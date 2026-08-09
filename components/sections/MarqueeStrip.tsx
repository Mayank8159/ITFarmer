"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Terminal, ShieldCheck, Database, Cpu, Globe, Lock, Server, Activity, Network } from "lucide-react";

const PRIMARY_ITEMS = [
  { text: "AUTONOMOUS SWARMS", icon: <Cpu className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "LOW-LATENCY INFERENCE", icon: <Zap className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "1024-NODE CLUSTERS", icon: <Database className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "ZERO-TRUST SECURITY", icon: <ShieldCheck className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "NEURAL DEPLOYMENT", icon: <Terminal className="w-6 h-6 text-[#ff6b00]" /> },
];

const SECONDARY_ITEMS = [
  { text: "GLOBAL TELEMETRY", icon: <Globe className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "QUANTUM ENCRYPTION", icon: <Lock className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "DYNAMIC LOAD BALANCING", icon: <Network className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "EDGE COMPUTE", icon: <Server className="w-6 h-6 text-[#ff6b00]" /> },
  { text: "99.99% UPTIME", icon: <Activity className="w-6 h-6 text-[#ff6b00]" /> },
];

export default function MarqueeStrip({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  const baseItems = variant === "primary" ? PRIMARY_ITEMS : SECONDARY_ITEMS;
  
  // Duplicate items to ensure smooth infinite scrolling
  const SCROLL_ITEMS = [...baseItems, ...baseItems, ...baseItems, ...baseItems];

  return (
    <div className="w-full bg-black py-6 border-y-4 border-[#ff6b00] overflow-hidden flex relative z-10">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          repeat: Infinity, 
          duration: 20, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap items-center w-max"
      >
        {SCROLL_ITEMS.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 mx-8">
            {item.icon}
            <span className="text-white font-black text-3xl md:text-5xl uppercase tracking-tighter mix-blend-exclusion">
              {item.text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
