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
    content: "ORBIT CORE ONLINE. Biometric uplink verified. State your deployment objective for the IT Farm."
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Parallax Effect for the Panel
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
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
    // Backend simulation for now
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            layoutId="orbit-container"
            className="fixed bottom-12 right-12 z-9999"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-20 h-20 flex items-center justify-center"
            >
              {/* Spinning Neural Rings */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/40 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-dotted border-cyan-400/30 rounded-full" 
              />
              
              {/* The Core */}
              <div className="relative w-14 h-14 rounded-2xl bg-black border border-blue-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] backdrop-blur-xl overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-tr from-blue-600/20 to-transparent group-hover:opacity-100 transition-opacity" />
                <Bot className="w-8 h-8 text-blue-400 z-10" />
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" 
                />
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
            style={{ rotateX, rotateY, perspective: 1000 }}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            className="fixed bottom-10 right-10 w-[95vw] md:w-120 h-175 max-h-[85vh] bg-zinc-950/90 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl z-9999 flex flex-col overflow-hidden ring-1 ring-white/20"
          >
            {/* UI SCANLINES EFFECT */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_4px,3px_100%] z-50 opacity-20" />

            {/* HEADER: COMMAND CENTER STYLE */}
            <div className="relative p-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-white tracking-[0.3em] uppercase">Orbit // System</h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2">
                    <Activity className="w-3 h-3 text-green-500" /> Secure Uplink: Active
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MESSAGE FEED: SPATIAL INTERFACE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {history.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] group ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      {msg.role !== 'user' && <Command className="w-3 h-3 text-blue-400" />}
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                        {msg.role === 'user' ? 'Operative' : 'Orbit_Core'}
                      </span>
                    </div>
                    <div className={`relative p-5 rounded-2xl font-mono text-xs leading-relaxed transition-all ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]' 
                      : 'bg-white/3 border border-white/10 text-zinc-300 backdrop-blur-md'
                    }`}>
                      {msg.role === 'assistant' && <span className="text-blue-400 mr-2 animate-pulse">{">"}</span>}
                      {msg.content}
                      {/* Subtle Glass Glare */}
                      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-4 text-blue-500/50 font-mono text-[10px] p-2">
                  <div className="flex gap-1">
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-3 bg-blue-500" />
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-3 bg-blue-500" />
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-3 bg-blue-500" />
                  </div>
                  <span className="animate-pulse tracking-[0.2em]">ANALYZING DATA PACKETS...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT UNIT: NEON COMMAND LINE */}
            <div className="p-8 bg-zinc-900/50 border-t border-white/5 backdrop-blur-2xl">
              <form onSubmit={handleCommand} className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-black border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all">
                  <div className="pl-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-600" />
                  </div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Input mission parameter..."
                    className="flex-1 bg-transparent py-4 px-3 text-sm font-mono text-white outline-none placeholder:text-zinc-700"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim()} 
                    className="px-6 py-4 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-20 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Execute</span>
                  </button>
                </div>
              </form>
              <div className="mt-4 flex justify-between items-center px-2">
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 opacity-30">
                       <ShieldCheck className="w-3 h-3 text-zinc-400" />
                       <span className="text-[8px] font-mono text-zinc-400 uppercase">Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-30">
                       <Zap className="w-3 h-3 text-zinc-400" />
                       <span className="text-[8px] font-mono text-zinc-400 uppercase">Quantum-Link</span>
                    </div>
                 </div>
                 <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">V4.02-ORBIT</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}