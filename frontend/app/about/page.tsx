"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";

export default function AboutPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4">
          Our <span className="text-zinc-500">Origin</span>
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
          We are building the future of decentralized engineering. 
          The About page is currently under construction.
        </p>
      </motion.div>
    </main>
  );
}