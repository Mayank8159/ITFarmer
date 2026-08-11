"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Layers, ShieldAlert, Cpu, Search, CheckSquare } from 'lucide-react';

export default function MultiAgentWorkflowGraph() {
  const [phase, setPhase] = useState(0);

  // Brutalist Spring Settings
  const springConfig = { type: "spring" as const, stiffness: 300, damping: 30 };

  useEffect(() => {
    // 0: High-load Ingress (10k -> Queue -> Supervisor)
    // 1: Delegation (Supervisor -> Workers)
    // 2: Execution & Return (Workers -> Supervisor)
    // 3: Evaluation (Supervisor -> Evaluator)
    // 4: Consensus/Response (Supervisor -> Web)
    const interval = setInterval(() => {
      setPhase((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const getNodeClass = (isActive: boolean) => {
    return `w-12 h-12 md:w-14 md:h-14 border-[4px] flex items-center justify-center bg-white z-20 transition-none ${
      isActive ? 'border-[#ff6b00] text-black invert' : 'border-black text-black'
    }`;
  };

  const getLabelClass = (isActive: boolean) => {
    return `absolute top-full mt-2 font-mono text-[8px] md:text-[9px] font-black tracking-widest uppercase text-center w-28 bg-white px-1 ${
      isActive ? 'text-[#ff6b00]' : 'text-black'
    }`;
  };

  return (
    <div className="w-full relative min-h-[450px] overflow-hidden">
      
      {/* BACKGROUND SVG CONNECTORS (Coordinate-Locked) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {/* Web -> Queue */}
        <line x1="50%" y1="15%" x2="50%" y2="35%" stroke="black" strokeWidth="4" />
        {/* Queue -> Supervisor */}
        <line x1="50%" y1="35%" x2="50%" y2="55%" stroke="black" strokeWidth="4" />
        
        {/* Supervisor -> Workers & Evaluator */}
        <line x1="50%" y1="55%" x2="25%" y2="85%" stroke="black" strokeWidth="4" />
        <line x1="50%" y1="55%" x2="50%" y2="85%" stroke="black" strokeWidth="4" />
        <line x1="50%" y1="55%" x2="75%" y2="85%" stroke="black" strokeWidth="4" />
      </svg>

      {/* --- ANIMATIONS --- */}
      
      {/* Phase 0: 10K User Load (Multiple Packets) */}
      {phase === 0 && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-black border-2 border-[#ff6b00] z-30"
              style={{ x: '-50%', y: '-50%' }}
              initial={{ left: '50%', top: '15%' }}
              animate={{ top: '55%' }}
              transition={{ duration: 0.6, ease: "linear", delay: i * 0.2 }}
            />
          ))}
        </>
      )}

      {/* Phase 1: Delegation to Workers */}
      {phase === 1 && (
        <>
          <motion.div className="absolute w-3 h-3 bg-[#ff6b00] border-2 border-black z-30"
            style={{ x: '-50%', y: '-50%' }} initial={{ left: '50%', top: '55%' }} animate={{ left: '25%', top: '85%' }} transition={springConfig} />
          <motion.div className="absolute w-3 h-3 bg-[#ff6b00] border-2 border-black z-30"
            style={{ x: '-50%', y: '-50%' }} initial={{ left: '50%', top: '55%' }} animate={{ left: '50%', top: '85%' }} transition={springConfig} />
        </>
      )}

      {/* Phase 2: Workers Return Results */}
      {phase === 2 && (
        <>
          <motion.div className="absolute w-3 h-3 bg-black border-2 border-[#ff6b00] z-30"
            style={{ x: '-50%', y: '-50%' }} initial={{ left: '25%', top: '85%' }} animate={{ left: '50%', top: '55%' }} transition={springConfig} />
          <motion.div className="absolute w-3 h-3 bg-black border-2 border-[#ff6b00] z-30"
            style={{ x: '-50%', y: '-50%' }} initial={{ left: '50%', top: '85%' }} animate={{ left: '50%', top: '55%' }} transition={springConfig} />
        </>
      )}

      {/* Phase 3: Evaluation */}
      {phase === 3 && (
        <motion.div className="absolute w-4 h-4 bg-[#ff6b00] border-2 border-black z-30"
          style={{ x: '-50%', y: '-50%' }} initial={{ left: '50%', top: '55%' }} animate={{ left: '75%', top: '85%' }} transition={springConfig} />
      )}

      {/* Phase 4: Evaluator Passes -> Final Response up to Web */}
      {phase === 4 && (
        <motion.div className="absolute w-6 h-6 bg-[#ff6b00] border-4 border-black z-30"
          style={{ x: '-50%', y: '-50%' }} initial={{ left: '75%', top: '85%' }} animate={{ left: '50%', top: '15%' }} transition={{ type: "spring", stiffness: 200, damping: 25 }} />
      )}

      {/* --- NODES (Coordinate-Locked) --- */}
      
      {/* 1. 10K USERS (50%, 15%) */}
      <div className="absolute left-[50%] top-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 0 || phase === 4)}>
          <Globe className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 0 || phase === 4)}>10K/SEC WSS FIREHOSE</span>
      </div>

      {/* 2. EVENT QUEUE (50%, 35%) */}
      <div className="absolute left-[50%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 0)}>
          <Layers className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 0)}>KAFKA QUEUE</span>
      </div>

      {/* 3. SUPERVISOR (50%, 55%) */}
      <div className="absolute left-[50%] top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 1 || phase === 2)}>
          <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 1 || phase === 2)}>SWARM SUPERVISOR</span>
      </div>

      {/* 4. EXECUTION WORKER (25%, 85%) */}
      <div className="absolute left-[25%] top-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 2)}>
          <Cpu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 2)}>EXEC WORKER</span>
      </div>

      {/* 5. RESEARCH WORKER (50%, 85%) */}
      <div className="absolute left-[50%] top-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 2)}>
          <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 2)}>RESEARCH WORKER</span>
      </div>

      {/* 6. EVALUATOR (75%, 85%) */}
      <div className="absolute left-[75%] top-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          className={getNodeClass(phase === 3 || phase === 4)}
          animate={{ scale: phase === 4 ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <CheckSquare className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.div>
        <span className={getLabelClass(phase === 3 || phase === 4)}>STATE EVALUATOR</span>
      </div>

    </div>
  );
}
