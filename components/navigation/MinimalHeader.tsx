"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function MinimalHeader() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-[#e5e5e5] border-b-2 border-black z-50 fixed top-0"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-white border border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-8 h-8 flex items-center justify-center relative overflow-hidden bg-black border border-black/20">
            <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-black text-sm tracking-tight uppercase leading-none">Neural Forge</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
