"use client";

import { useState, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Orbit, Lock, Mail, User, ArrowRight, Loader2, ShieldAlert, Eye, EyeOff } from "lucide-react";

import FloatingNavbar from "@/components/Navbar";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://itfarmer-94dz.onrender.com";

export default function AuthPage(): JSX.Element {
  const { login, isLoggedIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    
    try {
      let res;
      if (isLogin) {
        // Login - works for both admin and consumer
        const loginData = new URLSearchParams();
        loginData.append("username", payload.username as string);
        loginData.append("password", payload.password as string);

        res = await fetch(`${API_URL}/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: loginData,
        });
      } else {
        // Register - new users are consumers by default
        res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: payload.username,
            password: payload.password,
            full_name: payload.full_name,
          }),
        });
      }

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          // Store user role (admin flag) if available
          const isAdminUser = data.is_admin || false;
          login(data.access_token, payload.username as string, isAdminUser);
          setTimeout(() => {
            window.location.href = isAdminUser ? "/admin" : "/";
          }, 100);
        } else {
          setIsLogin(true);
          alert("Identity Secured. You may now establish connection.");
        }
      } else {
        setError(data.detail || "Protocol failed. Check credentials.");
      }
    } catch (err) {
      setError("Network offline. Pulse check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#020202]">
        <FloatingNavbar />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-4 mx-auto" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Session Active. Redirecting...</p>
        </motion.div>
      </main>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <main className="relative min-h-screen w-full flex flex-col items-center bg-[#020202] selection:bg-blue-500/30 overflow-x-hidden">
        
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SmokeBackground />
        </div>

        <FloatingNavbar />

        <div className="h-32 md:h-40 w-full flex-shrink-0" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md px-6 relative z-10 flex flex-col items-center pb-20"
        >
          {/* LOGO AREA */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 180 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-6 border border-white/20"
            >
               <Orbit className="w-10 h-10 text-black" strokeWidth={2.5} />
            </motion.div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-tight">
                {isLogin ? (isAdmin ? "Admin Entry" : "Consumer Access") : "Initialize Identity"}
              </h1>
              <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.5em]">
                IT FARM SECURE NODE 01
              </p>
            </div>
          </div>

          {/* AUTH FORM CARD */}
          <div className="w-full relative group">
            <div className="absolute -inset-[1.5px] rounded-[2.6rem] overflow-hidden blur-[3px] opacity-20 group-hover:opacity-50 transition-opacity">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_180deg,#d946ef_270deg,transparent_360deg)]"
              />
            </div>

            <div className="relative bg-zinc-950/80 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
              {isLogin && (
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-[10px] font-mono uppercase text-zinc-500 mb-3">Access Level</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAdmin(false)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        !isAdmin 
                          ? "bg-blue-600 text-white border border-blue-500" 
                          : "bg-black/40 text-zinc-400 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      Consumer
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdmin(true)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        isAdmin 
                          ? "bg-red-600/80 text-white border border-red-500" 
                          : "bg-black/40 text-zinc-400 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      <ShieldAlert className="w-3 h-3" /> Admin
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {!isLogin && !isAdmin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Full Name</label>
                      <div className="relative group/input">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" />
                        <input name="full_name" type="text" required placeholder="Identification" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Email/Username</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input name="username" type="text" required placeholder="name@itfarm.io" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Security Cipher</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within/input:text-blue-500 transition-colors" />
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      placeholder="••••••••" 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-500 text-[10px] font-mono uppercase text-center tracking-tight">
                    {error}
                  </motion.div>
                )}

                <button 
                  disabled={isLoading}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{isLogin ? "Establish Connection" : "Confirm Identity"} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                {!isAdmin && (
                  <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer"
                  >
                    {isLogin ? "Request Register Protocol" : "Return to Entry Login"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <OrbitChat />
      </main>
    </ReactLenis>
  );
}