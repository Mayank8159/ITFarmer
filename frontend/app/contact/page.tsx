"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export default function ContactPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#020202] text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:30px_30px] pointer-events-none" />
      
      <div className="max-w-4xl w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Systems Operational</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-12">
          Initiate <span className="text-blue-500">Contact.</span>
        </h1>

        <div className="p-1 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent">
          <div className="bg-zinc-950 rounded-[2.9rem] p-12">
            <p className="text-zinc-400 text-lg mb-8 font-light">Ready to deploy your elite engineering squad?</p>
            <a 
              href="mailto:hello@itfarmer.co" 
              className="flex items-center justify-between bg-white text-black p-6 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
            >
              <span>hello@itfarmer.co</span>
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}