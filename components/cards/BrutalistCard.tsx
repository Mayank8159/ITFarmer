"use client";

import React from "react";
import { motion } from "framer-motion";

interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  whiteBg?: boolean;
}

export default function BrutalistCard({ children, className = "", whiteBg = false }: BrutalistCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, x: -6, scale: 1.02, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative ${whiteBg ? 'brutalist-panel-white' : 'brutalist-panel'} overflow-hidden transition-all duration-200 ${className} group`}
    >
      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-black/30 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-black/30 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-black/30 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-black/30 pointer-events-none" />

      <div className="relative z-10 w-full h-full p-8 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
