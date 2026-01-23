"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Terminal, Shield, ChevronRight, Activity, Cpu } from "lucide-react";

// --- 1. TYPES ---
type Sender = 'system' | 'user';
type MessageType = 'text' | 'options' | 'input-text' | 'input-email';

interface Option {
  label: string;
  value: string;
  action: string;
}

interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string[];
  options?: Option[];
  timestamp: number;
}

interface OrbitState {
  isOpen: boolean;
  flowStep: 'IDLE' | 'INTAKE' | 'DETAILS' | 'AUTH' | 'COMPLETE';
  history: Message[];
  userData: {
    intent?: string;
    details?: string;
    name?: string;
    email?: string;
  };
}

// --- 2. UTILS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- 3. SUB-COMPONENT: The Floating Orb ---
const OrbitOrb = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-9999 group cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-2 rounded-full border border-blue-500/30 border-dashed w-[calc(100%+16px)] h-[calc(100%+16px)]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -inset-1 rounded-full bg-blue-500/20 w-[calc(100%+8px)] h-[calc(100%+8px)]"
      />
      <div className="relative w-14 h-14 rounded-full bg-black border border-blue-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-tr from-blue-900/50 to-transparent opacity-80" />
        <Cpu className="w-6 h-6 text-blue-400 z-10 relative" />
        <motion.div 
          className="absolute bottom-1 w-1 h-1 bg-green-400 rounded-full z-20"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[10px] font-mono text-blue-400 tracking-[0.2em] bg-black/80 px-2 py-1 rounded">ORBIT ONLINE</span>
      </div>
    </motion.button>
  );
};

// --- 4. MAIN COMPONENT ---
export default function OrbitChat() {
  const [state, setState] = useState<OrbitState>({
    isOpen: false,
    flowStep: 'IDLE',
    history: [],
    userData: {}
  });
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false); // Prevents double-firing in Strict Mode

  // Scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.history, isTyping, state.isOpen]);

  // SYSTEM TYPING SIMULATION
  const addSystemMessage = useCallback((message: Omit<Message, 'timestamp'>) => {
    setIsTyping(true);
    const delay = 800; // Fixed delay for consistency
    
    setTimeout(() => {
      setIsTyping(false);
      setState(prev => ({ 
        ...prev, 
        history: [...prev.history, { ...message, timestamp: Date.now() }] 
      }));
    }, delay);
  }, []);

  // INITIALIZATION
  useEffect(() => {
    if (state.isOpen && state.history.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      setTimeout(() => {
        addSystemMessage({
          id: 'init',
          sender: 'system',
          type: 'options',
          content: [
            "ORBIT // COMMAND INTERFACE V1.0.4",
            "SYSTEM ONLINE. SECURE CONNECTION ESTABLISHED.",
            "AWAITING DEPLOYMENT PROTOCOLS."
          ],
          options: [
            { label: "Build New Product", value: "product", action: "details" },
            { label: "Scale Remote Team", value: "team", action: "details" },
            { label: "AI Infrastructure", value: "ai", action: "details" },
            { label: "Audit Systems", value: "audit", action: "details" }
          ]
        });
      }, 0);
    }
  }, [state.isOpen, state.history.length, addSystemMessage]);

  // HANDLERS
  const handleOptionSelect = (option: Option) => {
    // 1. Add User Selection
    const userMsg: Message = {
      id: generateId(),
      sender: 'user',
      type: 'text',
      content: [`Protocol Selected: ${option.label}`],
      timestamp: 0 // Will be set in setState below
    };

    setState(prev => {
      const now = Date.now();
      return {
        ...prev,
        history: [
          ...prev.history,
          { ...userMsg, timestamp: now }
        ],
        userData: { ...prev.userData, intent: option.value },
        flowStep: 'DETAILS'
      };
    });

    // 2. Trigger System Response
    setTimeout(() => {
      addSystemMessage({
        id: generateId(),
        sender: 'system',
        type: 'input-text',
        content: [
          `PROTOCOL CONFIRMED: ${option.value.toUpperCase()}`,
          "PLEASE DEFINE MISSION PARAMETERS.",
          "BRIEFLY DESCRIBE SCOPE & REQUIREMENTS."
        ]
      });
    }, 200);
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: generateId(),
      sender: 'user',
      type: 'text',
      content: [inputValue],
      timestamp: Date.now()
    };

    const nextState = { ...state, history: [...state.history, userMsg] };
    setInputValue("");
    
    if (state.flowStep === 'DETAILS') {
      nextState.userData.details = inputValue;
      nextState.flowStep = 'AUTH';
      setState(nextState);

      setTimeout(() => {
        addSystemMessage({
          id: generateId(),
          sender: 'system',
          type: 'input-text',
          content: [
            "PARAMETERS LOGGED.",
            "INITIALIZING AUTHORIZATION SEQUENCE.",
            "ENTER OPERATIVE ID (EMAIL ADDRESS)."
          ]
        });
      }, 200);

    } else if (state.flowStep === 'AUTH') {
      nextState.userData.email = inputValue;
      nextState.flowStep = 'COMPLETE';
      setState(nextState);

      setTimeout(() => {
        addSystemMessage({
          id: generateId(),
          sender: 'system',
          type: 'text',
          content: [
            "IDENTITY VERIFIED.",
            "ENCRYPTED PACKET TRANSMITTED TO HQ.",
            "STANDBY FOR INCOMING TRANSMISSION.",
            "ORBIT OUT."
          ]
        });
      }, 200);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!state.isOpen && (
          <motion.div
            key="orb"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OrbitOrb onClick={() => setState(p => ({...p, isOpen: true}))} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[95vw] md:w-112.5 h-150 max-h-[80vh] bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-9999 flex flex-col font-sans"
          >
            {/* --- VISUAL FX LAYER --- */}
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
            {/* Top Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            {/* Scanline Animation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-size-[100%_4px] opacity-10 pointer-events-none" />

            {/* --- HEADER --- */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="font-mono text-xs text-blue-400 tracking-[0.2em] font-bold">ORBIT // COMMAND</span>
              </div>
              <button 
                onClick={() => setState(p => ({...p, isOpen: false}))}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- CHAT HISTORY --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {state.history.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] font-mono text-zinc-600 mb-1 tracking-wider uppercase">
                    {msg.sender === 'system' ? 'ORBIT CORE' : 'OPERATOR'}
                  </span>

                  <motion.div
                    initial={{ opacity: 0, x: msg.sender === 'system' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`max-w-[90%] rounded-lg p-4 text-sm leading-relaxed border backdrop-blur-sm ${
                      msg.sender === 'system' 
                        ? 'bg-blue-900/10 border-blue-500/20 text-blue-100 rounded-tl-none shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'bg-zinc-800/50 border-white/10 text-white rounded-tr-none'
                    }`}
                  >
                    {/* System Icon Decor */}
                    {msg.sender === 'system' && (
                      <div className="mb-2 flex items-center gap-2 opacity-50">
                        <Terminal className="w-3 h-3" />
                        <div className="h-px w-8 bg-blue-500/50" />
                      </div>
                    )}

                    {/* Lines */}
                    <div className="space-y-1 font-mono text-xs md:text-sm">
                      {msg.content.map((line, i) => (
                        <p key={i} className={i === 0 && msg.sender === 'system' ? "text-blue-400 font-bold mb-2" : ""}>
                          {msg.sender === 'system' ? `> ${line}` : line}
                        </p>
                      ))}
                    </div>

                    {/* Interactive Options */}
                    {msg.type === 'options' && msg.options && (
                      <div className="mt-4 grid grid-cols-1 gap-2">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleOptionSelect(opt)}
                            className="group flex items-center justify-between w-full p-3 bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/50 text-left transition-all rounded"
                          >
                            <span className="text-xs font-mono text-blue-300 group-hover:text-blue-200 uppercase tracking-wider">
                              {opt.label}
                            </span>
                            <ChevronRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}

              {/* Typing Loader */}
              {isTyping && (
                <div className="flex items-center gap-2 text-blue-500/50 p-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-mono animate-pulse">PROCESSING DATA STREAM...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl relative z-20">
              {state.flowStep !== 'COMPLETE' ? (
                <form 
                  onSubmit={handleInputSubmit}
                  className="flex items-center gap-2 bg-zinc-900/50 border border-white/10 rounded-lg p-2 focus-within:border-blue-500/50 transition-colors"
                >
                  <span className="text-blue-500 pl-2 animate-pulse">{`>`}</span>
                  <input
                    type={state.flowStep === 'AUTH' ? "email" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={state.flowStep === 'AUTH' ? "Enter email authorization..." : "Input command..."}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white font-mono placeholder:text-zinc-700 h-8"
                    autoFocus
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-500 font-mono text-xs p-3 border border-green-500/20 bg-green-500/5 rounded">
                  <Shield className="w-4 h-4" />
                  <span>SESSION SECURED. TICKET #9482</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}