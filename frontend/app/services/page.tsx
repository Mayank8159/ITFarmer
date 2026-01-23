"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Code2, Cpu, Globe, Shield } from "lucide-react";

const SERVICE_LIST = [
  { title: "Software Foundry", desc: "Custom-built elite architectures.", icon: <Code2 /> },
  { title: "Neural Systems", desc: "Next-gen AI integration.", icon: <Cpu /> },
  { title: "Global Scale", desc: "Cloud infrastructure for icons.", icon: <Globe /> },
  { title: "Fortress Security", desc: "Military-grade audit protocols.", icon: <Shield /> },
];

export default function ServicesPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#020202] text-white py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-12"
        >
          Our <span className="text-zinc-600">Capabilities.</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_LIST.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/10 backdrop-blur-xl group hover:border-blue-500/50 transition-colors"
            >
              <div className="w-12 h-12 mb-6 text-blue-500">{service.icon}</div>
              <h3 className="text-3xl font-bold mb-4 uppercase italic">{service.title}</h3>
              <p className="text-zinc-400 font-light">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}