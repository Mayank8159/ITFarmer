"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function ScrambleText({ text, className = "", delay = 0 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Start scrambling after the delay
    timeout = setTimeout(() => {
      let iteration = 0;
      const maxIterations = 15;
      const intervalDuration = 40; // ms per frame

      const interval = setInterval(() => {
        const scrambled = text
          .split("")
          .map((char, index) => {
            // If the character is a space, keep it
            if (char === " ") return " ";
            // Gradually reveal correct characters from left to right
            if (index < iteration / (maxIterations / text.length)) {
              return text[index];
            }
            // Otherwise, show a random character
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplayText(scrambled);

        if (iteration >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text); // Ensure final text is exact
        }

        iteration += 1;
      }, intervalDuration);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, delay }}
      className={`inline-block ${className}`}
    >
      {displayText}
    </motion.span>
  );
}
