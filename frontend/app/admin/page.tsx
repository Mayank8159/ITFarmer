"use client";

import React, { useState, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";
import { 
  LayoutGrid, Users, Zap, Plus, Trash2, 
  Send, ShieldCheck, Database, BarChart3, Loader2 
} from "lucide-react";

/* COMPONENTS */
import SmokeBackground from "@/components/SmokeBackground";
import FloatingNavbar from "@/components/Navbar";

export default function AdminDashboard(): JSX.Element {
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("broadcast");

  // This would ideally be fetched from your backend
  const stats = [
    { label: "Active Nodes", value: "12", icon: <Database className="w-4 h-4" /> },
    { label: "System Uptime", value: "99.9%", icon: <Zap className="w-4 h-4" /> },
    { label: "Total Updates", value: "148", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);
    
    // Simulate API Call to your backend (e.g., http://localhost:8000/updates)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsPublishing(false);
    alert("Protocol Synchronized: Update Broadcasted to Global Network.");
  };

  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      <main className="relative min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden">
        <div className="fixed inset-0 z-0">
          <SmokeBackground />
        </div>

        <FloatingNavbar />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
          
          {/* ADMIN HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.4em]">Root Access Granted</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Command <span className="text-zinc-600">Center</span>
              </h1>
            </div>

            {/* QUICK STATS */}
            <div className="flex gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    {stat.icon}
                    <span className="text-[9px] font-mono uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className="text-xl font-bold font-mono">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SIDEBAR NAVIGATION */}
            <div className="lg:col-span-3 space-y-2">
              <AdminNavButton 
                active={activeTab === "broadcast"} 
                onClick={() => setActiveTab("broadcast")}
                icon={<Plus />} label="New Broadcast" 
              />
              <AdminNavButton 
                active={activeTab === "manage"} 
                onClick={() => setActiveTab("manage")}
                icon={<LayoutGrid />} label="Manage Feed" 
              />
              <AdminNavButton 
                active={activeTab === "users"} 
                onClick={() => setActiveTab("users")}
                icon={<Users />} label="Operator List" 
              />
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {activeTab === "broadcast" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-zinc-950/80 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl"
                  >
                    <form onSubmit={handleBroadcast} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Update Category</label>
                          <select name="category" className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                            <option value="project">Project Deployment</option>
                            <option value="team">Personnel Shift</option>
                            <option value="update">System Patch</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Entry Title</label>
                          <input type="text" name="title" required placeholder="Project Nebula..." className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Data Transmission (Description)</label>
                        <textarea name="description" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm h-32 resize-none focus:outline-none focus:border-blue-500 transition-all" placeholder="Enter technical summary..."></textarea>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Asset URL (Image)</label>
                          <input type="text" name="image" placeholder="https://unsplash.com/..." className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Tags (Comma Separated)</label>
                          <input type="text" name="tags" placeholder="Next.js, Python, AWS" className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                      </div>

                      <button 
                        disabled={isPublishing}
                        className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Initialize Broadcast</>}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </ReactLenis>
  );
}

/* UI HELPER COMPONENTS */

function AdminNavButton({ active, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-mono uppercase tracking-widest transition-all ${
        active 
          ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]" 
          : "bg-zinc-950/50 text-zinc-500 border border-white/5 hover:border-white/20"
      }`}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
      {label}
    </button>
  );
}