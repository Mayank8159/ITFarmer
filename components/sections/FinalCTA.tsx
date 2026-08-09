"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import Hero3DModel from "@/components/hero/Hero3DModel";

export default function FinalCTA() {
  return (
    <section className="relative w-full py-40 bg-[#f0f0f0] overflow-hidden flex items-center justify-center text-center z-10 border-b border-black">
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none" />

      {/* Grid Decorations */}
      <div className="absolute top-10 left-10 w-4 h-4 border-2 border-black bg-white" />
      <div className="absolute top-10 right-10 w-4 h-4 border-2 border-black bg-white" />
      <div className="absolute bottom-10 left-10 w-4 h-4 border-2 border-black bg-white" />
      <div className="absolute bottom-10 right-10 w-4 h-4 border-2 border-black bg-white" />
      
      {/* Crosshairs */}
      <div className="absolute top-1/2 left-20 w-8 h-8 flex items-center justify-center opacity-50">
        <div className="w-full h-0.5 bg-black absolute" />
        <div className="w-0.5 h-full bg-black absolute" />
      </div>
      <div className="absolute top-1/2 right-20 w-8 h-8 flex items-center justify-center opacity-50">
        <div className="w-full h-0.5 bg-black absolute" />
        <div className="w-0.5 h-full bg-black absolute" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-4xl px-6 flex flex-col items-center bg-white p-16 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Decorative corner blocks for the card itself */}
        <div className="absolute top-0 left-0 w-8 h-8 border-r-4 border-b-4 border-black" />
        <div className="absolute top-0 right-0 w-8 h-8 border-l-4 border-b-4 border-black" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-r-4 border-t-4 border-black" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-l-4 border-t-4 border-black" />

        {/* 3D Model embedded in CTA */}
        <div className="w-32 h-32 mb-8 bg-[#e5e5e5] border-2 border-black relative overflow-hidden flex items-center justify-center">
           <Hero3DModel />
        </div>

        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-8 uppercase leading-[0.9]">
          FORGE WHAT COMES <span className="text-[#ff6b00]">NEXT.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-black/70 font-mono max-w-2xl mb-12">
          Deploy autonomous agents, scale your inference pipelines, and build the next generation of AI applications on our high-performance infrastructure.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full">
          <Link 
            href="/services" 
            className="w-full sm:w-auto px-10 py-5 bg-[#ff6b00] text-white font-mono text-sm uppercase tracking-widest border-2 border-black hover:bg-black transition-colors flex items-center justify-center gap-3 font-bold"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Neural Forge</span>
          </Link>

          <Link
            href="/posts"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-black text-black font-mono text-sm uppercase tracking-widest hover:bg-[#e5e5e5] transition-colors font-bold group"
          >
            View Documentation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}