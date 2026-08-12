"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import TerminalEstimator from "@/components/sections/TerminalEstimator";
import CustomBookingForm from "@/components/sections/CustomBookingForm";

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative flex flex-col w-full overflow-hidden">
      
      {/* SECTION 1: CALENDAR (DARK SPLIT) */}
      <section className="relative w-full min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 flex flex-col items-center">
        <div className="absolute inset-0 grid-background opacity-20 pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center mb-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-[#ff6b00] text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mx-auto mb-6">
            SECURE COMM CHANNEL
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6">
            BOOK A <br /><span className="text-[#ff6b00]">TECHNICAL STRATEGY CALL.</span>
          </h1>
          <p className="text-white/60 font-mono text-sm max-w-lg mx-auto">
            Discuss your architecture, technical constraints, and engineering requirements directly with a core engineer.
          </p>
        </motion.div>

        {/* CUSTOM BOOKING FORM (REPLACED CAL.COM) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl mx-auto"
        >
          {mounted && <CustomBookingForm />}
        </motion.div>
        </div>
      </section>

      {/* SECTION 2: ESTIMATOR (LIGHT SPLIT) */}
      <section id="estimator" className="relative w-full bg-[#e5e5e5] text-black py-24 flex flex-col items-center justify-center border-t border-black">
        <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />
        
        <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-black mb-4">
              PROJECT <span className="text-[#ff6b00]">ESTIMATOR.</span>
            </h2>
            <p className="text-black/70 font-mono text-sm max-w-lg mx-auto">
              Skip the discovery call. Input your parameters and generate a baseline architectural scope instantly.
            </p>
          </div>
          
          <TerminalEstimator />
        </div>
      </section>
    </main>
  );
}
