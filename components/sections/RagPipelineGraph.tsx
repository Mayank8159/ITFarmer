"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, GitMerge, Cpu, Terminal } from 'lucide-react';

export default function RagPipelineGraph() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 0: Ingestion
    // 1: Query
    // 2: Retrieval Search
    // 3: Inference Loop
    const interval = setInterval(() => {
      setPhase((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 1500); // 1.5 seconds per phase
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
        {/* Ingestion Line: Documents -> Vector DB */}
        <line x1="15%" y1="25%" x2="50%" y2="25%" stroke="black" strokeWidth="4" />
        
        {/* Query Line: Prompt -> Orchestrator */}
        <line x1="15%" y1="75%" x2="50%" y2="75%" stroke="black" strokeWidth="4" />
        
        {/* Retrieval Line: Orchestrator <-> Vector DB */}
        <line x1="50%" y1="75%" x2="50%" y2="25%" stroke="black" strokeWidth="4" />
        
        {/* Inference Line: Orchestrator -> LLM */}
        <line x1="50%" y1="75%" x2="85%" y2="50%" stroke="black" strokeWidth="4" />
      </svg>

      {/* --- ANIMATIONS --- */}
      {/* Phase 0: Ingestion Packet */}
      {phase === 0 && (
        <motion.div
          className="absolute w-4 h-4 bg-[#ff6b00] border-2 border-black z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '15%', top: '25%' }}
          animate={{ left: '50%', top: '25%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 1: Query Packet */}
      {phase === 1 && (
        <motion.div
          className="absolute w-4 h-4 bg-black border-2 border-[#ff6b00] z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '15%', top: '75%' }}
          animate={{ left: '50%', top: '75%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 2: Retrieval Ping-Pong */}
      {phase === 2 && (
        <>
          <motion.div
            className="absolute w-4 h-4 bg-white border-4 border-black z-30"
            style={{ x: '-50%', y: '-50%' }}
            initial={{ left: '50%', top: '75%' }}
            animate={{ top: ['75%', '25%', '75%'] }}
            transition={{ duration: 0.8, ease: "linear" }}
          />
        </>
      )}

      {/* Phase 3: Inference Packet & LLM Pulse */}
      {phase === 3 && (
        <motion.div
          className="absolute w-5 h-5 bg-[#ff6b00] border-4 border-black z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '50%', top: '75%' }}
          animate={{ left: '85%', top: '50%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* --- NODES (Coordinate-Locked) --- */}
      
      {/* 1. DOCUMENTS (15%, 25%) */}
      <div className="absolute left-[15%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 0)}>
          <FileText className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 0)}>DATA INGESTION</span>
      </div>

      {/* 2. VECTOR DB (50%, 25%) */}
      <div className="absolute left-[50%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 0 || phase === 2)}>
          <Database className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 0 || phase === 2)}>VECTOR DATABASE</span>
      </div>

      {/* 3. USER PROMPT (15%, 75%) */}
      <div className="absolute left-[15%] top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 1)}>
          <Terminal className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 1)}>USER QUERY</span>
      </div>

      {/* 4. RAG ORCHESTRATOR (50%, 75%) */}
      <div className="absolute left-[50%] top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 1 || phase === 2 || phase === 3)}>
          <GitMerge className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 1 || phase === 2 || phase === 3)}>RAG ORCHESTRATOR</span>
      </div>

      {/* 5. LLM ENGINE (85%, 50%) */}
      <div className="absolute left-[85%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          className={getNodeClass(phase === 3)}
          animate={{ scale: phase === 3 ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3, delay: 0.5, repeat: phase === 3 ? 2 : 0 }}
        >
          <Cpu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.div>
        <span className={getLabelClass(phase === 3)}>LLM INFERENCE LOOP</span>
      </div>

    </div>
  );
}
