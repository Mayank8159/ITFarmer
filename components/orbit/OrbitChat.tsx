"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Send, Terminal, Activity, Bot, Cpu, ShieldCheck, Zap } from "lucide-react";

type Role = "system" | "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

export default function OrbitChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([
    { id: "init", role: "assistant", content: "ORBIT CORE ONLINE. Biometric uplink verified. State objective." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Motion values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return; // Skip tilt on mobile
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  // Send message and call backend
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Math.random().toString(), role: "user", content: inputValue };
    setHistory((prev) => [...prev, userMessage]);

    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue })
      });

      const data = await res.json();
      const botMessage: Message = { id: Math.random().toString(), role: "assistant", content: data.reply };
      setHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: "Error: could not connect to server."
      };
      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Minimized button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div layoutId="orbit-container" className="fixed bottom-6 right-6 z-[9999]">
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transform-gpu group"
            >
              <div className="absolute inset-0 bg-[#FFD700]/20 blur-xl rounded-full animate-pulse group-hover:bg-[#FFD700]/40 transition-colors" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-[#FFD700]/40 rounded-full"
              />
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#020202] border border-[#FFD700]/60 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.5)] backdrop-blur-xl transition-all">
                <Bot className="w-7 h-7 md:w-8 md:h-8 text-[#FFD700]" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opened chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="orbit-container"
            onMouseMove={handleMouseMove}
            style={{ rotateX, rotateY, perspective: 1000, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            className="fixed bottom-6 right-6 w-[85vw] md:w-[400px] h-[500px] md:h-[600px] bg-[#020202]/60 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-[40px] z-[9999] flex flex-col overflow-hidden ring-1 ring-[#FFD700]/30 transform-gpu will-change-transform"
          >
            {/* HEADER */}
            <div className="relative p-5 border-b border-white/10 bg-white/5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[#FFD700]" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] md:text-xs font-bold text-[#E5E4E2] tracking-[0.2em] uppercase">
                    Orbit // Live
                  </h3>
                  <p className="text-[8px] font-mono text-[#FFD700]/60 uppercase">Uplink Stable</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CHAT FEED */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_50%_-20%,rgba(255,215,0,0.05),transparent)]">
              {history.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`relative p-4 rounded-2xl font-mono text-[11px] md:text-sm leading-relaxed transform-gpu ${
                        msg.role === "user"
                          ? "bg-[#FFD700]/20 text-[#FFD700] shadow-lg border border-[#FFD700]/30 backdrop-blur-md"
                          : "bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-md"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <span className="text-[#FFD700] mr-2 animate-pulse">{">"}</span>
                      )}
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3 text-[#FFD700] font-mono text-[10px] p-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse tracking-widest">ANALYZING...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-6 bg-[#020202]/80 border-t border-white/5 backdrop-blur-3xl">
              <form onSubmit={handleCommand} className="relative group">
                <div className="relative flex items-center bg-black/50 border border-white/20 rounded-xl overflow-hidden focus-within:border-[#FFD700] transition-all shadow-inner">
                  <div className="pl-4">
                    <Terminal className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Command..."
                    className="flex-1 bg-transparent py-4 px-3 text-sm font-mono text-white outline-none placeholder:text-zinc-600"
                    disabled={isTyping}
                  />
                  <button type="submit" className="pr-4 text-[#FFD700]/50 hover:text-[#FFD700] transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <div className="mt-4 flex justify-between items-center px-1 opacity-30">
                <div className="flex gap-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <Zap className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">V4-Quantum</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
