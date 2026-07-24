"use client";

import { motion } from "framer-motion";
import { Server, Users, Cpu, ShieldCheck } from "lucide-react";

export default function HubSpokeGraph() {
  const spokes = [
    { icon: Users, label: "AI Taskforce", angle: 0 },
    { icon: Cpu, label: "Edge Computing", angle: 120 },
    { icon: ShieldCheck, label: "Cyber Ops", angle: 240 },
  ];

  const radius = 100;
  const center = 150;

  return (
    <div className="relative w-full max-w-[300px] h-[300px] mx-auto flex items-center justify-center py-6">
      <svg width="300" height="300" className="absolute inset-0 z-0">
        {spokes.map((spoke, i) => {
          const rad = (spoke.angle - 90) * (Math.PI / 180);
          const x2 = center + radius * Math.cos(rad);
          const y2 = center + radius * Math.sin(rad);

          return (
            <motion.line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255,215,0,0.3)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          );
        })}
      </svg>

      {/* Center Hub */}
      <motion.div
        className="absolute z-10 w-20 h-20 bg-[#FFD700]/10 border-2 border-[#FFD700] rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.4)] backdrop-blur-md"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <Server className="w-6 h-6 text-[#FFD700] mb-1" />
        <span className="text-[8px] font-mono text-white uppercase font-bold text-center leading-tight">Central<br/>Node</span>
      </motion.div>

      {/* Spokes Nodes */}
      {spokes.map((spoke, i) => {
        const rad = (spoke.angle - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(rad);
        const y = center + radius * Math.sin(rad);

        return (
          <motion.div
            key={i}
            className="absolute w-14 h-14 -ml-7 -mt-7 bg-[#0a0e27] border border-white/20 rounded-full flex flex-col items-center justify-center z-10 shadow-lg"
            style={{ left: x, top: y }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 + 0.5, type: "spring" }}
          >
            <spoke.icon className="w-5 h-5 text-white/70 mb-1" />
            <div className="absolute -bottom-5 text-[8px] font-mono text-[#E5E4E2]/70 uppercase whitespace-nowrap text-center font-bold bg-black/60 px-1 py-0.5 rounded">
              {spoke.label}
            </div>
          </motion.div>
        );
      })}

      {/* Pulsing data packets */}
      <svg width="300" height="300" className="absolute inset-0 z-20 pointer-events-none">
         {spokes.map((spoke, i) => {
          const rad = (spoke.angle - 90) * (Math.PI / 180);
          const x2 = center + radius * Math.cos(rad);
          const y2 = center + radius * Math.sin(rad);

          return (
            <motion.circle
              key={`pulse-${i}`}
              r="3"
              fill="#FFD700"
              initial={{ cx: center, cy: center, opacity: 0 }}
              animate={{ 
                cx: [center, x2, x2, center],
                cy: [center, y2, y2, center],
                opacity: [0, 1, 0, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear"
              }}
              className="drop-shadow-[0_0_5px_rgba(255,215,0,1)]"
            />
          );
        })}
      </svg>
    </div>
  );
}
