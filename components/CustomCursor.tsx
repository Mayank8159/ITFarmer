"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over a clickable element
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Use a slight spring for the follower
  return (
    <>
      {/* Primary Dot (instant) */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#ff6b00] rounded-none pointer-events-none z-[99999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
      
      {/* Brutalist Frame (delayed spring) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-black pointer-events-none z-[99998] flex items-center justify-center mix-blend-difference bg-white/20"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ type: "spring", mass: 0.1, stiffness: 400, damping: 20 }}
      >
        {isHovering && <div className="w-2 h-2 bg-black rotate-45" />}
      </motion.div>
    </>
  );
}
