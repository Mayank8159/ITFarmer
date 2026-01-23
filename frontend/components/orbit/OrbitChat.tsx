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
    content: "ORBIT CORE ONLINE. Biometric uplink verified. State your deployment objective."
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect mobile to disable laggy features
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax Effect - Optimized with Spring for no lag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return; // Disable 3D tilt on mobile to prevent lag
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
              className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/40 rounded-full" 
              />
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-black border border-blue-500/60 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.6)] backdrop-blur-xl">
                <Bot className="w-6 h-6 md:w-8 md:h-8 text-blue-400 z-10" />
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
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[440px] h-[85vh] md:h-[620px] bg-zinc-950/95 border-t md:border border-white/20 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-3xl z-[9999] flex flex-col overflow-hidden ring-2 ring-blue-500/10"
          >
            {/* HOLOGRAPHIC OVERLAY - Only enabled on Desktop to fix lag */}
            {!isMobile && (
              <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_3px,2px_100%] opacity-20" />
                <motion.div 
                  animate={{ y: [-20, 620] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-full h-[2px] bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                />
              </div>
            )}

            {/* HEADER */}
            <div className="relative p-5 md:p-6 border-b border-white/10 bg-white/5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Cpu className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] md:text-xs font-bold text-white tracking-[0.2em] md:tracking-[0.3em] uppercase">Orbit // Live_Core</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span className="text-[8px] md:text-[10px] font-mono text-blue-500/70 uppercase tracking-widest">Uplink: Stable</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-zinc-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FEED */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 md:space-y-8 scrollbar-hide bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent)]">
              {history.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] md:max-w-[88%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1.5 opacity-40">
                      {msg.role !== 'user' && <Command className="w-3 h-3 text-blue-400" />}
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                        {msg.role === 'user' ? 'Operator' : 'System_OS'}
                      </span>
                    </div>
                    <div className={`relative p-4 md:p-5 rounded-2xl font-mono text-xs md:text-sm leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white shadow-lg border border-blue-400/30' 
                      : 'bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-md shadow-xl'
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
                  <span className="animate-pulse tracking-[0.2em]">ANALYZING...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT UNIT */}
            <div className="p-6 md:p-8 bg-zinc-900/80 border-t border-white/10 backdrop-blur-2xl pb-10 md:pb-8">
              <form onSubmit={handleCommand} className="relative group">
                <div className="relative flex items-center bg-black border border-white/20 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <div className="pl-4"><Terminal className="w-4 h-4 text-blue-500" /></div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter command objective..."
                    className="flex-1 bg-transparent py-4 md:py-5 px-4 text-sm font-mono text-white outline-none placeholder:text-zinc-800"
                    disabled={isTyping}
                  />
                  <button type="submit" className="pr-4 text-blue-500 hover:text-white transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
              <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 px-2 opacity-50 md:opacity-100">
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                       <ShieldCheck className="w-3.5 h-3.5 text-blue-500/50" />
                       <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Zap className="w-3.5 h-3.5 text-blue-500/50" />
                       <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Priority</span>
                    </div>
                 </div>
                 <span className="text-[8px] font-mono text-zinc-700 uppercase">Session: V4.02-ORBIT</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}