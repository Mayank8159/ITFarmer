"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BrutalistCard from "@/components/cards/BrutalistCard";
import { Cpu, Network, Zap, Code2, Server } from "lucide-react";

export default function BentoGrid() {
  const [inferenceCount, setInferenceCount] = useState(2405932);
  const [latency, setLatency] = useState(42);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/data/systemConfig.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => setConfig(data.bentoGrid))
      .catch(err => console.error("Failed to load bento grid config:", err));

    const interval = setInterval(() => {
      setInferenceCount(prev => prev + Math.floor(Math.random() * 5));
      setLatency(40 + Math.floor(Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="infrastructure" className="relative w-full bg-[#f0f0f0] border-t border-black/15 py-32 z-10">
      
      <div className="max-w-[1600px] mx-auto px-6">
        {/* HEADER */}
        <div className="mb-16 border-b border-black/15 pb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b00] mb-4 block font-bold">INFRASTRUCTURE LAYER</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black uppercase max-w-3xl leading-[0.9]">
            {config?.title || "UNCOMPROMISED PERFORMANCE."}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[300px]">
          
          {/* CARD 1: GPU COMPUTE (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-4 md:row-span-2"
          >
            <BrutalistCard whiteBg className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-8 border-b border-black/10 pb-4">
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#ff6b00]">
                  <div className="w-2 h-2 bg-white" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white font-bold">CLUSTER ACTIVE</span>
                </div>
              </div>
              
              <div className="flex-1 relative w-full mt-4 border border-black bg-[#e5e5e5] p-6 flex flex-col justify-end">
                 {/* Brutalist compute graph */}
                 <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden flex items-end">
                   <motion.div 
                     animate={{ x: ["0%", "-50%"] }} 
                     transition={{ ease: "linear", duration: 4, repeat: Infinity }}
                     className="w-[200%] h-full flex"
                   >
                     {/* Graph 1 */}
                     <svg className="w-1/2 h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path 
                         d="M0,100 L0,50 L20,70 L40,30 L60,80 L80,20 L100,50 L100,100 Z" 
                         fill="black" 
                       />
                     </svg>
                     {/* Graph 2 (Seamless clone) */}
                     <svg className="w-1/2 h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path 
                         d="M0,100 L0,50 L20,70 L40,30 L60,80 L80,20 L100,50 L100,100 Z" 
                         fill="black" 
                       />
                     </svg>
                   </motion.div>
                 </div>
                 
                 <div className="relative z-10 flex gap-12 border-t border-black pt-4">
                   <div>
                     <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1 font-bold">UTILIZATION</div>
                     <div className="text-4xl font-black text-black">92.4%</div>
                   </div>
                   <div>
                     <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1 font-bold">THROUGHPUT</div>
                     <div className="text-4xl font-black text-black">1.8 PFLOP/s</div>
                   </div>
                 </div>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-black text-black mb-2 uppercase">{config?.card1Title || "GPU Compute Architecture"}</h3>
                <p className="text-black/70 text-sm font-mono max-w-xl">{config?.card1Desc || "Distributed clusters optimized for high-bandwidth model training and low-latency inference."}</p>
              </div>
            </BrutalistCard>
          </motion.div>

          {/* CARD 2: AGENT NETWORK */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 md:row-span-1"
          >
            <BrutalistCard whiteBg className="h-full flex flex-col justify-between">
              <div className="w-10 h-10 bg-black flex items-center justify-center mb-6">
                <Network className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 relative flex items-center justify-center border border-black/10 bg-[#f8f8f8] mb-4">
                {/* Agent Nodes */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ ease: "linear", duration: 10, repeat: Infinity }}
                    className="w-16 h-16 border-2 border-black" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute w-2 h-2 bg-[#ff6b00] top-4" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute w-2 h-2 bg-black bottom-4 left-4" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute w-2 h-2 bg-black bottom-4 right-4" 
                  />
                  
                  {/* Connectors */}
                  <div className="absolute w-px h-8 bg-black/20 top-6" />
                  <div className="absolute h-px w-8 bg-black/20 bottom-8 left-6 rotate-45" />
                  <div className="absolute h-px w-8 bg-black/20 bottom-8 right-6 -rotate-45" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-black mb-1 uppercase">{config?.card2Title || "Agent Network"}</h3>
                <p className="text-black/60 text-xs font-mono">{config?.card2Desc || "Autonomous swarms interacting via secure subnets."}</p>
              </div>
            </BrutalistCard>
          </motion.div>

          {/* CARD 3: LIVE INFERENCE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 md:row-span-1"
          >
            <BrutalistCard whiteBg className="h-full flex flex-col justify-between">
              <div className="w-10 h-10 bg-[#ff6b00] flex items-center justify-center mb-6">
                <Zap className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1 font-bold">TOTAL REQUESTS</div>
                  <div className="text-3xl font-black text-black tracking-tight">
                    {inferenceCount.toLocaleString('en-US')}
                  </div>
                </div>
                <div className="h-px w-full bg-black/15" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1 font-bold">AVG LATENCY</div>
                  <div className="text-2xl font-black text-[#ff6b00]">{latency}ms</div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-black/15">
                <h3 className="text-xl font-black text-black mb-1 uppercase">Live Inference</h3>
                <p className="text-black/60 text-xs font-mono">Global load-balanced API routing.</p>
              </div>
            </BrutalistCard>
          </motion.div>

          {/* CARD 4: MODEL PIPELINE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-3 md:row-span-1"
          >
            <BrutalistCard whiteBg className="h-full flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6 border-b border-black/15 pb-4">
                <Cpu className="w-5 h-5 text-black" />
                <h3 className="text-xl font-black text-black uppercase">{config?.card3Title || "Execution Pipeline"}</h3>
              </div>
              
              <div className="flex items-center justify-between w-full mt-4 px-2 relative">
                {/* Connector line */}
                <div className="absolute top-[40%] left-10 right-10 h-[2px] bg-black/15 -z-0" />
                
                {['INPUT', 'PROCESS', 'INFER', 'OUTPUT'].map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-3 relative z-10 bg-white">
                    <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition-colors cursor-default">
                      <span>0{i+1}</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase">{step}</span>
                  </div>
                ))}
              </div>
            </BrutalistCard>
          </motion.div>

          {/* CARD 5: DEVELOPER API */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="md:col-span-3 md:row-span-1"
          >
             <BrutalistCard whiteBg className="h-full flex flex-col justify-between p-0">
              <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Code2 className="w-5 h-5 text-black" />
                  <h3 className="text-xl font-black text-black uppercase">{config?.card4Title || "Developer API"}</h3>
                </div>
              </div>
              
              <div className="flex-1 bg-[#111111] border-t border-black mt-auto p-6 overflow-hidden text-white relative flex flex-col justify-center">
                {/* Laser scan line */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ ease: "linear", duration: 3, repeat: Infinity }}
                  className="absolute left-0 right-0 h-[2px] bg-[#00f0ff]/50 shadow-[0_0_8px_#00f0ff] z-10" 
                />
                
                <div className="font-mono text-xs text-white/60 mb-4 flex items-center gap-3 relative z-20">
                  <span className="bg-[#ff6b00] text-white px-2 py-0.5 font-bold animate-pulse">POST</span> /api/v1/inference
                </div>
                
                <motion.pre 
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-mono text-[11px] text-[#00f0ff] relative z-20"
                >
                  {`{
  "model": "neural-forge-alpha",
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": true
}`}
                </motion.pre>
              </div>
            </BrutalistCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}