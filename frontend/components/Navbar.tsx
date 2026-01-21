"use client";

import React, { useState, JSX } from "react";
import { Orbit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = ["Work", "About", "Playground", "Resource"];

export default function FloatingNavbar(): JSX.Element {
  const [copied, setCopied] = useState(false);
  const email = "ihyaet@gmail.com";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 z-[100] -translate-x-1/2 group">
      {/* COSMIC GLOW */}
      <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 opacity-20 blur-md group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-center justify-between gap-4 rounded-full bg-zinc-950 px-3 py-2 shadow-2xl border border-white/10">
        
        {/* LOGO */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shrink-0 overflow-hidden">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="flex items-center justify-center"
          >
            <Orbit className="h-5 w-5 text-black" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* NAVIGATION LINKS */}
        <ul className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <motion.li 
              key={link} 
              className="px-2 cursor-pointer [perspective:1000px]"
              initial="initial"
              whileHover="hover" // Trigger child animation from parent
            >
              <motion.div
                variants={{
                  initial: { rotateX: 0, color: "#a1a1aa" },
                  hover: { rotateX: 360, color: "#ffffff" }
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-sm font-medium [transform-style:preserve-3d]"
              >
                <span className="block [backface-visibility:hidden]">
                  {link}
                </span>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {/* EMAIL BUTTON */}
        <motion.button
          onClick={handleCopy}
          initial="initial"
          whileHover="hover" // Trigger child flip from parent button
          className="relative h-10 min-w-[165px] flex items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-black hover:bg-zinc-100 transition-colors [perspective:1000px] overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!copied ? (
              <motion.span
                key="email"
                variants={{
                  initial: { rotateX: 0 },
                  hover: { rotateX: 360 }
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="block [transform-style:preserve-3d] [backface-visibility:hidden]"
              >
                {email}
              </motion.span>
            ) : (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-blue-600 font-extrabold"
              >
                COPIED!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </nav>
  );
}