// FILE: src/components/orbit/OrbitOrb.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

interface OrbitOrbProps {
  onClick: () => void;
}

export const OrbitOrb: React.FC<OrbitOrbProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="
        fixed top-4 right-4
        md:top-auto md:bottom-8
        z-50 group cursor-pointer
      "
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer Energy Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-8px] rounded-full border border-blue-500/30 border-dashed w-[calc(100%+16px)] h-[calc(100%+16px)]"
      />

      {/* Inner Pulse Ring */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-[-4px] rounded-full bg-blue-500/20 w-[calc(100%+8px)] h-[calc(100%+8px)]"
      />

      {/* Core Unit */}
      <div className="relative w-14 h-14 rounded-full bg-black border border-blue-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)] backdrop-blur-md overflow-hidden">
        
        {/* Holographic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-transparent opacity-80" />
        
        {/* Core Icon */}
        <Cpu className="w-6 h-6 text-blue-400 z-10 relative" />
        
        {/* Active State Indicator */}
        <motion.div
          className="absolute bottom-1 w-1 h-1 bg-green-400 rounded-full z-20"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[10px] font-mono text-blue-400 tracking-[0.2em]">
          ORBIT ONLINE
        </span>
      </div>
    </motion.button>
  );
};
