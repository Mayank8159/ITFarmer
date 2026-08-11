"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Undo2, BrainCircuit, Scale, Zap } from 'lucide-react';

export default function LlmTrainingGraph() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 0: Prompt -> Policy LLM
    // 1: Policy LLM -> Reward Model
    // 2: Reward Model -> PPO Optimizer
    // 3: PPO Optimizer -> Gradient Step
    // 4: Gradient Step -> Policy LLM
    const interval = setInterval(() => {
      setPhase((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const getNodeClass = (isActive: boolean) => {
    return `w-12 h-12 md:w-16 md:h-16 border-[4px] flex items-center justify-center bg-white z-20 transition-none ${
      isActive ? 'border-[#ff6b00] text-black invert' : 'border-black text-black'
    }`;
  };

  const getLabelClass = (isActive: boolean, bottom = false) => {
    return `absolute ${bottom ? 'bottom-full mb-3' : 'top-full mt-3'} font-mono text-[9px] md:text-[10px] font-black tracking-widest uppercase text-center w-32 ${
      isActive ? 'text-[#ff6b00]' : 'text-black'
    }`;
  };

  return (
    <div className="w-full relative min-h-[450px] overflow-hidden">
      
      {/* BACKGROUND SVG CONNECTORS (Coordinate-Locked Envelope Shape) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {/* Prompt to Policy */}
        <line x1="15%" y1="20%" x2="50%" y2="50%" stroke="black" strokeWidth="4" />
        {/* Policy to Reward */}
        <line x1="50%" y1="50%" x2="85%" y2="20%" stroke="black" strokeWidth="4" />
        {/* Reward to PPO */}
        <line x1="85%" y1="20%" x2="85%" y2="80%" stroke="black" strokeWidth="4" />
        {/* PPO to Gradient */}
        <line x1="85%" y1="80%" x2="15%" y2="80%" stroke="black" strokeWidth="4" />
        {/* Gradient to Policy */}
        <line x1="15%" y1="80%" x2="50%" y2="50%" stroke="black" strokeWidth="4" />
      </svg>

      {/* --- ANIMATIONS --- */}
      {/* Phase 0: Prompt to Policy */}
      {phase === 0 && (
        <motion.div
          className="absolute w-4 h-4 bg-[#ff6b00] border-2 border-black z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '15%', top: '20%' }}
          animate={{ left: '50%', top: '50%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 1: Policy to Reward */}
      {phase === 1 && (
        <motion.div
          className="absolute w-4 h-4 bg-black border-2 border-[#ff6b00] z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '50%', top: '50%' }}
          animate={{ left: '85%', top: '20%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 2: Reward to PPO */}
      {phase === 2 && (
        <motion.div
          className="absolute w-4 h-4 bg-[#ff6b00] border-2 border-black z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '85%', top: '20%' }}
          animate={{ left: '85%', top: '80%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 3: PPO to Gradient */}
      {phase === 3 && (
        <motion.div
          className="absolute w-4 h-4 bg-black border-2 border-[#ff6b00] z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '85%', top: '80%' }}
          animate={{ left: '15%', top: '80%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Phase 4: Gradient to Policy (Update) */}
      {phase === 4 && (
        <motion.div
          className="absolute w-5 h-5 bg-[#ff6b00] border-4 border-black z-30"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ left: '15%', top: '80%' }}
          animate={{ left: '50%', top: '50%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* --- NODES (Coordinate-Locked) --- */}
      
      {/* 1. PROMPT SAMPLING (15%, 20%) */}
      <div className="absolute left-[15%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 0)}>
          <Database className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 0)}>PROMPT SAMPLING</span>
      </div>

      {/* 2. REWARD MODEL (85%, 20%) */}
      <div className="absolute left-[85%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className={getNodeClass(phase === 1)}>
          <Scale className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
        <span className={getLabelClass(phase === 1)}>REWARD MODEL</span>
      </div>

      {/* 3. PPO OPTIMIZER (85%, 80%) */}
      <div className="absolute left-[85%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className={getLabelClass(phase === 2, true)}>PPO OPTIMIZER</span>
        <div className={getNodeClass(phase === 2)}>
          <Zap className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
      </div>

      {/* 4. GRADIENT STEP (15%, 80%) */}
      <div className="absolute left-[15%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className={getLabelClass(phase === 3, true)}>GRADIENT STEP</span>
        <div className={getNodeClass(phase === 3)}>
          <Undo2 className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </div>
      </div>

      {/* 5. POLICY LLM (50%, 50%) */}
      <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div 
          className={getNodeClass(phase === 4)}
          animate={{ scale: phase === 4 ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.3, repeat: phase === 4 ? 2 : 0 }}
        >
          <BrainCircuit className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.div>
        <span className={getLabelClass(phase === 4)}>POLICY LLM (SFT)</span>
      </div>

    </div>
  );
}
