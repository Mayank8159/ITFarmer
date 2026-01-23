"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orbit, Mail, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Posts", path: "/posts" },
];

export default function FloatingNavbar() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const email = "team.techserve55@gmail.com";

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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] md:w-auto max-w-fit group">
      
      {/* COSMIC ROTATING GLOW */}
      <div className="absolute -inset-[2px] rounded-full overflow-hidden blur-md opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,#22d3ee_180deg,#d946ef_270deg,transparent_360deg)]"
        />
      </div>

      <div className="relative flex items-center justify-between gap-2 md:gap-4 rounded-full bg-zinc-950 p-1.5 md:px-3 md:py-2 shadow-2xl border border-white/10 backdrop-blur-md">
        
        {/* LEFT: LOGO + MOBILE TOGGLE */}
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
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-white via-zinc-100 to-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_20px_rgba(0,0,0,0.35)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-30 pointer-events-none" />
            <motion.div whileHover={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="relative z-10">
              <Orbit className="h-5 w-5 text-zinc-800" strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

        {/* MIDDLE: DESKTOP LINKS (Hidden on Mobile) */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, path }) => (
            <motion.li
              key={label}
              onClick={() => navigate(path)}
              className="px-3 py-1.5 cursor-pointer rounded-full hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                {label}
              </div>
            </motion.li>
          ))}
        </ul>

        {/* RIGHT: ACTIONS (Auth & Hidden Contact on Mobile) */}
        <div className="flex items-center gap-2">
          
          {/* Desktop Only Email Button */}
          <motion.button
            onClick={handleCopy}
            className="relative h-9 hidden md:flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 px-4 text-zinc-400 hover:text-white transition-all overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="copied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-blue-400 uppercase">Copied!</motion.span>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-mono hidden lg:block uppercase tracking-widest">{email}</span>
                </div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="h-6 w-px bg-white/10 hidden md:block mx-1" />

          {/* AUTH SECTION - Optimized for Mobile Scale */}
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.button
                key="login-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => navigate("/login")}
                className="
                  relative h-9 md:h-10 flex items-center gap-2 rounded-full
                  bg-gradient-to-br from-white via-zinc-100 to-zinc-300
                  text-black px-4 md:px-6 shadow-lg active:scale-95 transition-all
                "
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={3} />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tighter">Login</span>
              </motion.button>
            ) : (
              <motion.div 
                key="user-profile"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 md:gap-2"
              >
                <div className="h-9 w-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <User className="h-4 w-4" />
                </div>

                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="h-9 w-9 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU - Fixed UI for smaller screens */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur to focus on menu */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-3 left-0 right-0 p-5 rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl md:hidden flex flex-col gap-2 overflow-hidden"
            >
              {/* Menu Links */}
              {NAV_LINKS.map(({ label, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="w-full py-4 text-left px-6 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-[0.3em] transition-all border-b border-white/5 last:border-none"
                >
                  {label}
                </button>
              ))}

              {/* Mobile Only: Quick Email Action */}
              <button 
                onClick={handleCopy}
                className="mt-2 flex items-center justify-between w-full py-4 px-6 rounded-2xl bg-white/5 text-zinc-300 active:bg-white/10"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest">{copied ? "Copied!" : "Copy Contact"}</span>
                <Mail className="h-4 w-4 text-zinc-500" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}