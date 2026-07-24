"use client";

import { motion } from "framer-motion";
import { Brain, Code2, Rocket, ShieldCheck, RefreshCw, Layers } from "lucide-react";

const WORKFLOW_STEPS = [
  { icon: Layers, title: "Architecture & Scoping", desc: "Detailed analysis and blueprinting." },
  { icon: Brain, title: "AI & System Design", desc: "Intelligent core logic & modeling." },
  { icon: Code2, title: "Agile Execution", desc: "High-velocity sprint development." },
  { icon: ShieldCheck, title: "Quality & Security", desc: "Rigorous hardening and QA." },
  { icon: Rocket, title: "Scale Deployment", desc: "Production rollout with zero downtime." },
  { icon: RefreshCw, title: "CI/CD & Maintenance", desc: "Continuous integration & monitoring." },
];

export default function CircularWorkflow() {
  const radius = 160;
  const center = 200;
  const circumference = 2 * Math.PI * radius; // ~1005
  
  return (
    <div className="relative w-full max-w-[1000px] mx-auto py-20 flex flex-col lg:flex-row items-center gap-16 justify-center">
      
      {/* LEFT: The Orbiting Graph */}
      <div className="relative w-[400px] h-[400px] shrink-0">
        <svg width="400" height="400" viewBox="0 0 400 400" className="absolute inset-0 z-0">
          {/* Background Track */}
          <circle cx="200" cy="200" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Animated Glowing Pulse */}
          <motion.circle
            cx="200"
            cy="200"
            r={radius}
            fill="none"
            stroke="#FFD700"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`150 ${circumference - 150}`}
            animate={{ strokeDashoffset: [circumference, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]"
          />
        </svg>

        {/* Nodes */}
        {WORKFLOW_STEPS.map((step, i) => {
          // -90 to start at top
          const angle = (i * (360 / WORKFLOW_STEPS.length) - 90) * (Math.PI / 180);
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);

          return (
            <motion.div
              key={i}
              className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full bg-[#0a0e27] border-2 border-white/10 flex items-center justify-center text-[#E5E4E2] hover:border-[#FFD700] hover:text-[#FFD700] hover:scale-110 transition-all z-10 group shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer backdrop-blur-md"
              style={{ left: x, top: y }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.3, type: "spring" }}
            >
              <step.icon className="w-7 h-7 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] transition-all" />
              
              {/* Tooltip for Desktop */}
              <div className="absolute hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-56 bg-black/95 border border-[#FFD700]/30 rounded-xl p-4 shadow-2xl backdrop-blur-xl z-50 top-1/2 -translate-y-1/2 left-full ml-6">
                 <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-[#FFD700]/30 border-b-8 border-b-transparent" />
                 <div className="text-[#FFD700] text-[10px] font-mono mb-2 uppercase tracking-widest">Stage 0{i+1}</div>
                 <div className="text-base font-bold text-white leading-tight mb-2">{step.title}</div>
                 <div className="text-xs text-[#E5E4E2]/70">{step.desc}</div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Center Node */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="w-28 h-28 rounded-full bg-[#FFD700]/5 border border-[#FFD700]/20 flex flex-col items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(255,215,0,0.15)]"
          >
             <span className="text-[#FFD700] text-[10px] font-mono tracking-[0.3em] uppercase text-center leading-relaxed">
               Infinite<br/>Loop
             </span>
          </motion.div>
        </div>
      </div>

      {/* RIGHT: Mobile List View & Description */}
      <div className="w-full max-w-md lg:max-w-sm space-y-6 z-10 relative">
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-[#FFD700] font-mono text-xs uppercase tracking-[0.4em] mb-4">Operations</h2>
          <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 text-white font-serif">
            Continuous <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Evolution.</span>
          </h3>
          <p className="text-[#E5E4E2]/80 font-light leading-relaxed mb-8">
            Our workflows are orbital, not linear. We maintain sites, servers, and deploy constant iterative upgrades through robust CI/CD pipelines, ensuring your systems continuously evolve and never stagnate.
          </p>
        </motion.div>

        {/* Mobile only list */}
        <div className="lg:hidden space-y-3">
          {WORKFLOW_STEPS.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 border border-white/5 rounded-2xl bg-white/5 hover:border-[#FFD700]/30 transition-colors"
            >
               <div className="p-3 bg-[#0a0e27] border border-[#FFD700]/20 rounded-xl text-[#FFD700]">
                 <step.icon className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-white text-sm mb-1">{step.title}</h4>
                 <p className="text-[10px] text-[#E5E4E2]/60 uppercase tracking-widest">{step.desc}</p>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
