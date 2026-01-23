"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Send, Terminal, Activity, Bot, Command, Cpu, ShieldCheck, Zap } from "lucide-react";

type Role = 'system' | 'user' | 'assistant';
interface Message {
  id: string;
  role: Role;
  content: string;
}

export default function OrbitChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([{
    id: 'init',
    role: 'assistant',
    content: "ORBIT CORE ONLINE. Biometric uplink verified. State objective."
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // High-performance Spring physics (No lag)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only tilt on desktop to save mobile battery/CPU
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setHistory(prev => [...prev, { id: Math.random().toString(), role: 'user', content: inputValue }]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            layoutId="orbit-container" 
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transform-gpu"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/40 rounded-full" 
              />
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-black border border-blue-500/60 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] backdrop-blur-xl">
                <Bot className="w-7 h-7 md:w-8 md:h-8 text-blue-400" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="orbit-container"
            onMouseMove={handleMouseMove}
            style={{ 
              rotateX, 
              rotateY, 
              perspective: 1000,
              transformStyle: "preserve-3d"
            }}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            className="fixed bottom-6 right-6 w-[85vw] md:w-[400px] h-[500px] md:h-[600px] bg-zinc-950/90 border border-white/20 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-[9999] flex flex-col overflow-hidden ring-1 ring-blue-500/30 transform-gpu will-change-transform"
          >
            {/* SCANNING ANIMATION (Hardware Accelerated) */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] opacity-20" />
               <motion.div 
                 animate={{ y: [-20, 600] }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-full h-1 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] transform-gpu" 
               />
            </div>

            {/* HEADER */}
            <div className="relative p-5 border-b border-white/10 bg-white/5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] md:text-xs font-bold text-white tracking-[0.2em] uppercase">Orbit // Live</h3>
                  <p className="text-[8px] font-mono text-blue-500/60 uppercase">Uplink Stable</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FEED */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.05),transparent)]">
              {history.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`relative p-4 rounded-2xl font-mono text-[11px] md:text-sm leading-relaxed transform-gpu ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white shadow-lg border border-blue-400/30' 
                      : 'bg-white/5 border border-white/10 text-zinc-200'
                    }`}>
                      {msg.role === 'assistant' && <span className="text-blue-400 mr-2 animate-pulse">{">"}</span>}
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px] p-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse">ANALYZING...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-6 bg-zinc-900/50 border-t border-white/5 backdrop-blur-3xl">
              <form onSubmit={handleCommand} className="relative group">
                <div className="relative flex items-center bg-black border border-white/20 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all shadow-inner">
                  <div className="pl-4"><Terminal className="w-4 h-4 text-blue-500" /></div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Command..."
                    className="flex-1 bg-transparent py-4 px-3 text-sm font-mono text-white outline-none placeholder:text-zinc-800"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit" 
                    className="pr-4 text-blue-500 hover:text-white transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
              <div className="mt-4 flex justify-between items-center px-1 opacity-30">
                 <div className="flex gap-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <Zap className="w-3.5 h-3.5 text-zinc-400" />
                 </div>
                 <span className="text-[8px] font-mono text-zinc-600 uppercase">V4-Quantum</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}