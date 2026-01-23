"use client";

import { useState, JSX } from "react";
import { Orbit, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = ["Work", "About", "Playground", "Resource"];

export default function FloatingNavbar(): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const email = "ihyaet@gmail.com";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 z-[100] -translate-x-1/2 w-[90%] max-w-fit group">
      {/* MOVING COSMIC GLOW */}
      <div className="absolute -inset-[2px] rounded-full overflow-hidden blur-md opacity-30 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,#22d3ee_180deg,#d946ef_270deg,transparent_360deg)]"
        />
      </div>

      <div className="relative flex items-center justify-between gap-2 md:gap-4 rounded-full bg-zinc-950 p-1.5 md:px-3 md:py-2 shadow-2xl border border-white/10">
        
        {/* LOGO & MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shrink-0 overflow-hidden">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Orbit className="h-5 w-5 text-black" strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <ul className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <motion.li 
              key={link} 
              className="px-2 cursor-pointer perspective-[1000px]"
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                variants={{
                  initial: { rotateX: 0, color: "#a1a1aa" },
                  hover: { rotateX: 360, color: "#ffffff" }
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-sm font-medium transform-3d"
              >
                <span className="block backface-hidden">{link}</span>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {/* RESPONSIVE EMAIL BUTTON */}
        <motion.button
          onClick={handleCopy}
          initial="initial"
          whileHover="hover"
          className="relative h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-zinc-100 transition-colors perspective-[1000px] overflow-hidden px-4 md:px-6 md:min-w-[160px]"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-blue-600 font-extrabold text-xs md:text-sm"
              >
                COPIED!
              </motion.span>
            ) : (
              <motion.div
                key="email-container"
                variants={{
                  initial: { rotateX: 0 },
                  hover: { rotateX: 360 }
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="flex items-center justify-center transform-3d backface-hidden"
              >
                <span className="hidden md:block text-sm font-bold">{email}</span>
                <Mail className="block md:hidden h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full mt-4 left-0 right-0 p-4 rounded-3xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-xl md:hidden flex flex-col gap-4 items-center"
          >
            {NAV_LINKS.map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="text-zinc-400 hover:text-white text-lg font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}