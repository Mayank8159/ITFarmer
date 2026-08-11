"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, GitMerge, Search, TerminalSquare, MessageSquare, Cpu, Network } from 'lucide-react';

const TOOLS = [
  { id: 0, label: 'RAG SEARCH', icon: Search, y: '20%' },
  { id: 1, label: 'CODE EXEC', icon: TerminalSquare, y: '50%' },
  { id: 2, label: 'DIRECT', icon: MessageSquare, y: '80%' },
];

export default function LlmInferenceGraph() {
  const [phase, setPhase] = useState(0);
  const [activePath, setActivePath] = useState(0);

  useEffect(() => {
    // 0: K8s to Router
    // 1: Router Decision
    // 2: Router to Tool
    // 3: Tool to Multi-LoRA
    // 4: LLM Generation
    const interval = setInterval(() => {
      setPhase((prev) => {
        if (prev >= 4) {
          setActivePath(Math.floor(Math.random() * 3)); // Pick new path for next cycle
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const getNodeClass = (isActive: boolean) => {
    return `w-12 h-12 md:w-16 md:h-16 border-[4px] flex items-center justify-center bg-white z-20 transition-none ${
      isActive ? 'border-[#ff6b00] text-black invert' : 'border-black text-black'
    }`;
  };

  const getLabelClass = (isActive: boolean) => {
    return `absolute top-full mt-3 font-mono text-[9px] md:text-[10px] font-black tracking-widest uppercase text-center w-32 ${
      isActive ? 'text-[#ff6b00]' : 'text-black'
    }`;
  };

  return (
    <div className="w-full relative min-h-[400px] overflow-hidden">
      
      {/* BACKGROUND SVG CONNECTORS (Coordinate-Locked) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {/* Ingress -> Router */}
        <line x1="10%" y1="50%" x2="30%" y2="50%" stroke="black" strokeWidth="4" />
        
        {/* Router -> Tools */}
        {TOOLS.map((tool) => (
          <line 
            key={`in-${tool.id}`}
            x1="30%" y1="50%" 
            x2="55%" y2={tool.y} 
            stroke={phase >= 2 && activePath === tool.id ? "#ff6b00" : "black"} 
            strokeWidth="4" 
            className="transition-colors duration-100"
          />
        ))}

        {/* Tools -> Multi-LoRA */}
        {TOOLS.map((tool) => (
          <line 
            key={`out-${tool.id}`}
            x1="55%" y1={tool.y} 
            x2="85%" y2="50%" 
            stroke={phase >= 3 && activePath === tool.id ? "#ff6b00" : "black"} 
            strokeWidth="4" 
            className="transition-colors duration-100"
          />
        ))}
      </svg>

      {/* --- ANIMATIONS --- */}
      {/* Phase 0: Ingress to Router */}
      {phase === 0 && (
        <motion.div
          className="absolute w-4 h-4 bg-[#ff6b00] border-2 border-black z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '10%', top: '50%' }}
          animate={{ left: '30%', top: '50%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 2: Router to Tool */}
      {phase === 2 && (
        <motion.div
          className="absolute w-4 h-4 bg-black border-2 border-[#ff6b00] z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '30%', top: '50%' }}
          animate={{ left: '55%', top: TOOLS[activePath].y }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 3: Tool to LLM */}
      {phase === 3 && (
        <motion.div
          className="absolute w-5 h-5 bg-[#ff6b00] border-4 border-black z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '55%', top: TOOLS[activePath].y }}
          animate={{ left: '85%', top: '50%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* --- NODES (Coordinate-Locked) --- */}
      
      {/* 1. K8S INGRESS (10%, 50%) */}
      <div className="absolute left-[10%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 0)}>
          <Network className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 0)}>K8S INGRESS</span>
      </div>

      {/* 2. LANGGRAPH ROUTER (30%, 50%) */}
      <div className="absolute left-[30%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          className={getNodeClass(phase === 1)}
          animate={{ scale: phase === 1 ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <GitMerge className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.div>
        <span className={getLabelClass(phase === 1)}>LANGGRAPH ROUTER</span>
      </div>

      {/* 3. TOOLS (55%) */}
      {TOOLS.map((tool) => (
        <div key={tool.id} className="absolute left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ top: tool.y }}>
          <div className={getNodeClass(phase === 2 && activePath === tool.id)}>
            <tool.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          </div>
          <span className={`absolute top-full mt-2 font-mono text-[8px] md:text-[9px] font-black tracking-widest uppercase text-center w-24 ${phase >= 2 && activePath === tool.id ? 'text-[#ff6b00]' : 'text-black'}`}>
            {tool.label}
          </span>
        </div>
      ))}

      {/* 4. MULTI-LORA LLM (85%, 50%) */}
      <div className="absolute left-[85%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          className={getNodeClass(phase >= 3)}
          animate={{ rotate: phase === 4 ? [0, 90, 180, 270, 360] : 0, scale: phase === 4 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1, ease: "linear" }}
        >
          <Cpu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.div>
        <span className={getLabelClass(phase >= 3)}>MULTI-LORA CLUSTER</span>
      </div>

    </div>
  );
}
