"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    { id: "init", role: "assistant", content: "ORBIT CORE ONLINE. Terminal uplink verified. State objective." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  // Send message and call backend
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Math.random().toString(), role: "user", content: inputValue };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);

    setInputValue("");
    setIsTyping(true);

    try {
      const messagesPayload = newHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          messages: messagesPayload 
        })
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      const rawContent = data.choices?.[0]?.message?.content || "No response received.";
      const cleanContent = rawContent.replace(/[*`#]/g, '');

      const botMessage: Message = { 
        id: Math.random().toString(), 
        role: "assistant", 
        content: cleanContent
      };
      setHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: "ERROR: COULD NOT CONNECT TO SERVER."
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
              whileHover={{ scale: 1.05, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              whileTap={{ scale: 0.95 }}
              className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group transition-all"
            >
              <div className="absolute top-1 left-1 w-1 h-1 bg-black" />
              <div className="absolute top-1 right-1 w-1 h-1 bg-black" />
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-black" />
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-black" />
              
              <div className="w-10 h-10 relative overflow-hidden bg-black border border-black/20 group-hover:border-[#ff6b00] transition-colors">
                <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ff6b00] border border-black animate-pulse" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opened chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="orbit-container"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed bottom-6 right-6 w-[90vw] md:w-[450px] h-[600px] md:h-[700px] bg-[#f0f0f0] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] z-[9999] flex flex-col overflow-hidden"
          >
            {/* BACKGROUND GRID */}
            <div className="absolute inset-0 grid-background opacity-50 pointer-events-none" />

            {/* HEADER */}
            <div className="relative p-4 border-b-4 border-black bg-white flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black border-2 border-[#ff6b00] flex items-center justify-center relative overflow-hidden">
                  <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-black z-10" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-black uppercase leading-none">
                    ORBIT CORE
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-[#ff6b00] animate-pulse" />
                    <p className="text-[10px] font-mono text-black font-bold uppercase tracking-widest">Uplink Stable</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 border-2 border-black bg-[#f0f0f0] hover:bg-[#ff6b00] hover:text-white transition-colors text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CHAT FEED */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative z-10">
              {history.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`relative p-4 font-mono text-sm leading-relaxed border-2 border-black ${
                        msg.role === "user"
                          ? "bg-black text-white"
                          : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <span className="text-[#ff6b00] mr-2 font-black animate-pulse">{">"}</span>
                      )}
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3 text-black font-mono font-bold text-xs p-4 bg-white border-2 border-black w-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Activity className="w-4 h-4 animate-spin text-[#ff6b00]" />
                  <span className="animate-pulse tracking-widest uppercase">ANALYZING...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white border-t-4 border-black relative z-10">
              <form onSubmit={handleCommand} className="relative">
                <div className="relative flex items-center bg-[#f0f0f0] border-2 border-black focus-within:border-[#ff6b00] transition-colors">
                  <div className="pl-4">
                    <Terminal className="w-5 h-5 text-black" />
                  </div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="ENTER COMMAND..."
                    className="flex-1 bg-transparent py-4 px-3 text-sm font-mono font-bold text-black outline-none placeholder:text-black/40 uppercase"
                    disabled={isTyping}
                  />
                  <button type="submit" className="p-4 bg-black text-white hover:bg-[#ff6b00] transition-colors border-l-2 border-black">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <div className="mt-3 flex justify-between items-center px-1">
                <div className="flex gap-4">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <span className="text-[10px] font-mono font-bold text-black/50 uppercase tracking-widest border border-black/20 px-2 py-0.5">V4-Quantum Node</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
