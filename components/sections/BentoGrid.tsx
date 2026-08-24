"use client";

import React from "react";
import { motion } from "framer-motion";
import BrutalistCard from "@/components/cards/BrutalistCard";
import { GitMerge, Database, ShieldAlert, BrainCircuit } from "lucide-react";
import RagPipelineGraph from "./RagPipelineGraph";
import LlmInferenceGraph from "./LlmInferenceGraph";
import LlmTrainingGraph from "./LlmTrainingGraph";
import MultiAgentWorkflowGraph from "./MultiAgentWorkflowGraph";

export default function BentoGrid() {
  return (
    <section id="infrastructure" className="relative w-full bg-[#f0f0f0] py-32 z-10">
      
      <div className="max-w-[1600px] mx-auto px-6">
        {/* HEADER */}
        <div className="mb-16 border-b border-black pb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b00] mb-4 block font-bold">INFRASTRUCTURE LAYER</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black uppercase max-w-3xl leading-[0.9]">
            ENGINEERING ARCHITECTURE.
          </h2>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 auto-rows-[auto]">
          
          {/* CARD 1: RAG Pipeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <BrutalistCard whiteBg className="h-full flex flex-col p-0 overflow-hidden">
              <div className="flex items-center gap-3 p-6 md:p-8 border-b-[4px] border-black bg-white z-20">
                <Database className="w-6 h-6 text-black" strokeWidth={3} />
                <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter">Interactive RAG Pipeline</h3>
              </div>
              <div className="flex-1 bg-[#e0e0e0] flex flex-col justify-center overflow-x-auto p-4 custom-scrollbar">
                <div className="min-w-[600px] w-full">
                  <RagPipelineGraph />
                </div>
              </div>
            </BrutalistCard>
          </motion.div>

          {/* CARD 2: LangGraph Inference */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BrutalistCard whiteBg className="h-full flex flex-col p-0 overflow-hidden">
              <div className="flex items-center gap-3 p-6 md:p-8 border-b-[4px] border-black bg-white z-20">
                <GitMerge className="w-6 h-6 text-black" strokeWidth={3} />
                <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter">LangGraph Inference Router</h3>
              </div>
              <div className="flex-1 bg-[#e0e0e0] flex flex-col justify-center overflow-x-auto p-4 custom-scrollbar">
                <div className="min-w-[600px] w-full">
                  <LlmInferenceGraph />
                </div>
              </div>
            </BrutalistCard>
          </motion.div>

          {/* CARD 3: LLM Training Loop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <BrutalistCard whiteBg className="h-full flex flex-col p-0 overflow-hidden">
              <div className="flex items-center gap-3 p-6 md:p-8 border-b-[4px] border-black bg-white z-20">
                <BrainCircuit className="w-6 h-6 text-black" strokeWidth={3} />
                <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter">LLM Training Loop</h3>
              </div>
              <div className="flex-1 bg-[#e0e0e0] flex flex-col justify-center overflow-x-auto p-4 custom-scrollbar">
                <div className="min-w-[600px] w-full">
                  <LlmTrainingGraph />
                </div>
              </div>
            </BrutalistCard>
          </motion.div>

          {/* CARD 4: Multi-Agent Swarm */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <BrutalistCard whiteBg className="h-full flex flex-col p-0 overflow-hidden">
              <div className="flex items-center gap-3 p-6 md:p-8 border-b-[4px] border-black bg-white z-20">
                <ShieldAlert className="w-6 h-6 text-black" strokeWidth={3} />
                <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter">Multi-Agent Swarm</h3>
              </div>
              <div className="flex-1 bg-[#e0e0e0] flex flex-col justify-center overflow-x-auto p-4 custom-scrollbar">
                <div className="min-w-[600px] w-full">
                  <MultiAgentWorkflowGraph />
                </div>
              </div>
            </BrutalistCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}