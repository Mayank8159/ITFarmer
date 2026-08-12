"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Check, ArrowRight } from "lucide-react";
import { submitInquiry } from "@/app/actions/adminActions";

export default function LeadMagnetGate() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const result = await submitInquiry({
        name: "Lead Magnet Download",
        email: email,
        company: "N/A",
        service: "Blueprint Download",
        budget: "-",
        message: "User downloaded the AI Prototype Blueprint.",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      if (result.success) {
        setStatus("success");
        // Trigger download programmatically
        if (downloadLinkRef.current) {
          downloadLinkRef.current.click();
        }
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      // Fallback
      alert("Error processing request. Please try again or contact services@neuralforgehub.tech");
      setStatus("idle");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black border-4 border-[#ff6b00] p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-white flex flex-col md:flex-row gap-12 items-center">
      
      <div className="flex-1">
        <div className="bg-[#ff6b00] text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-4">
          FREE ENGINEERING BLUEPRINT
        </div>
        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-white">
          5 SIGNS YOUR AI PROTOTYPE WON'T SURVIVE <span className="text-[#ff6b00]">PRODUCTION.</span>
        </h3>
        <p className="font-mono text-sm text-white/70">
          We've rescued dozens of AI architectures. Learn the critical failure points before you scale. Drop your email to download the raw blueprint immediately.
        </p>
      </div>

      <div className="w-full md:w-[350px] shrink-0 bg-[#1a1a1a] p-6 border-2 border-white/10 relative overflow-hidden">
        {/* Hidden bot check & download link */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
        {/* Note: In a real environment, you'd place the actual PDF in public/assets/blueprint.pdf */}
        <a ref={downloadLinkRef} href="/assets/blueprint.pdf" download="NeuralForge_Blueprint.pdf" className="hidden">Download</a>
        
        {status === "idle" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff6b00]">WORK EMAIL</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              className="bg-black border border-white/20 text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#ff6b00] transition-colors"
            />
            <button 
              type="submit"
              className="w-full bg-white text-black font-black uppercase tracking-widest text-sm py-4 mt-2 hover:bg-[#ff6b00] transition-colors flex items-center justify-center gap-2 border-2 border-transparent hover:border-black"
            >
              DOWNLOAD NOW <Download className="w-4 h-4" />
            </button>
          </form>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center h-[160px]">
            <Loader2 className="w-8 h-8 text-[#ff6b00] animate-spin mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">Processing Request...</p>
          </div>
        )}

        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-[160px] text-center"
          >
            <div className="w-12 h-12 bg-[#00ff41] text-black flex items-center justify-center rounded-full mb-4">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#00ff41] mb-2">DOWNLOAD INITIATED.</p>
            <p className="font-mono text-[10px] text-white/50">Check your device downloads.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
