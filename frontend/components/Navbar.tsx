"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orbit, Menu, X, LogIn, LogOut, Mail, Check, Shield } from "lucide-react";
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
  const { isLoggedIn, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const companyEmail = "team.techserve55@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(companyEmail);
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

  const userInitial = user ? user.charAt(0).toUpperCase() : "O";

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

      <div className="relative flex items-center justify-between gap-2 md:gap-4 rounded-full bg-black/80 p-1.5 md:px-3 md:py-2 shadow-2xl border border-white/10 backdrop-blur-xl">
        
        {/* LEFT: LOGO & CONTACT NODE */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate("/")}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-white via-zinc-200 to-zinc-400 shadow-xl border border-white/20"
          >
            <Orbit className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>

          {/* REFINED CONTACT NODE */}
          <button 
            onClick={handleCopy}
            className={`
              hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full 
              border transition-all duration-300 group/contact
              ${copied 
                ? "bg-green-500/10 border-green-500/50 text-green-400" 
                : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/30 hover:bg-white/10"
              }
            `}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="w-3 h-3" />
                </motion.div>
              ) : (
                <motion.div key="mail" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Shield className="w-3 h-3 text-zinc-500 group-hover/contact:text-white transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-medium">
              {copied ? "Copied!" : "COPY_CONTACT"}
            </span>
          </button>
        </div>

        {/* MIDDLE: DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, path }) => (
            <motion.li
              key={label}
              onClick={() => navigate(path)}
              className="px-4 py-2 cursor-pointer rounded-full hover:bg-white/5 transition-colors relative group/link"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover/link:text-white transition-colors">
                {label}
              </div>
            </motion.li>
          ))}
        </ul>

        {/* RIGHT: AUTH ACTIONS */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.button
                key="login-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => navigate("/login")}
                className="relative h-10 flex items-center gap-2 rounded-full bg-white text-black px-6 shadow-lg active:scale-95 transition-all hover:bg-zinc-200"
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Login</span>
              </motion.button>
            ) : (
              <motion.div 
                key="user-profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 pl-1 pr-3">
                  {/* METALLIC LOGO WITH INITIAL */}
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-900 font-bold text-[10px] bg-gradient-to-br from-[#ffffff] via-[#d1d5db] to-[#9ca3af] shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.5)] relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-60 pointer-events-none" />
                    <span className="relative z-10">{userInitial}</span>
                  </div>

                  {/* USERNAME ONLY */}
                  <div className="flex flex-col">
                    <span className="hidden lg:block text-[9px] font-mono text-white uppercase tracking-tighter max-w-[80px] truncate leading-none">
                      {user?.split('@')[0] || "OPERATIVE"}
                    </span>
                    <span className="hidden lg:block text-[7px] font-mono text-zinc-600 uppercase tracking-widest leading-none mt-1">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="h-4 w-px bg-white/10 mx-1" />

                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="h-8 w-8 rounded-full bg-zinc-900 hover:bg-red-500/20 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all active:scale-90"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/10 ml-2"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 left-0 right-0 p-4 rounded-[2rem] bg-black border border-white/10 shadow-2xl md:hidden flex flex-col gap-1 backdrop-blur-2xl"
          >
            {NAV_LINKS.map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full py-4 text-left px-5 rounded-2xl hover:bg-white/5 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors"
              >
                {label}
              </button>
            ))}
            <button 
              onClick={handleCopy} 
              className="w-full py-4 text-left px-5 rounded-2xl bg-white/5 text-zinc-300 text-[10px] font-mono uppercase tracking-[0.2em] mt-2 border border-white/5"
            >
              {copied ? "Address Copied" : "Copy Contact Email"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}