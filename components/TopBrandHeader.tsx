"use client";

import { useState } from "react";
import Link from "next/link";
import { Orbit, Shield, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBrandHeader() {
  const [copied, setCopied] = useState(false);
  const companyEmail = "team.techserve55@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(companyEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-[90] px-6 py-6 lg:px-12 lg:py-8 flex items-center justify-between pointer-events-none"
    >
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-4 pointer-events-auto group">
        <Link
          href="/"
          className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-[#FFD700] via-[#B8860B] to-[#DAA520] shadow-[0_0_30px_rgba(255,215,0,0.3)] border border-white/20 hover:scale-105 transition-transform"
        >
          <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,#FFD700_180deg,#B8860B_270deg,transparent_360deg)] animate-[spin_4s_linear_infinite] opacity-50" />
          <Orbit className="relative z-10 h-6 w-6 text-[#0a0e27]" strokeWidth={2.5} />
        </Link>
        <div className="hidden sm:flex flex-col opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          <span className="text-white font-serif italic font-black uppercase text-sm tracking-widest">IT_FARM</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#FFD700]">Remote Operating System</span>
        </div>
      </div>

      {/* Right: Contact Node */}
      <div className="pointer-events-auto flex items-center gap-4">
        <button 
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-5 py-2 rounded-full 
            border transition-all duration-300 group/contact backdrop-blur-md shadow-xl
            ${copied 
              ? "bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700]" 
              : "bg-black/30 border-white/10 text-zinc-400 hover:border-[#FFD700]/30 hover:bg-[#0a0e27]/60"
            }
          `}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div key="mail" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Shield className="w-4 h-4 text-zinc-500 group-hover/contact:text-[#FFD700] transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium hidden sm:inline-block">
            {copied ? "Copied!" : "COPY_CONTACT"}
          </span>
        </button>
      </div>
    </motion.header>
  );
}
