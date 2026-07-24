"use client";

import { motion } from "framer-motion";
import { Brain, Network, Code, Server, Smartphone, Database } from "lucide-react";

const CAPABILITIES = [
  { icon: Brain, title: "Artificial Intelligence", desc: "Predictive modeling, NLP, and Agentic workflows." },
  { icon: Network, title: "System Design", desc: "Highly scalable, fault-tolerant distributed architectures." },
  { icon: Code, title: "Code Quality", desc: "Rigorous standards, peer reviews, and clean architectures." },
  { icon: Server, title: "Cloud Infrastructure", desc: "Multi-cloud deployments with zero-downtime clustering." },
  { icon: Smartphone, title: "Edge & Mobile", desc: "High-performance applications running on constrained devices." },
  { icon: Database, title: "Data Pipelines", desc: "Real-time stream processing and massive data lakes." },
];

export default function VersatilityGraph() {
  return (
    <div className="w-full max-w-[1200px] mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[#FFD700] font-mono text-xs uppercase tracking-[0.4em] mb-4"
        >
          Unbounded Capability
        </motion.h2>
        <motion.h3 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 text-white font-serif"
        >
          The Versatility <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Matrix.</span>
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-[#E5E4E2]/80 font-light leading-relaxed max-w-2xl mx-auto text-base md:text-lg"
        >
          We are not bound by platforms or languages. Our expertise lies in universal principles of <strong className="text-white">AI integration</strong>, <strong className="text-white">advanced system design</strong>, and <strong className="text-white">uncompromising code quality</strong>. If it can be architected, we can build it.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {CAPABILITIES.map((cap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-[#0a0e27]/40 border border-white/5 rounded-3xl p-8 hover:border-[#FFD700]/30 transition-all duration-500 overflow-hidden backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#020202]/80 border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#FFD700]/50 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all">
                <cap.icon className="w-6 h-6 text-zinc-400 group-hover:text-[#FFD700] transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD700] transition-colors">{cap.title}</h4>
              <p className="text-[#E5E4E2]/60 text-sm leading-relaxed">{cap.desc}</p>
            </div>
            
            {/* Decorative background grid in each card */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] opacity-20 group-hover:opacity-50 transition-opacity transform rotate-12 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
