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
    fetch('/api/data/systemConfig')
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
              
              <div className="flex-1 relative w-full mt-4 border border-black bg-[#111] flex flex-col justify-end overflow-hidden min-h-[240px]">
                 {/* Grid Background */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                 
                 {/* Premium Smooth Equalizer Graph */}
                 <div className="absolute inset-0 flex items-end gap-1 px-4 md:px-8 pb-[88px] opacity-90">
                   {[...Array(24)].map((_, i) => (
                     <motion.div 
                       key={i}
                       className="flex-1 bg-gradient-to-t from-[#ff6b00] to-transparent rounded-t-sm"
                       animate={{ height: ['15%', `${30 + Math.random() * 65}%`, '15%'] }}
                       transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
                     />
                   ))}
                 </div>
                 
                 {/* Bottom Data Bar */}
                 <div className="relative z-10 flex flex-wrap gap-6 md:gap-12 border-t border-white/20 bg-black/80 backdrop-blur-xl p-4 md:p-6 w-full">
                   <div>
                     <div className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1 font-bold">UTILIZATION</div>
                     <div className="text-2xl md:text-4xl font-black text-white">92.4%</div>
                   </div>
                   <div>
                     <div className="font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1 font-bold">THROUGHPUT</div>
                     <div className="text-2xl md:text-4xl font-black text-white">1.8 PFLOP/s</div>
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
              
              <div className="flex-1 relative flex items-center justify-center border border-black bg-[#111] mb-4 overflow-hidden min-h-[240px]">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #555 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                {/* Agent Nodes */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Orbiting rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ ease: "linear", duration: 20, repeat: Infinity }}
                    className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full border border-white/20 border-dashed" 
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                    className="absolute w-28 h-28 md:w-40 md:h-40 rounded-full border border-[#ff6b00]/40" 
                  />
                  
                  {/* Center Node */}
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ ease: "easeInOut", duration: 3, repeat: Infinity }}
                    className="absolute w-8 h-8 md:w-10 md:h-10 bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10"
                  >
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-black" />
                  </motion.div>

                  {/* Satellite Nodes */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ ease: "linear", duration: 10, repeat: Infinity }}
                    className="absolute w-40 h-40 md:w-56 md:h-56 flex items-start justify-center"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 bg-[#ff6b00] shadow-[0_0_15px_#ff6b00] -mt-1.5" 
                    />
                  </motion.div>

                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ ease: "linear", duration: 12, repeat: Infinity }}
                    className="absolute w-28 h-28 md:w-40 md:h-40 flex items-end justify-start"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                      className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white shadow-[0_0_10px_white] -mb-1 -ml-1" 
                    />
                  </motion.div>
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-black text-black mb-1 uppercase leading-tight pr-4">{config?.card2Title || "Agent Network"}</h3>
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