"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, FileJson, Layers, Cpu, CheckSquare } from 'lucide-react';

const PIPELINE_NODES = [
  { id: 'raw', label: 'RAW DATA', icon: FileJson, stack: 'JSON, CSV, PDF' },
  { id: 'chunk', label: 'CHUNKING', icon: Layers, stack: 'LangChain, LlamaIndex' },
  { id: 'vector', label: 'VECTOR DB', icon: Database, stack: 'Pinecone, pgvector' },
  { id: 'llm', label: 'LLM ENGINE', icon: Cpu, stack: 'GPT-4, Claude, Llama 3' },
  { id: 'out', label: 'OUTPUT', icon: CheckSquare, stack: 'Deterministic JSON' },
];

export default function RagPipelineGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="w-full relative flex items-center justify-between py-8 px-2 overflow-x-auto no-scrollbar">
      
      {/* Heavy Black Connecting Line */}
      <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-black -translate-y-1/2 z-0" />

      {/* Animated Data Packets */}
      <motion.div
        className="absolute top-1/2 left-[10%] w-3 h-3 bg-[#ff6b00] -translate-y-1/2 z-10 shadow-[0_0_10px_#ff6b00]"
        animate={{ left: ['10%', '90%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/2 left-[10%] w-3 h-3 bg-black -translate-y-1/2 z-10"
        animate={{ left: ['10%', '90%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.5 }}
      />

      {/* Nodes */}
      {PIPELINE_NODES.map((node, i) => {
        const isHovered = hoveredNode === node.id;
        const Icon = node.icon;

        return (
          <div
            key={node.id}
            className="relative z-20 flex flex-col items-center group cursor-crosshair shrink-0 px-2"
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Hover Tooltip (Tech Stack) */}
            <div className={`absolute -top-12 whitespace-nowrap bg-black text-white font-mono text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest transition-opacity duration-200 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {node.stack}
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black" />
            </div>

            {/* Node Box */}
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-white border-4 flex items-center justify-center transition-colors duration-200 ${isHovered ? 'border-[#ff6b00] text-[#ff6b00] shadow-[4px_4px_0px_0px_rgba(255,107,0,1)] -translate-y-1' : 'border-black text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
              <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </div>

            {/* Label */}
            <span className={`mt-3 font-mono text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-colors ${isHovered ? 'text-[#ff6b00]' : 'text-black'}`}>
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
