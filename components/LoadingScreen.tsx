"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Slower counter effect
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3; // Smaller jumps so it takes longer
      });
    }, 80);

    // Unmount after animation finishes to free up DOM
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Increased unmount time to allow for the longer animation

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Use 6 columns for the staggered curtain effect
  const columns = 6;

  // We only want to run this once on initial page load / refresh
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[99999] flex pointer-events-auto">
          {/* Central Logo / Text that fades out just before curtain drops */}
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
          >
            <h1 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-lg mix-blend-difference mb-4">
              SYSTEM BOOT
            </h1>
            <div className="text-[#ff6b00] font-mono text-4xl md:text-6xl font-bold tracking-widest drop-shadow-lg">
              {Math.min(counter, 100)}%
            </div>
          </motion.div>

          {/* Staggered Columns */}
          {[...Array(columns)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "0%" }}
              animate={{ y: "-100%" }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1], // Brutalist sharp snap curve
                delay: 2.0 + (columns - 1 - i) * 0.1, // Stagger from right to left, starting at 2.0s
              }}
              className="h-full flex-1 bg-[#ff6b00]"
              style={{
                borderRight: i === columns - 1 ? "none" : "1px solid rgba(0,0,0,0.1)"
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
