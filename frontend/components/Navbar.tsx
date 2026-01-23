"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orbit, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

export default function FloatingNavbar() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const email = "ihyaet@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const navigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <nav
      className="
        fixed top-4 left-4
        md:top-6 md:left-1/2 md:-translate-x-1/2
        z-[100] w-[90%] md:w-auto max-w-fit group
      "
    >
      {/* MOVING COSMIC GLOW */}
      <div className="absolute -inset-[2px] rounded-full overflow-hidden blur-md opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,#22d3ee_180deg,#d946ef_270deg,transparent_360deg)]"
        />
      </div>

      <div className="relative flex items-center justify-between gap-2 md:gap-4 rounded-full bg-zinc-950 p-1.5 md:px-3 md:py-2 shadow-2xl border border-white/10 backdrop-blur-md">
        
        {/* LOGO & MOBILE TOGGLE */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors active:scale-95"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            onClick={() => navigate("/")}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shrink-0 overflow-hidden"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Orbit className="h-5 w-5 text-black" strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(({ label, path }) => (
            <motion.li
              key={label}
              onClick={() => navigate(path)}
              className="px-2 cursor-pointer perspective-[1000px]"
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                variants={{
                  initial: { rotateX: 0, color: "#a1a1aa" },
                  hover: { rotateX: 360, color: "#ffffff" },
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-sm font-medium transform-3d"
              >
                <span className="block backface-hidden">{label}</span>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {/* EMAIL BUTTON */}
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
                key="email"
                variants={{
                  initial: { rotateX: 0 },
                  hover: { rotateX: 360 },
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="flex items-center justify-center transform-3d backface-hidden"
              >
                <span className="hidden md:block text-sm font-bold">
                  {email}
                </span>
                <Mail className="block md:hidden h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full mt-4 left-0 right-0 p-4 rounded-3xl bg-zinc-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl md:hidden flex flex-col gap-4 items-center"
          >
            {NAV_LINKS.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="text-zinc-400 hover:text-white text-lg font-medium transition-colors w-full text-center py-2"
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
