"use client";

import React, { useState, JSX } from "react";
import { motion } from "framer-motion";
/* 1. IMPORT LENIS */
import { ReactLenis } from "@studio-freight/react-lenis";
import { 
  CheckCircle, Loader2, Calendar, Clock
} from "lucide-react";

/* CORE COMPONENTS */
import FloatingNavbar from "@/components/Navbar";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";

// Configuration
const BACKEND_URL = "https://your-backend-api.com/inquiry"; 

export default function ServicesPage(): JSX.Element {
  return (
    /* 2. WRAP WITH REACTLENIS */
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <main className="relative min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
        <SmokeBackground />
        
        <div className="relative z-10">
          <FloatingNavbar />
          <OrbitChat />

          {/* HERO & OTHER SECTIONS GO HERE */}
          <section className="pt-32 px-6 text-center">
             <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">
                Our <span className="text-zinc-600">Capabilities.</span>
             </h1>
          </section>

          <InquirySection />

          <footer className="py-12 text-center border-t border-white/5 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.5em]">
            © 2026 IT FARM GLOBAL DELIVERY NETWORK.
          </footer>
        </div>
      </main>
    </ReactLenis>
  );
}

/* --- INQUIRY SECTION --- */

function InquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Transmission failed. Please verify connection.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Initialize Project</h2>
          <p className="text-zinc-400 font-light">Schedule a briefing with our architecture team.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[2.5rem] space-y-8 shadow-2xl"
        >
          {!isSuccess ? (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <InputGroup label="Name" name="name" placeholder="John Doe" type="text" required />
                <InputGroup label="Company" name="company" placeholder="Acme Inc." type="text" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <InputGroup label="Email" name="email" placeholder="john@acme.com" type="email" required />
                <InputGroup label="Budget" name="budget" placeholder="₹20k — ₹1L+" type="text" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Scheduling Protocol</label>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <Calendar className="absolute left-0 bottom-3 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="date" 
                      name="date" 
                      required
                      className="w-full bg-transparent border-b border-white/20 py-2 pl-7 text-white focus:outline-none focus:border-blue-500 transition-colors uppercase text-xs font-mono [color-scheme:dark]"
                    />
                  </div>
                  <div className="relative group">
                    <Clock className="absolute left-0 bottom-3 w-4 h-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="time" 
                      name="time" 
                      required
                      className="w-full bg-transparent border-b border-white/20 py-2 pl-7 text-white focus:outline-none focus:border-blue-500 transition-colors uppercase text-xs font-mono [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Service Required</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Software", "AI/ML", "SaaS", "Security", "Design", "Other"].map((opt) => (
                    <label key={opt} className="cursor-pointer group">
                      <input type="radio" name="service" value={opt} className="peer sr-only" required />
                      <div className="px-4 py-3 rounded-xl bg-black border border-white/10 text-zinc-400 text-sm text-center peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-500 transition-all group-hover:border-white/30">
                        {opt}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Mission Brief</label>
                <textarea 
                  name="message"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors resize-none h-24 text-sm"
                  placeholder="Tell us about your mission..."
                />
              </div>

              {error && <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest">{error}</p>}

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-8 active:scale-95 rounded-2xl shadow-xl"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Briefing"}
              </button>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 uppercase italic tracking-tighter">Transmission Successful</h3>
              <p className="text-zinc-400 text-sm font-light">Our commanders have received your mission brief. Expect a response shortly.</p>
              <button onClick={() => setIsSuccess(false)} className="mt-8 text-[10px] text-zinc-600 hover:text-blue-500 transition-colors uppercase font-mono tracking-widest underline underline-offset-4">Send New Brief</button>
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function InputGroup({ label, placeholder, type, name, required }: any) {
  return (
    <div className="flex flex-col gap-2 relative group">
      <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 group-focus-within:text-blue-500 transition-colors">{label}</label>
      <input 
        name={name}
        type={type} 
        required={required}
        placeholder={placeholder}
        className="bg-transparent border-b border-white/20 py-2 text-white placeholder:text-zinc-800 focus:outline-none focus:border-blue-500 transition-colors w-full text-sm font-light"
      />
    </div>
  );
}