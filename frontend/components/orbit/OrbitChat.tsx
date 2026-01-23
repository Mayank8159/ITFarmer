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
  const [isMobile, setIsMobile] = useState(false);
  const [history, setHistory] = useState<Message[]>([{
    id: 'init',
    role: 'assistant',
    content: "ORBIT CORE ONLINE. Biometric uplink verified. State objective."
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Performance optimized spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return; 
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
          <motion.div layoutId="orbit-container" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9999]">
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-14 h-14 md:w-20 md:h-20 flex items-center justify-center transform-gpu"
            >
              <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-blue-500/30 rounded-full" 
              />
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-zinc-900 border border-blue-500/40 flex items-center justify-center shadow-xl backdrop-blur-md">
                <Bot className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
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
              rotateX: isMobile ? 0 : rotateX, 
              rotateY: isMobile ? 0 : rotateY, 
              perspective: 1000 
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed z-[9999] flex flex-col overflow-hidden transform-gpu bg-zinc-950/95 border border-white/10 shadow-2xl backdrop-blur-xl ring-1 ring-blue-500/20
              ${isMobile 
                ? "bottom-4 right-4 left-4 h-[60vh] rounded-[2rem]" // Mobile: Floating Mini-Panel
                : "bottom-8 right-8 w-[400px] h-[600px] rounded-[2.5rem]" // Desktop: Classic Size
              }`}
          >
            {/* SCANNING LINE - Optimized to avoid lag */}
            {!isMobile && (
              <motion.div 
                animate={{ y: [-20, 600] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-[1px] bg-blue-500/10 z-50 pointer-events-none" 
              />
            )}

            {/* HEADER */}
            <div className="relative p-4 md:p-6 border-b border-white/5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">Orbit // Live</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Secure</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* FEED */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
              {history.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`p-4 rounded-2xl font-mono text-[11px] md:text-sm leading-relaxed transform-gpu ${
                      msg.role === 'user' 
                      ? "bg-blue-600 text-white shadow-lg border border-blue-400/30" 
                      : "bg-white/5 border border-white/10 text-zinc-200"
                    }`}>
                      {msg.role === 'assistant' && <span className="text-blue-400 mr-2">{">"}</span>}
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-blue-500/50 font-mono text-[10px] p-2">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>SYNCING...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT UNIT */}
            <div className="p-4 md:p-6 bg-black/40 border-t border-white/5">
              <form onSubmit={handleCommand} className="relative group">
                <div className="relative flex items-center bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all">
                  <div className="pl-3"><Terminal className="w-3 h-3 text-blue-500" /></div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter command..."
                    className="flex-1 bg-transparent py-3 md:py-4 px-3 text-xs md:text-sm font-mono text-white outline-none placeholder:text-zinc-700"
                  />
                  <button type="submit" className="pr-3 text-blue-500 hover:text-white transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
              <div className="mt-3 flex justify-between items-center px-1 opacity-40">
                 <div className="flex gap-3">
                    <ShieldCheck className="w-3 h-3 text-blue-500" />
                    <Zap className="w-3 h-3 text-blue-400" />
                 </div>
                 <span className="text-[7px] md:text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Quantum Link: V4</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}