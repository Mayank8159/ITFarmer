"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Upload, Save, X, Activity, Image as ImageIcon,
  Inbox, LayoutDashboard, Users, FileText, LogOut, CheckCircle,
  Plus, Trash2, ShieldAlert, Star, Quote
} from "lucide-react";

import {
  saveHeroContent,
  saveAboutContent,
  savePostsContent,
  uploadFile,
  getInquiries,
  getHeroData,
  getAboutData,
  getPostsData,
  clearAllInquiries,
  deleteInquiry,
  getClientsData,
  saveClientsContent
} from "@/app/actions/adminActions";

// Initial empty fallback data (Harmonized to support both 'text' and 'label' for CTAs)
const fallbackHero = {
  headline: "",
  subheadline: "",
  primaryCta: { text: "", label: "", href: "" },
  secondaryCta: { text: "", label: "", href: "" },
  trustStack: [],
  metrics: []
};

type ViewMode = "terminal" | "inquiries" | "hero" | "founders" | "posts" | "clients";

interface HistoryLine {
  text: string;
  isCommand: boolean;
  color?: string;
}

// ROBUST INPUT STYLES (Replaces the missing "input-field" class)
const inputClass = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-all placeholder:text-zinc-600 font-mono text-sm";
const textareaClass = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-all placeholder:text-zinc-600 font-mono text-sm resize-none min-h-[100px]";

export default function AdminDashboard() {
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Terminal State
  const [history, setHistory] = useState<HistoryLine[]>([
    { text: "IT FARM SECURE TERMINAL v1.0.0", isCommand: false, color: "text-[#00FF41]" },
    { text: "CONNECTION ESTABLISHED. ROOT ACCESS GRANTED.", isCommand: false, color: "text-zinc-500" }
  ]);
  const [cmdInput, setCmdInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // App State
  const [viewMode, setViewMode] = useState<ViewMode>("terminal");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Data State
  const [heroData, setHeroData] = useState<any>(fallbackHero);
  const [aboutData, setAboutData] = useState<any[]>([]);
  const [postsData, setPostsData] = useState<any[]>([]);
  const [inquiriesData, setInquiriesData] = useState<any[]>([]);
  const [clientsData, setClientsData] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, postsRes, inqRes, clientsRes] = await Promise.all([
          getHeroData(),
          getAboutData(),
          getPostsData(),
          getInquiries(),
          getClientsData()
        ]);

        if (heroRes) setHeroData({ ...fallbackHero, ...heroRes });
        if (aboutRes) setAboutData(aboutRes);
        if (postsRes) setPostsData(postsRes);
        if (inqRes) setInquiriesData(inqRes);
        if (clientsRes) setClientsData(clientsRes);
      } catch (e) {
        console.error("Failed to load CMS data:", e);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Terminal auto-scroll
  useEffect(() => {
    if (viewMode === "terminal") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, viewMode]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Neural@123#") {
      setIsAuthenticated(true);
    } else {
      alert("ACCESS DENIED.");
    }
  };

  // Command Handler
  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, { text: `root@itfarmer:~# ${trimmed}`, isCommand: true }]);

    const lowerCmd = trimmed.toLowerCase();
    switch (lowerCmd) {
      case "help":
        setHistory(prev => [
          ...prev,
          { text: "Available commands:", isCommand: false },
          { text: "  clear       - Clear terminal output", isCommand: false },
          { text: "  exit        - Return to main site", isCommand: false }
        ]);
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        router.push("/");
        break;
      default:
        setHistory(prev => [...prev, { text: `Command not found: ${trimmed}`, isCommand: false, color: "text-red-400" }]);
    }
  };

  const onCmdKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(cmdInput);
      setCmdInput("");
    }
  };

  // Save Handlers
  const triggerSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const onSaveHero = async () => {
    setIsSaving(true);
    await saveHeroContent(heroData);
    setIsSaving(false);
    triggerSuccess("Hero configuration updated.");
  };

  const onSaveAbout = async () => {
    setIsSaving(true);
    await saveAboutContent(aboutData);
    setIsSaving(false);
    triggerSuccess("Founders roster updated.");
  };

  const onSavePosts = async () => {
    setIsSaving(true);
    await savePostsContent(postsData);
    setIsSaving(false);
    triggerSuccess("Intelligence feed updated.");
  };

  const onSaveClients = async () => {
    setIsSaving(true);
    await saveClientsContent(clientsData);
    setIsSaving(false);
    triggerSuccess("Client deployments updated.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, directory: string): Promise<string | null> => {
    const file = e.target.files?.[0];
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("directory", directory);
    try {
      const res = await uploadFile(formData);
      if (res.success && res.filePath) return res.filePath;
      alert("Upload failed: " + (res.error || "Unknown error"));
    } catch (err) {
      alert("Upload failed: Network error");
    }
    return null;
  };

  // CRUD Operations
  const addFounder = () => {
    setAboutData([{ id: Date.now().toString(), name: "", role: "", image: "", description: "" }, ...aboutData]);
  };
  const removeFounder = (id: string) => {
    setAboutData(aboutData.filter(d => d.id !== id));
  };

  const addPost = () => {
    setPostsData([{ id: Date.now().toString(), title: "", description: "", category: "Update", date: new Date().toISOString().split('T')[0], image: "" }, ...postsData]);
  };
  const removePost = (id: string) => {
    setPostsData(postsData.filter(d => d.id !== id));
  };

  const addClient = () => {
    setClientsData([{ id: Date.now().toString(), name: "", role: "", content: "", avatar: "", glow: "rgba(255, 215, 0, 0.5)" }, ...clientsData]);
  };
  const removeClient = (id: string) => {
    setClientsData(clientsData.filter(d => d.id !== id));
  };

  const clearInquiries = async () => {
    if (confirm("Are you sure you want to permanently delete all inquiries? This action cannot be undone.")) {
      setIsSaving(true);
      const res = await clearAllInquiries();
      setIsSaving(false);
      
      if (res.success) {
        setInquiriesData([]);
        triggerSuccess("All intelligence records purged.");
      } else {
        alert("Failed to clear inquiries: " + (res.error || "Unknown error"));
      }
    }
  };

  const deleteSingleInquiry = async (id: string) => {
    setIsSaving(true);
    const res = await deleteInquiry(id);
    setIsSaving(false);
    
    if (res.success) {
      setInquiriesData(prev => prev.filter(inq => inq.id !== id));
      triggerSuccess("Inquiry marked as done.");
    } else {
      alert("Failed to clear inquiry: " + (res.error || "Unknown error"));
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#020202] text-[#00FF41] font-mono flex items-center justify-center selection:bg-[#00FF41]/30">
        <div className="max-w-md w-full p-8 border border-[#00FF41]/30 bg-[#00FF41]/5 rounded-2xl shadow-[0_0_50px_rgba(0,255,65,0.1)]">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Terminal className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-widest">IT_FARM_SYS</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest text-zinc-500 uppercase">Authorization Required</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full bg-black border border-[#00FF41]/30 px-4 py-3 outline-none focus:border-[#00FF41] text-[#E5E4E2] font-mono rounded-lg"
                placeholder="Enter password..."
              />
            </div>
            <button type="submit" className="w-full bg-[#00FF41]/20 hover:bg-[#00FF41]/40 border border-[#00FF41] text-[#00FF41] py-3 tracking-widest text-sm font-bold transition-colors rounded-lg">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-[#E5E4E2] font-sans flex selection:bg-[#FFD700]/30 h-screen overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0e27]/40 backdrop-blur-3xl flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-[#FFD700]" />
            <h1 className="text-lg font-bold tracking-widest text-white font-serif italic uppercase">Command</h1>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-green-400">
            <Activity className="w-3 h-3 animate-pulse" /> Network Secure
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarBtn active={viewMode === "terminal"} onClick={() => setViewMode("terminal")} icon={Terminal} label="Terminal" />
          <SidebarBtn active={viewMode === "inquiries"} onClick={() => setViewMode("inquiries")} icon={Inbox} label="Inquiries" badge={inquiriesData.length} />

          <div className="pt-6 pb-2 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600 px-4">Content System</div>
          <SidebarBtn active={viewMode === "hero"} onClick={() => setViewMode("hero")} icon={LayoutDashboard} label="Hero Editor" />
          <SidebarBtn active={viewMode === "founders"} onClick={() => setViewMode("founders")} icon={Users} label="Founders CMS" />
          <SidebarBtn active={viewMode === "posts"} onClick={() => setViewMode("posts")} icon={FileText} label="Posts CMS" />
          <SidebarBtn active={viewMode === "clients"} onClick={() => setViewMode("clients")} icon={Star} label="Clients CMS" />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => { setIsAuthenticated(false); setPasswordInput(""); router.push("/"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 relative flex flex-col bg-[#020202]">
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Global Save Success Toast */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="absolute top-6 left-1/2 z-50 bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.2)] backdrop-blur-xl text-xs font-bold uppercase tracking-widest"
            >
              <CheckCircle className="w-4 h-4" /> {saveSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-8 h-full flex flex-col relative z-10">

            {/* 1. TERMINAL VIEW */}
            {viewMode === "terminal" && (
              <div className="flex-1 flex flex-col bg-[#050505] border border-[#00FF41]/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,65,0.05)] overflow-hidden font-mono text-[#00FF41]">
                <div className="bg-[#00FF41]/10 px-4 py-2 border-b border-[#00FF41]/30 text-[10px] tracking-widest uppercase flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> Root Console
                </div>
                <div className="flex-1 overflow-y-auto p-4" onClick={() => inputRef.current?.focus()}>
                  {history.map((line, idx) => (
                    <div key={idx} className={`${line.color || "text-[#E5E4E2]"}`}>{line.text}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[#E5E4E2]">
                    <span className="text-[#00FF41]">root@itfarmer:~#</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={cmdInput}
                      onChange={(e) => setCmdInput(e.target.value)}
                      onKeyDown={onCmdKeyDown}
                      className="flex-1 bg-transparent border-none outline-none text-[#E5E4E2]"
                      spellCheck={false}
                      autoFocus
                    />
                  </div>
                  <div ref={bottomRef} />
                </div>
              </div>
            )}

            {/* 2. INQUIRIES VIEW */}
            {viewMode === "inquiries" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white font-serif">Mission Inquiries</h2>
                  <button onClick={clearInquiries} className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-red-400 transition-colors font-mono flex items-center gap-2 self-start md:self-auto">
                    <Trash2 className="w-3 h-3" /> Clear Intel
                  </button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-black/40 border-b border-white/10 text-zinc-500 uppercase tracking-[0.2em] text-[9px] font-mono">
                          <th className="p-6 font-normal whitespace-nowrap">Date / Time</th>
                          <th className="p-6 font-normal">Client Identifier</th>
                          <th className="p-6 font-normal">Service</th>
                          <th className="p-6 font-normal">Budget</th>
                          <th className="p-6 font-normal w-1/3">Mission Brief</th>
                          <th className="p-6 font-normal text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {inquiriesData.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                              <ShieldAlert className="w-8 h-8 mx-auto mb-4 opacity-50" />
                              No incoming intelligence detected.
                            </td>
                          </tr>
                        ) : (
                          inquiriesData.map((inq, index) => (
                            <motion.tr
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              key={inq.id}
                              className="hover:bg-white/5 transition-colors group"
                            >
                              <td className="p-6">
                                <div className="text-white font-mono text-xs">{inq.date}</div>
                                <div className="text-zinc-500 font-mono text-[10px]">{inq.time}</div>
                              </td>
                              <td className="p-6">
                                <div className="font-bold text-[#FFD700] text-base">{inq.name}</div>
                                <div className="text-zinc-400 text-xs mt-1">{inq.company || "Unknown Entity"}</div>
                                <div className="text-zinc-600 font-mono text-[10px] mt-1 break-all">{inq.email}</div>
                              </td>
                              <td className="p-6">
                                <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest group-hover:bg-[#FFD700]/20 group-hover:text-[#FFD700] transition-colors">{inq.service}</span>
                              </td>
                              <td className="p-6 font-mono text-white text-xs">{inq.budget || "-"}</td>
                              <td className="p-6 text-zinc-400 font-light text-sm line-clamp-3 md:line-clamp-none max-w-sm">
                                {inq.message}
                              </td>
                              <td className="p-6 text-right">
                                <button
                                  onClick={() => deleteSingleInquiry(inq.id)}
                                  className="px-3 py-1.5 bg-[#00FF41]/10 text-[#00FF41] hover:bg-[#00FF41]/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 ml-auto"
                                >
                                  <CheckCircle className="w-3 h-3" /> Done
                                </button>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. HERO EDITOR */}
            {viewMode === "hero" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header title="Hero Section Configuration" onSave={onSaveHero} isSaving={isSaving} />
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl">
                  <Field label="HEADLINE">
                    <input type="text" value={heroData.headline || ""} onChange={e => setHeroData({ ...heroData, headline: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="SUBHEADLINE">
                    <textarea value={heroData.subheadline || ""} onChange={e => setHeroData({ ...heroData, subheadline: e.target.value })} className={textareaClass} />
                  </Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="PRIMARY CTA TEXT">
                      <input type="text" value={heroData.primaryCta?.text || heroData.primaryCta?.label || ""} onChange={e => setHeroData({ ...heroData, primaryCta: { ...(heroData.primaryCta || {}), text: e.target.value, label: e.target.value } })} className={inputClass} />
                    </Field>
                    <Field label="SECONDARY CTA TEXT">
                      <input type="text" value={heroData.secondaryCta?.text || heroData.secondaryCta?.label || ""} onChange={e => setHeroData({ ...heroData, secondaryCta: { ...(heroData.secondaryCta || {}), text: e.target.value, label: e.target.value } })} className={inputClass} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="PRIMARY CTA HREF">
                      <input type="text" value={heroData.primaryCta?.href || ""} onChange={e => setHeroData({ ...heroData, primaryCta: { ...(heroData.primaryCta || {}), href: e.target.value } })} className={inputClass} />
                    </Field>
                    <Field label="SECONDARY CTA HREF">
                      <input type="text" value={heroData.secondaryCta?.href || ""} onChange={e => setHeroData({ ...heroData, secondaryCta: { ...(heroData.secondaryCta || {}), href: e.target.value } })} className={inputClass} />
                    </Field>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. FOUNDERS EDITOR */}
            {viewMode === "founders" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header
                  title="Founders Roster"
                  onSave={onSaveAbout}
                  isSaving={isSaving}
                  actionButton={
                    <button onClick={addFounder} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-[#FFD700]">
                      <Plus className="w-4 h-4" /> Add Profile
                    </button>
                  }
                />

                {aboutData.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                    <Users className="w-12 h-12 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2 font-serif italic">No Founders Data</h3>
                    <p className="text-zinc-500 text-sm mb-6 max-w-sm">Your roster is currently empty. Add a profile to populate the about section.</p>
                    <button onClick={addFounder} className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-[#0a0e27] rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all">
                      <Plus className="w-4 h-4" /> Initialize First Profile
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {aboutData.map((dev, index) => (
                        <motion.div
                          layout
                          key={dev.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-3xl p-6 relative backdrop-blur-xl group hover:border-[#FFD700]/30 transition-colors"
                        >
                          <button
                            onClick={() => removeFounder(dev.id)}
                            className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex flex-col md:flex-row items-start gap-6 mt-2">
                            <div className="flex flex-col items-center gap-3 shrink-0">
                              <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                                {dev.image ? <img src={dev.image} className="w-full h-full object-cover" alt="Founder" /> : <ImageIcon className="w-6 h-6 text-zinc-600" />}
                              </div>
                              <label className="cursor-pointer text-[9px] uppercase tracking-widest text-zinc-500 hover:text-[#FFD700] transition-colors border border-white/10 px-3 py-1.5 rounded-lg hover:border-[#FFD700]/30 bg-black/50 text-center w-full">
                                Upload Photo
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                  const path = await handleFileUpload(e, "founders");
                                  if (path) { const n = [...aboutData]; n[index].image = path; setAboutData(n); }
                                }} />
                              </label>
                            </div>
                            <div className="flex-1 w-full space-y-4">
                              <Field label="NAME"><input type="text" value={dev.name || ""} onChange={e => { const n = [...aboutData]; n[index].name = e.target.value; setAboutData(n); }} className={inputClass} placeholder="John Doe" /></Field>
                              <Field label="ROLE"><input type="text" value={dev.role || ""} onChange={e => { const n = [...aboutData]; n[index].role = e.target.value; setAboutData(n); }} className={inputClass} placeholder="Security Architect" /></Field>
                              <Field label="DESCRIPTION"><textarea value={dev.description || ""} onChange={e => { const n = [...aboutData]; n[index].description = e.target.value; setAboutData(n); }} className={textareaClass} placeholder="Brief bio..." /></Field>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. POSTS EDITOR */}
            {viewMode === "posts" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header
                  title="Intelligence Feed"
                  onSave={onSavePosts}
                  isSaving={isSaving}
                  actionButton={
                    <button onClick={addPost} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-[#00FF41]">
                      <Plus className="w-4 h-4" /> Compose Briefing
                    </button>
                  }
                />

                {postsData.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                    <FileText className="w-12 h-12 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2 font-serif italic">No Intelligence Discovered</h3>
                    <p className="text-zinc-500 text-sm mb-6 max-w-sm">The feed is currently empty. Broadcast a new mission update to the network.</p>
                    <button onClick={addPost} className="flex items-center gap-2 px-6 py-3 bg-[#00FF41] text-[#050505] rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all">
                      <Plus className="w-4 h-4" /> Initialize Post
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {postsData.map((post, index) => (
                        <motion.div
                          layout
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl group hover:border-[#FFD700]/30 transition-colors flex flex-col relative"
                        >
                          <button
                            onClick={() => removePost(post.id)}
                            className="absolute top-4 right-4 z-10 p-2 bg-red-500/10 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {post.image ? (
                            <div className="w-full h-32 rounded-xl border border-white/10 overflow-hidden mb-4 bg-black relative">
                              <img src={post.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Post cover" />
                              <label className="absolute bottom-2 right-2 cursor-pointer text-[9px] bg-black/60 backdrop-blur-md uppercase tracking-widest text-white border border-white/20 px-3 py-1.5 rounded-lg hover:border-[#FFD700] hover:text-[#FFD700] transition-all shadow-xl">
                                Change Cover
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                  const path = await handleFileUpload(e, "posts");
                                  if (path) { const n = [...postsData]; n[index].image = path; setPostsData(n); }
                                }} />
                              </label>
                            </div>
                          ) : (
                            <label className="mb-4 mt-8 w-full h-12 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-xs text-zinc-500 uppercase tracking-widest hover:border-[#FFD700] hover:text-[#FFD700] transition-colors cursor-pointer bg-white/5">
                              Upload Cover Image
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                const path = await handleFileUpload(e, "posts");
                                if (path) { const n = [...postsData]; n[index].image = path; setPostsData(n); }
                              }} />
                            </label>
                          )}

                          <div className="space-y-4 flex-1 flex flex-col">
                            <Field label="TITLE"><input type="text" value={post.title || ""} onChange={e => { const n = [...postsData]; n[index].title = e.target.value; setPostsData(n); }} className={inputClass} placeholder="Zero Trust Infrastructure..." /></Field>
                            <Field label="DESCRIPTION"><textarea value={post.description || ""} onChange={e => { const n = [...postsData]; n[index].description = e.target.value; setPostsData(n); }} className={textareaClass} placeholder="Detailed analysis of..." /></Field>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Field label="CATEGORY">
                                <select value={post.category || "Update"} onChange={e => { const n = [...postsData]; n[index].category = e.target.value; setPostsData(n); }} className={`${inputClass} cursor-pointer`}>
                                  <option value="Project">Project</option>
                                  <option value="Team">Team</option>
                                  <option value="Update">Update</option>
                                </select>
                              </Field>
                              <Field label="DATE"><input type="date" value={post.date || ""} onChange={e => { const n = [...postsData]; n[index].date = e.target.value; setPostsData(n); }} className={`${inputClass} [color-scheme:dark]`} /></Field>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* 6. CLIENTS EDITOR */}
            {viewMode === "clients" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header
                  title="Client Deployments"
                  onSave={onSaveClients}
                  isSaving={isSaving}
                  actionButton={
                    <button onClick={addClient} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-[#FFD700]">
                      <Plus className="w-4 h-4" /> Add Client
                    </button>
                  }
                />

                {clientsData.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                    <Quote className="w-12 h-12 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2 font-serif italic">No Client Data</h3>
                    <p className="text-zinc-500 text-sm mb-6 max-w-sm">Your client roster is currently empty. Add a profile to populate the testimonials section.</p>
                    <button onClick={addClient} className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-[#0a0e27] rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all">
                      <Plus className="w-4 h-4" /> Initialize First Client
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {clientsData.map((client, index) => (
                        <motion.div
                          layout
                          key={client.id || index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-3xl p-6 relative backdrop-blur-xl group hover:border-[#FFD700]/30 transition-colors"
                        >
                          <button
                            onClick={() => removeClient(client.id)}
                            className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
                            title="Delete Client"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex flex-col md:flex-row items-start gap-6 mt-2">
                            <div className="flex flex-col items-center gap-3 shrink-0">
                              <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                                {client.avatar ? <img src={client.avatar} className="w-full h-full object-cover" alt="Client Avatar" /> : <ImageIcon className="w-6 h-6 text-zinc-600" />}
                              </div>
                              <label className="cursor-pointer text-[9px] uppercase tracking-widest text-zinc-500 hover:text-[#FFD700] transition-colors border border-white/10 px-3 py-1.5 rounded-lg hover:border-[#FFD700]/30 bg-black/50 text-center w-full">
                                Upload Photo
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                  const path = await handleFileUpload(e, "clients");
                                  if (path) { const n = [...clientsData]; n[index].avatar = path; setClientsData(n); }
                                }} />
                              </label>
                            </div>
                            <div className="flex-1 w-full space-y-4">
                              <Field label="NAME"><input type="text" value={client.name || ""} onChange={e => { const n = [...clientsData]; n[index].name = e.target.value; setClientsData(n); }} className={inputClass} placeholder="Alexander Volkov" /></Field>
                              <Field label="ROLE"><input type="text" value={client.role || ""} onChange={e => { const n = [...clientsData]; n[index].role = e.target.value; setClientsData(n); }} className={inputClass} placeholder="CTO, Nexus Dynamics" /></Field>
                              <Field label="CONTENT"><textarea value={client.content || ""} onChange={e => { const n = [...clientsData]; n[index].content = e.target.value; setClientsData(n); }} className={textareaClass} placeholder="Testimonial content..." /></Field>
                              <Field label="GLOW COLOR"><input type="text" value={client.glow || ""} onChange={e => { const n = [...clientsData]; n[index].glow = e.target.value; setClientsData(n); }} className={inputClass} placeholder="rgba(255, 215, 0, 0.5)" /></Field>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS ---
function SidebarBtn({ active, onClick, icon: Icon, label, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active
        ? "bg-[#FFD700]/10 text-[#FFD700] font-bold border border-[#FFD700]/20"
        : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? "text-[#FFD700]" : "text-zinc-500"}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${active ? "bg-[#FFD700] text-[#0a0e27]" : "bg-white/10 text-white"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono ml-1">{label}</label>
      {children}
    </div>
  );
}

function Header({ title, onSave, isSaving, actionButton }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white font-serif">{title}</h2>
        {actionButton}
      </div>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="px-8 py-3 bg-white text-[#0a0e27] font-black uppercase tracking-widest text-xs hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#B8860B] hover:text-white rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,215,0,0.15)]"
      >
        {isSaving ? (
          <><span className="animate-spin">⟳</span> SAVING...</>
        ) : (
          <><Save className="w-4 h-4" /> COMMIT CHANGES</>
        )}
      </button>
    </div>
  );
}