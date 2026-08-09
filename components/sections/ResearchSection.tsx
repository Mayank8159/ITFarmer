"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const RESEARCH_TOPICS = [
  {
    title: "AI RESEARCH",
    description: "Developing novel architectures for multi-modal reasoning and contextual awareness in autonomous systems.",
    date: "2026.Q3"
  },
  {
    title: "MODEL EXPERIMENTATION",
    description: "Evaluating open-weight LLMs in zero-shot environments across specialized enterprise domains.",
    date: "2026.Q3"
  },
  {
    title: "COMPUTE OPTIMIZATION",
    description: "Quantization strategies and hardware-specific compilation for sub-10ms inference latency.",
    date: "2026.Q4"
  },
  {
    title: "AGENT SYSTEMS",
    description: "Multi-agent swarm coordination protocols and verifiable trust frameworks.",
    date: "2026.Q4"
  }
];

export default function ResearchSection() {
  return (
    <section className="relative w-full py-32 bg-[#e5e5e5] z-10 border-b border-black">
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Editorial Header */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-32"
          >
            <div className="border border-black px-3 py-1 mb-6 bg-white inline-flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">R&D LABORATORY</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif tracking-tighter text-black mb-6 leading-[0.9] uppercase font-black">
              Pushing the boundaries of <span className="text-[#ff6b00]">applied AI.</span>
            </h2>
            <p className="text-black/70 font-mono text-sm leading-relaxed mb-8 border-l-4 border-black pl-4">
              Neural Forge Hub maintains an active research division focused on bridging the gap between theoretical AI models and production-ready infrastructure.
            </p>
            <Link 
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-[#ff6b00] transition-colors group"
            >
              Read Publications 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Research Cards */}
        <div className="lg:col-span-7 flex flex-col">
          {RESEARCH_TOPICS.map((topic, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group border-t border-black py-8 cursor-pointer hover:bg-white transition-colors duration-300 px-6 -mx-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-2xl font-black uppercase text-black group-hover:text-[#ff6b00] transition-colors tracking-tight">
                  {topic.title}
                </h3>
                <span className="font-mono text-xs text-black/50 font-bold px-2 py-1 border border-black/10 bg-[#f0f0f0]">{topic.date}</span>
              </div>
              <p className="text-black/70 font-mono text-sm leading-relaxed max-w-xl">
                {topic.description}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-black w-full" />
        </div>

      </div>
    </section>
  );
}