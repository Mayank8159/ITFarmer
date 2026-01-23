"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Orbit, Lock, Mail, User, ArrowRight, Loader2, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";

/* --- GLOBAL COMPONENT IMPORTS --- */
import FloatingNavbar from "@/components/Navbar";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";

export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    const endpoint = isLogin ? "/token" : "/register";
    
    try {
      const body = isLogin 
        ? new URLSearchParams(payload as any) 
        : JSON.stringify(payload);

      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: isLogin ? {} : { "Content-Type": "application/json" },
        body: body,
      });

      if (res.ok) {
        const data = await res.json();
        login(data.access_token);
        window.location.href = "/";
      } else {
        const errData = await res.json();
        setError(errData.detail || "Authentication failed.");
      }
    } catch (err) {
      setError("Network error. Pulse check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center relative bg-[#020202] selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. ATMOSPHERIC LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SmokeBackground />
      </div>

      {/* 2. FIXED NAVIGATION */}
      <FloatingNavbar />

      {/* 3. DYNAMIC SPACER 
          This pushes the logo exactly 12rem (desktop) or 8rem (mobile) 
          away from the top edge, clearing the FloatingNavbar. 
      */}
      <div className="h-32 md:h-48 w-full flex-shrink-0" />

      {/* 4. MAIN AUTH CONTENT */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md px-6 relative z-10 flex flex-col items-center"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.7 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-6 cursor-pointer border border-white/20"
          >
             <Orbit className="w-10 h-10 text-black" strokeWidth={2.5} />
          </motion.div>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-tight">
              {isLogin ? "Entry Protocol" : "Initialize Identity"}
            </h1>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.5em]">
              IT FARM SECURE NODE 01
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="w-full relative group">
          {/* Rotating Border Glow */}
          <div className="absolute -inset-[1.5px] rounded-[2.6rem] overflow-hidden blur-[3px] opacity-20 group-hover:opacity-50 transition-opacity">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_180deg,#d946ef_270deg,transparent_360deg)]"
            />
          </div>

          <div className="relative bg-zinc-950/80 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Full Name</label>
                    <div className="relative group/input">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" />
                      <input 
                        name="full_name" 
                        type="text" 
                        required 
                        placeholder="Identification" 
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Access Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" />
                  <input name="username" type="email" required placeholder="name@itfarm.io" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Security Cipher</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" />
                  <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-500 text-[10px] font-mono uppercase text-center tracking-tight">
                  {error}
                </motion.div>
              )}

              <button 
                disabled={isLoading}
                className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{isLogin ? "Establish Connection" : "Confirm Identity"} <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer"
              >
                {isLogin ? "Request Register Protocol" : "Return to Entry Login"}
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Details */}
        <div className="mt-12 mb-10 flex flex-col items-center gap-4 opacity-40">
           <div className="flex items-center gap-3 text-zinc-500">
             <ShieldCheck className="w-3.5 h-3.5" />
             <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Quantum-Resistant AES-256</span>
           </div>
           <div className="flex items-center gap-2 text-zinc-700">
             <Globe className="w-3 h-3" />
             <span className="text-[8px] font-mono uppercase tracking-[0.1em]">NODE: BENGALURU-SEC-01</span>
           </div>
        </div>
      </motion.div>

      {/* 5. CHATBOT (Always Top) */}
      <OrbitChat />
    </main>
  );
}