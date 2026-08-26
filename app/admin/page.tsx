"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Upload, Save, X, Activity, Image as ImageIcon,
  Inbox, LayoutDashboard, Users, FileText, LogOut, CheckCircle,
  Plus, Trash2, ShieldAlert, Star, Quote, Server, Eye, EyeOff
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
  saveClientsContent,
  getFaqData,
  saveFaqContent,
  getEcosystemData,
  saveEcosystemContent,
  getSystemConfig,
  saveSystemConfig,
  saveAboutConfig,
  getAboutConfig,
  authenticateAdmin,
  finalizeAdminEdits
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

type ViewMode = "terminal" | "inquiries" | "hero" | "founders" | "works" | "posts" | "faqs" | "ecosystem" | "system" | "about_cms";

interface HistoryLine {
  text: string;
  isCommand: boolean;
  color?: string;
}

// Brutalist styles
const inputClass = "w-full bg-[var(--deep-surface)] border border-[var(--border-color)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--border-active)] transition-all placeholder:text-[var(--text-muted)] font-mono text-sm brutalist-border focus:shadow-[4px_4px_0px_var(--border-color)]";
const textareaClass = "w-full bg-[var(--deep-surface)] border border-[var(--border-color)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--border-active)] transition-all placeholder:text-[var(--text-muted)] font-mono text-sm resize-none min-h-[100px] brutalist-border focus:shadow-[4px_4px_0px_var(--border-color)]";

export default function AdminDashboard() {
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Terminal State
  const [history, setHistory] = useState<HistoryLine[]>([
    { text: "IT FARM SECURE TERMINAL v1.0.0", isCommand: false, color: "text-[var(--text-primary)] font-bold" },
    { text: "CONNECTION ESTABLISHED. ROOT ACCESS GRANTED.", isCommand: false, color: "text-[var(--text-muted)]" }
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
  const [faqData, setFaqData] = useState<any[]>([]);
  const [ecosystemData, setEcosystemData] = useState<any[]>([]);
  const [systemData, setSystemData] = useState<any>(null);
  const [aboutConfigData, setAboutConfigData] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, postsRes, inqRes, clientsRes, faqRes, ecoRes, sysRes, aboutConfRes] = await Promise.all([
          getHeroData(),
          getAboutData(),
          getPostsData(),
          getInquiries(),
          getClientsData(),
          getFaqData(),
          getEcosystemData(),
          getSystemConfig(),
          getAboutConfig()
        ]);

        if (heroRes) setHeroData({ ...fallbackHero, ...heroRes });
        if (aboutRes) setAboutData(aboutRes);
        if (postsRes) setPostsData(postsRes);
        if (inqRes) setInquiriesData(inqRes);
        if (clientsRes) setClientsData(clientsRes);
        if (faqRes) setFaqData(faqRes);
        if (ecoRes) setEcosystemData(ecoRes);
        if (sysRes) setSystemData(sysRes);
        if (aboutConfRes) setAboutConfigData(aboutConfRes);
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    try {
      const res = await authenticateAdmin(passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
      } else {
        alert(res.error || "ACCESS DENIED.");
      }
    } catch (err) {
      alert("Auth failed: Network error");
    } finally {
      setIsAuthenticating(false);
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
        setHistory(prev => [...prev, { text: `Command not found: ${trimmed}`, isCommand: false, color: "text-[var(--neon-cyan)]" }]);
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

  const onSaveFaq = async () => {
    setIsSaving(true);
    await saveFaqContent(faqData);
    setIsSaving(false);
    triggerSuccess("FAQs updated.");
  };

  const onSaveEcosystem = async () => {
    setIsSaving(true);
    await saveEcosystemContent(ecosystemData);
    setIsSaving(false);
    triggerSuccess("Agent ecosystem updated.");
  };

  const onSaveSystem = async () => {
    setIsSaving(true);
    await saveSystemConfig(systemData);
    setIsSaving(false);
    triggerSuccess("System variables updated.");
  };

  const onSaveAboutConfig = async () => {
    setIsSaving(true);
    await saveAboutConfig(aboutConfigData);
    setIsSaving(false);
    triggerSuccess("About page config updated.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, directory: string): Promise<string | null> => {
    const file = e.target.files?.[0];
    if (!file) return null;
    
    setIsSaving(true);
    
    // Client-side compression
    const compressedDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress aggressively to 0.7 JPEG quality
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    try {
      // Convert Data URL to Blob
      const response = await fetch(compressedDataUrl);
      const blob = await response.blob();
      
      // Create FormData and upload
      const formData = new FormData();
      formData.append("file", blob, file.name);
      
      const result = await uploadFile(formData);
      
      setIsSaving(false);
      
      if (result.success && result.filePath) {
        triggerSuccess("File uploaded to AWS securely.");
        return result.filePath;
      } else {
        alert("Upload failed: " + result.error);
        return null;
      }
    } catch (error) {
      setIsSaving(false);
      alert("Upload failed: " + String(error));
      return null;
    }
  };

  // CRUD Operations
  const addFounder = () => {
    setAboutData([{ id: Date.now().toString(), name: "", role: "", image: "", description: "" }, ...aboutData]);
  };
  const removeFounder = (id: string) => {
    setAboutData(aboutData.filter(d => d.id !== id));
  };

  const addWork = () => {
    setPostsData([{ id: Date.now().toString(), title: "", description: "", category: "Work", scope: "Internal", date: new Date().toISOString().split('T')[0], image: "" }, ...postsData]);
  };
  const addPost = () => {
    setPostsData([{ id: Date.now().toString(), title: "", description: "", category: "Post", scope: "Internal", date: new Date().toISOString().split('T')[0], image: "" }, ...postsData]);
  };
  const removePost = (id: string) => {
    setPostsData(postsData.filter(d => d.id !== id));
  };

  const addClient = () => {
    setClientsData([{ id: Date.now().toString(), name: "", role: "", content: "", avatar: "", glow: "rgba(255, 107, 0, 1)" }, ...clientsData]);
  };
  const removeClient = (id: string) => {
    setClientsData(clientsData.filter(d => d.id !== id));
  };

  const addFaq = () => {
    setFaqData([{ id: Date.now().toString(), question: "", answer: "" }, ...faqData]);
  };
  const removeFaq = (id: string) => {
    setFaqData(faqData.filter(d => d.id !== id));
  };

  const addEcosystem = () => {
    setEcosystemData([{ id: Date.now().toString(), icon: "Terminal", title: "", desc: "", accent: "bg-black text-white border-black" }, ...ecosystemData]);
  };
  const removeEcosystem = (id: string) => {
    setEcosystemData(ecosystemData.filter(d => d.id !== id));
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
      <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-mono flex items-center justify-center grid-background selection:bg-[var(--neon-cyan)] selection:text-white">
        <div className="max-w-md w-full p-8 brutalist-panel-white brutalist-border shadow-[8px_8px_0px_var(--text-primary)] relative">
          <div className="flex items-center gap-3 mb-8 justify-center border-b border-[var(--border-color)] pb-4">
            <div className="w-8 h-8 relative overflow-hidden bg-black border border-[var(--neon-cyan)]">
              <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-[var(--text-primary)] uppercase">IT_FARM_SYS</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase technical-label">Authorization Required</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  autoFocus
                  className="w-full bg-[var(--surface-dark)] border border-[var(--border-color)] px-4 py-3 outline-none focus:border-[var(--neon-cyan)] text-[var(--text-primary)] font-mono focus:shadow-[4px_4px_0px_var(--border-color)] transition-all pr-12"
                  placeholder="Enter password..."
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-[var(--text-primary)] hover:bg-[var(--neon-cyan)] text-[var(--deep-surface)] py-3 tracking-widest text-sm font-bold transition-colors uppercase border border-[var(--text-primary)] shadow-[4px_4px_0px_var(--border-color)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans flex grid-background h-screen overflow-hidden selection:bg-[var(--neon-cyan)] selection:text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--deep-surface)] flex flex-col shrink-0 shadow-[4px_0px_0px_var(--border-color)] relative z-20">
        <div className="p-6 border-b border-[var(--border-color)] bg-[var(--surface-dark)]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 relative overflow-hidden bg-black border border-[var(--neon-cyan)]">
              <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-lg font-bold tracking-widest text-[var(--text-primary)] font-sans uppercase">Command</h1>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-[var(--neon-cyan)]">
            <Activity className="w-3 h-3 animate-pulse" /> Network Secure
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-[var(--deep-surface)]">
          <SidebarBtn active={viewMode === "terminal"} onClick={() => setViewMode("terminal")} icon={Terminal} label="Terminal" />
          <SidebarBtn active={viewMode === "inquiries"} onClick={() => setViewMode("inquiries")} icon={Inbox} label="Inquiries" badge={inquiriesData.length} />

          <div className="pt-6 pb-2 technical-label px-4 font-bold">Content System</div>
          <SidebarBtn active={viewMode === "hero"} onClick={() => setViewMode("hero")} icon={LayoutDashboard} label="Hero Editor" />
          <SidebarBtn active={viewMode === "founders"} onClick={() => setViewMode("founders")} icon={Users} label="Founders CMS" />
          <SidebarBtn active={viewMode === "works"} onClick={() => setViewMode("works")} icon={FileText} label="Works CMS" />
          <SidebarBtn active={viewMode === "posts"} onClick={() => setViewMode("posts")} icon={Star} label="Posts CMS" />
          <SidebarBtn active={viewMode === "faqs"} onClick={() => setViewMode("faqs")} icon={Quote} label="FAQs CMS" />
          <SidebarBtn active={viewMode === "ecosystem"} onClick={() => setViewMode("ecosystem")} icon={Activity} label="Ecosystem CMS" />
          <SidebarBtn active={viewMode === "system"} onClick={() => setViewMode("system")} icon={Terminal} label="System Variables" />
          <SidebarBtn active={viewMode === "about_cms"} onClick={() => setViewMode("about_cms")} icon={FileText} label="About Page CMS" />
        </nav>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--surface-dark)]">
          <button
            onClick={async () => { 
              setIsAuthenticated(false); 
              setPasswordInput(""); 
              await finalizeAdminEdits();
              window.location.href = "/"; 
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--text-primary)] bg-[var(--deep-surface)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] transition-colors text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_var(--text-primary)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          >
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 relative flex flex-col bg-[var(--background)]">
        {/* Global Save Success Toast */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="absolute top-6 left-1/2 z-50 brutalist-panel-white border border-[var(--border-active)] px-6 py-3 flex items-center gap-3 shadow-[4px_4px_0px_var(--border-active)] text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]"
            >
              <CheckCircle className="w-4 h-4 text-[var(--neon-cyan)]" /> {saveSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-8 h-full flex flex-col relative z-10">

            {/* 1. TERMINAL VIEW */}
            {viewMode === "terminal" && (
              <div className="flex-1 flex flex-col brutalist-panel-white brutalist-border shadow-[8px_8px_0px_var(--text-primary)] overflow-hidden font-mono">
                <div className="bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 border-b border-[var(--border-color)] text-[10px] tracking-widest uppercase flex items-center gap-2 font-bold">
                  <div className="w-3 h-3 relative overflow-hidden bg-black border border-[var(--neon-cyan)]">
                    <img src="/logo.jpg?v=2" alt="Logo" className="w-full h-full object-cover" />
                  </div> Root Console
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[var(--surface-dark)]" onClick={() => inputRef.current?.focus()}>
                  {history.map((line, idx) => (
                    <div key={idx} className={`${line.color || "text-[var(--text-secondary)]"} mb-1`}>{line.text}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[var(--text-primary)] mt-2">
                    <span className="font-bold">root@itfarmer:~#</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={cmdInput}
                      onChange={(e) => setCmdInput(e.target.value)}
                      onKeyDown={onCmdKeyDown}
                      className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] font-bold"
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 bg-[var(--background)]">
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Mission Inquiries</h2>
                  <button onClick={clearInquiries} className="px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[10px] uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-white transition-colors font-mono flex items-center gap-2 shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none self-start md:self-auto">
                    <Trash2 className="w-3 h-3" /> Clear Intel
                  </button>
                </div>
                <div className="brutalist-panel-white brutalist-border shadow-[8px_8px_0px_var(--text-primary)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[var(--surface-dark)] border-b border-[var(--border-color)] text-[var(--text-muted)] technical-label">
                          <th className="p-6 font-bold whitespace-nowrap">Date / Time</th>
                          <th className="p-6 font-bold">Client Identifier</th>
                          <th className="p-6 font-bold">Service</th>
                          <th className="p-6 font-bold">Budget</th>
                          <th className="p-6 font-bold w-1/3">Mission Brief</th>
                          <th className="p-6 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)] bg-[var(--deep-surface)]">
                        {inquiriesData.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-widest bg-[var(--surface-dark)]">
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
                              className="hover:bg-[var(--surface-dark)] transition-colors group"
                            >
                              <td className="p-6 border-r border-[var(--border-color)]">
                                <div className="text-[var(--text-primary)] font-mono text-xs font-bold">{inq.date}</div>
                                <div className="text-[var(--text-muted)] font-mono text-[10px] mt-1">{inq.time}</div>
                              </td>
                              <td className="p-6 border-r border-[var(--border-color)]">
                                <div className="font-bold text-[var(--neon-cyan)] text-base uppercase">{inq.name}</div>
                                <div className="text-[var(--text-secondary)] text-xs mt-1 font-mono">{inq.company || "Unknown Entity"}</div>
                                <div className="text-[var(--text-muted)] font-mono text-[10px] mt-1 break-all">{inq.email}</div>
                              </td>
                              <td className="p-6 border-r border-[var(--border-color)]">
                                <span className="px-3 py-1 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest group-hover:bg-[var(--neon-cyan)] group-hover:text-white transition-colors">{inq.service}</span>
                              </td>
                              <td className="p-6 font-mono text-[var(--text-primary)] text-xs border-r border-[var(--border-color)] font-bold">{inq.budget || "-"}</td>
                              <td className="p-6 text-[var(--text-secondary)] font-mono text-xs line-clamp-3 md:line-clamp-none max-w-sm border-r border-[var(--border-color)]">
                                {inq.message}
                              </td>
                              <td className="p-6 text-right">
                                <button
                                  onClick={() => deleteSingleInquiry(inq.id)}
                                  className="px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 ml-auto shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
                <div className="brutalist-panel-white brutalist-border p-8 space-y-6 shadow-[8px_8px_0px_var(--text-primary)]">
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
                    <button onClick={addFounder} className="flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                      <Plus className="w-4 h-4" /> Add Profile
                    </button>
                  }
                />

                {aboutData.length === 0 ? (
                  <div className="brutalist-panel-white brutalist-border p-12 text-center flex flex-col items-center justify-center shadow-[8px_8px_0px_var(--text-primary)]">
                    <Users className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase">No Founders Data</h3>
                    <p className="text-[var(--text-muted)] text-sm mb-6 max-w-sm font-mono">Your roster is currently empty. Add a profile to populate the about section.</p>
                    <button onClick={addFounder} className="flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] border border-[var(--text-primary)] text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] transition-all shadow-[4px_4px_0px_var(--text-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
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
                          className="brutalist-panel-white brutalist-border p-6 relative group hover:border-[var(--border-active)] transition-colors shadow-[4px_4px_0px_var(--border-color)] hover:shadow-[4px_4px_0px_var(--border-active)]"
                        >
                          <button
                            onClick={() => removeFounder(dev.id)}
                            className="absolute top-4 right-4 p-2 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--neon-cyan)] hover:text-white transition-all shadow-[2px_2px_0px_var(--border-color)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex flex-col md:flex-row items-start gap-6 mt-2">
                            <div className="flex flex-col items-center gap-3 shrink-0">
                              <div className="w-24 h-24 bg-[var(--surface-dark)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center">
                                {dev.image ? <img src={dev.image} className="w-full h-full object-cover grayscale contrast-125" alt="Founder" /> : <ImageIcon className="w-6 h-6 text-[var(--text-muted)]" />}
                              </div>
                              <label className="cursor-pointer text-[9px] uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--neon-cyan)] hover:text-white transition-colors border border-[var(--border-color)] px-3 py-1.5 bg-[var(--surface-dark)] text-center w-full font-bold shadow-[2px_2px_0px_var(--border-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
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
                              <Field label="EMAIL"><input type="email" value={dev.email || ""} onChange={e => { const n = [...aboutData]; n[index].email = e.target.value; setAboutData(n); }} className={inputClass} placeholder="dev@company.com" /></Field>
                              <div className="grid md:grid-cols-2 gap-4">
                                <Field label="GITHUB"><input type="text" value={dev.github || ""} onChange={e => { const n = [...aboutData]; n[index].github = e.target.value; setAboutData(n); }} className={inputClass} placeholder="https://github.com/..." /></Field>
                                <Field label="LINKEDIN"><input type="text" value={dev.linkedin || ""} onChange={e => { const n = [...aboutData]; n[index].linkedin = e.target.value; setAboutData(n); }} className={inputClass} placeholder="https://linkedin.com/in/..." /></Field>
                                <Field label="PORTFOLIO LINK"><input type="text" value={dev.portfolio || ""} onChange={e => { const n = [...aboutData]; n[index].portfolio = e.target.value; setAboutData(n); }} className={inputClass} placeholder="https://myportfolio.com" /></Field>
                              </div>
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
            
            {/* WORKS EDITOR */}
            {viewMode === "works" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header title="Works CMS" onSave={onSavePosts} isSaving={isSaving} actionButton={
                  <button onClick={addWork} className="flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                    <Plus className="w-4 h-4" /> Add Work
                  </button>
                } />
                {postsData.filter(p => p.category === "Work").length === 0 ? (
                  <div className="brutalist-panel-white brutalist-border p-12 text-center flex flex-col items-center justify-center shadow-[8px_8px_0px_var(--text-primary)]">
                    <FileText className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase">No Works Found</h3>
                    <button onClick={addWork} className="mt-6 flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] border border-[var(--text-primary)] text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] transition-all shadow-[4px_4px_0px_var(--text-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                      <Plus className="w-4 h-4" /> Add First Work
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {postsData.filter(p => p.category === "Work").map((post) => {
                        const globalIndex = postsData.findIndex(p => p.id === post.id);
                        return (
                          <motion.div layout key={post.id} className="brutalist-panel-white brutalist-border p-6 group flex flex-col relative shadow-[4px_4px_0px_var(--border-color)]">
                            <button onClick={() => removePost(post.id)} className="absolute top-4 right-4 z-10 p-2 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:bg-[#ff0000] hover:text-white transition-all shadow-[2px_2px_0px_var(--border-color)]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="mb-4">
                              <Field label="COVER IMAGE">
                                <div className="flex gap-2">
                                  <input type="text" value={post.image || ""} onChange={e => { const n = [...postsData]; n[globalIndex].image = e.target.value; setPostsData(n); }} className={inputClass} placeholder="/projects/example.jpg" />
                                  <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].image = path; setPostsData(n); } }} />
                                  </label>
                                </div>
                              </Field>
                            </div>
                            <div className="space-y-4 flex-1 flex flex-col">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="TITLE"><input type="text" value={post.title || ""} onChange={e => { const n = [...postsData]; n[globalIndex].title = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                                <Field label="SCOPE">
                                  <select value={post.scope || "Internal"} onChange={e => { const n = [...postsData]; n[globalIndex].scope = e.target.value; setPostsData(n); }} className={inputClass}>
                                    <option value="Internal">Internal Project</option>
                                    <option value="Client">Client Build</option>
                                  </select>
                                </Field>
                              </div>
                              <Field label="CLIENT / ORG NAME"><input type="text" value={post.client || ""} onChange={e => { const n = [...postsData]; n[globalIndex].client = e.target.value; setPostsData(n); }} className={inputClass} placeholder="Leave empty for generic internal" /></Field>
                              <Field label="TECHNOLOGIES"><input type="text" value={post.technologies || ""} onChange={e => { const n = [...postsData]; n[globalIndex].technologies = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                              <Field label="OVERVIEW"><textarea value={post.description || ""} onChange={e => { const n = [...postsData]; n[globalIndex].description = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="THE CHALLENGE"><textarea value={post.challenge || ""} onChange={e => { const n = [...postsData]; n[globalIndex].challenge = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="THE SOLUTION"><textarea value={post.solution || ""} onChange={e => { const n = [...postsData]; n[globalIndex].solution = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="THE RESULTS"><textarea value={post.results || ""} onChange={e => { const n = [...postsData]; n[globalIndex].results = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="LIVE LINK / REPO"><input type="text" value={post.link || ""} onChange={e => { const n = [...postsData]; n[globalIndex].link = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                                <Field label="ARCHITECTURE DIAGRAM">
                                  <div className="flex gap-2">
                                    <input type="text" value={post.architectureImage || ""} onChange={e => { const n = [...postsData]; n[globalIndex].architectureImage = e.target.value; setPostsData(n); }} className={inputClass} />
                                    <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                      Upload
                                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].architectureImage = path; setPostsData(n); } }} />
                                    </label>
                                  </div>
                                </Field>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* POSTS EDITOR */}
            {viewMode === "posts" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header title="Posts CMS" onSave={onSavePosts} isSaving={isSaving} actionButton={
                  <button onClick={addPost} className="flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                    <Plus className="w-4 h-4" /> Compose Post
                  </button>
                } />
                {postsData.filter(p => p.category === "Post").length === 0 ? (
                  <div className="brutalist-panel-white brutalist-border p-12 text-center flex flex-col items-center justify-center shadow-[8px_8px_0px_var(--text-primary)]">
                    <Star className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase">No Posts Found</h3>
                    <button onClick={addPost} className="mt-6 flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] border border-[var(--text-primary)] text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] transition-all shadow-[4px_4px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                      <Plus className="w-4 h-4" /> Add First Post
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {postsData.filter(p => p.category === "Post").map((post) => {
                        const globalIndex = postsData.findIndex(p => p.id === post.id);
                        return (
                          <motion.div layout key={post.id} className="brutalist-panel-white brutalist-border p-6 group flex flex-col relative shadow-[4px_4px_0px_var(--border-color)]">
                            <button onClick={() => removePost(post.id)} className="absolute top-4 right-4 z-10 p-2 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:bg-[#ff0000] hover:text-white transition-all shadow-[2px_2px_0px_var(--border-color)]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="space-y-4 flex-1 flex flex-col">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="TITLE"><input type="text" value={post.title || ""} onChange={e => { const n = [...postsData]; n[globalIndex].title = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                                <Field label="SCOPE">
                                  <select value={post.scope || "Internal"} onChange={e => { const n = [...postsData]; n[globalIndex].scope = e.target.value; setPostsData(n); }} className={inputClass}>
                                    <option value="Internal">Internal Update</option>
                                    <option value="Client">Client Announcement</option>
                                  </select>
                                </Field>
                              </div>
                              <Field label="CLIENT / ORG NAME"><input type="text" value={post.client || ""} onChange={e => { const n = [...postsData]; n[globalIndex].client = e.target.value; setPostsData(n); }} className={inputClass} placeholder="Only for client posts" /></Field>
                              <Field label="CLIENT AVATAR / LOGO">
                                <div className="flex gap-2">
                                  <input type="text" value={post.clientPic || ""} onChange={e => { const n = [...postsData]; n[globalIndex].clientPic = e.target.value; setPostsData(n); }} className={inputClass} placeholder="/avatars/client.jpg" />
                                  <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].clientPic = path; setPostsData(n); } }} />
                                  </label>
                                </div>
                              </Field>
                              <Field label="POST CONTENT (Markdown supported)"><textarea value={post.description || ""} onChange={e => { const n = [...postsData]; n[globalIndex].description = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="ATTACHED IMAGE (Optional)">
                                <div className="flex gap-2">
                                  <input type="text" value={post.image || ""} onChange={e => { const n = [...postsData]; n[globalIndex].image = e.target.value; setPostsData(n); }} className={inputClass} />
                                  <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].image = path; setPostsData(n); } }} />
                                  </label>
                                </div>
                              </Field>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
{viewMode === "faqs" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header
                  title="FAQs Content"
                  onSave={onSaveFaq}
                  isSaving={isSaving}
                  actionButton={
                    <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                      <Plus className="w-4 h-4" /> Add FAQ
                    </button>
                  }
                />

                <div className="grid lg:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {faqData.map((faq, index) => (
                      <motion.div
                        layout
                        key={faq.id || index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="brutalist-panel-white brutalist-border p-6 relative group hover:border-[var(--border-active)] transition-colors shadow-[4px_4px_0px_var(--border-color)] hover:shadow-[4px_4px_0px_var(--border-active)]"
                      >
                        <button
                          onClick={() => removeFaq(faq.id)}
                          className="absolute top-4 right-4 p-2 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--neon-cyan)] hover:text-white transition-all shadow-[2px_2px_0px_var(--border-color)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-4">
                          <Field label="QUESTION"><input type="text" value={faq.question || ""} onChange={e => { const n = [...faqData]; n[index].question = e.target.value; setFaqData(n); }} className={inputClass} placeholder="Question?" /></Field>
                          <Field label="ANSWER"><textarea value={faq.answer || ""} onChange={e => { const n = [...faqData]; n[index].answer = e.target.value; setFaqData(n); }} className={textareaClass} placeholder="Answer..." /></Field>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 8. ECOSYSTEM EDITOR */}
            {viewMode === "ecosystem" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header
                  title="Agent Ecosystem"
                  onSave={onSaveEcosystem}
                  isSaving={isSaving}
                  actionButton={
                    <button onClick={addEcosystem} className="flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                      <Plus className="w-4 h-4" /> Add Agent Component
                    </button>
                  }
                />

                <div className="grid lg:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {ecosystemData.map((eco, index) => (
                      <motion.div
                        layout
                        key={eco.id || index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="brutalist-panel-white brutalist-border p-6 relative group hover:border-[var(--border-active)] transition-colors shadow-[4px_4px_0px_var(--border-color)] hover:shadow-[4px_4px_0px_var(--border-active)]"
                      >
                        <button
                          onClick={() => removeEcosystem(eco.id)}
                          className="absolute top-4 right-4 p-2 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--neon-cyan)] hover:text-white transition-all shadow-[2px_2px_0px_var(--border-color)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-4">
                          <Field label="TITLE"><input type="text" value={eco.title || ""} onChange={e => { const n = [...ecosystemData]; n[index].title = e.target.value; setEcosystemData(n); }} className={inputClass} placeholder="Agent Role" /></Field>
                          <Field label="DESCRIPTION"><textarea value={eco.desc || ""} onChange={e => { const n = [...ecosystemData]; n[index].desc = e.target.value; setEcosystemData(n); }} className={textareaClass} placeholder="Agent capability description..." /></Field>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="ICON TYPE"><input type="text" value={eco.icon || ""} onChange={e => { const n = [...ecosystemData]; n[index].icon = e.target.value; setEcosystemData(n); }} className={inputClass} placeholder="Terminal, Lock, Globe" /></Field>
                            <Field label="ACCENT CLASSES"><input type="text" value={eco.accent || ""} onChange={e => { const n = [...ecosystemData]; n[index].accent = e.target.value; setEcosystemData(n); }} className={inputClass} placeholder="bg-black text-white" /></Field>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 9. SYSTEM VARIABLES EDITOR */}
            {viewMode === "system" && systemData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header title="System Variables" onSave={onSaveSystem} isSaving={isSaving} />

                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Metrics Base Variables
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="BASE ACTIVE AGENTS">
                      <input type="number" value={systemData.metrics?.activeAgents ?? ""} onChange={e => setSystemData({ ...systemData, metrics: { ...systemData.metrics, activeAgents: e.target.value === "" ? "" : parseInt(e.target.value) } })} className={inputClass} />
                    </Field>
                    <Field label="BASE GPU COMPUTE">
                      <input type="number" step="0.01" value={systemData.metrics?.gpuCompute ?? ""} onChange={e => setSystemData({ ...systemData, metrics: { ...systemData.metrics, gpuCompute: e.target.value === "" ? "" : parseFloat(e.target.value) } })} className={inputClass} />
                    </Field>
                    <Field label="BASE REQUESTS">
                      <input type="number" value={systemData.metrics?.requests ?? ""} onChange={e => setSystemData({ ...systemData, metrics: { ...systemData.metrics, requests: e.target.value === "" ? "" : parseInt(e.target.value) } })} className={inputClass} />
                    </Field>
                  </div>
                </div>

                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" /> Bento Grid Variables
                  </h3>
                  <div className="space-y-4">
                    <Field label="MAIN TITLE">
                      <input type="text" value={systemData.bentoGrid?.title || ""} onChange={e => setSystemData({ ...systemData, bentoGrid: { ...systemData.bentoGrid, title: e.target.value } })} className={inputClass} />
                    </Field>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="CARD 1 TITLE"><input type="text" value={systemData.bentoGrid?.card1Title || ""} onChange={e => setSystemData({ ...systemData, bentoGrid: { ...systemData.bentoGrid, card1Title: e.target.value } })} className={inputClass} /></Field>
                      <Field label="CARD 1 DESCRIPTION"><textarea value={systemData.bentoGrid?.card1Desc || ""} onChange={e => setSystemData({ ...systemData, bentoGrid: { ...systemData.bentoGrid, card1Desc: e.target.value } })} className={textareaClass} /></Field>
                      <Field label="CARD 2 TITLE"><input type="text" value={systemData.bentoGrid?.card2Title || ""} onChange={e => setSystemData({ ...systemData, bentoGrid: { ...systemData.bentoGrid, card2Title: e.target.value } })} className={inputClass} /></Field>
                      <Field label="CARD 2 DESCRIPTION"><textarea value={systemData.bentoGrid?.card2Desc || ""} onChange={e => setSystemData({ ...systemData, bentoGrid: { ...systemData.bentoGrid, card2Desc: e.target.value } })} className={textareaClass} /></Field>
                      <Field label="CARD 3 TITLE"><input type="text" value={systemData.bentoGrid?.card3Title || ""} onChange={e => setSystemData({ ...systemData, bentoGrid: { ...systemData.bentoGrid, card3Title: e.target.value } })} className={inputClass} /></Field>
                      <Field label="CARD 4 TITLE"><input type="text" value={systemData.bentoGrid?.card4Title || ""} onChange={e => setSystemData({ ...systemData, bentoGrid: { ...systemData.bentoGrid, card4Title: e.target.value } })} className={inputClass} /></Field>
                    </div>
                  </div>
                </div>

                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Terminal className="w-5 h-5" /> API Playground Variables
                  </h3>
                  <Field label="API SECTION TITLE">
                    <input type="text" value={systemData.apiPlayground?.title || ""} onChange={e => setSystemData({ ...systemData, apiPlayground: { ...systemData.apiPlayground, title: e.target.value } })} className={inputClass} />
                  </Field>
                </div>

                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Marquee Strings
                  </h3>
                  <Field label="MARQUEE STRINGS (One per line)">
                    <textarea 
                      value={(systemData.marquee || []).join("\n")} 
                      onChange={e => setSystemData({ ...systemData, marquee: e.target.value.split("\n") })} 
                      className={textareaClass}
                      rows={6}
                    />
                  </Field>
                </div>

                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Main Site Contacts
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="MAIN CONTACT EMAIL">
                      <input type="email" value={systemData.contact?.email || ""} onChange={e => setSystemData({ ...systemData, contact: { ...systemData.contact, email: e.target.value } })} className={inputClass} />
                    </Field>
                    <Field label="INSTAGRAM LINK">
                      <input type="text" value={systemData.contact?.instagram || ""} onChange={e => setSystemData({ ...systemData, contact: { ...systemData.contact, instagram: e.target.value } })} className={inputClass} />
                    </Field>
                    <Field label="TWITTER LINK">
                      <input type="text" value={systemData.contact?.twitter || ""} onChange={e => setSystemData({ ...systemData, contact: { ...systemData.contact, twitter: e.target.value } })} className={inputClass} />
                    </Field>
                    <Field label="LINKEDIN LINK">
                      <input type="text" value={systemData.contact?.linkedin || ""} onChange={e => setSystemData({ ...systemData, contact: { ...systemData.contact, linkedin: e.target.value } })} className={inputClass} />
                    </Field>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 10. ABOUT PAGE CMS EDITOR */}
            {viewMode === "about_cms" && aboutConfigData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header title="About Page Config" onSave={onSaveAboutConfig} isSaving={isSaving} />

                {/* Execution Logic */}
                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Server className="w-5 h-5" /> Execution Logic
                  </h3>
                  <div className="space-y-6">
                    {aboutConfigData.executionLogic?.map((item: any, idx: number) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-4 border p-4 border-[var(--border-color)] bg-[var(--surface-dark)]">
                        <Field label={`ITEM ${idx + 1} TITLE`}><input type="text" value={item.title || ""} onChange={e => { const n = { ...aboutConfigData }; n.executionLogic[idx].title = e.target.value; setAboutConfigData(n); }} className={inputClass} /></Field>
                        <Field label="ICON (Server, Users, Zap)"><input type="text" value={item.icon || ""} onChange={e => { const n = { ...aboutConfigData }; n.executionLogic[idx].icon = e.target.value; setAboutConfigData(n); }} className={inputClass} /></Field>
                        <Field label="DESCRIPTION"><textarea value={item.desc || ""} onChange={e => { const n = { ...aboutConfigData }; n.executionLogic[idx].desc = e.target.value; setAboutConfigData(n); }} className={textareaClass} rows={2} /></Field>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities Matrix */}
                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Capabilities Matrix
                  </h3>
                  <div className="space-y-6">
                    {aboutConfigData.capabilities?.map((item: any, idx: number) => (
                      <div key={idx} className="grid md:grid-cols-2 gap-4 border p-4 border-[var(--border-color)] bg-[var(--surface-dark)]">
                        <Field label={`CAPABILITY ${idx + 1} TITLE`}><input type="text" value={item.title || ""} onChange={e => { const n = { ...aboutConfigData }; n.capabilities[idx].title = e.target.value; setAboutConfigData(n); }} className={inputClass} /></Field>
                        <Field label="DESCRIPTION"><textarea value={item.desc || ""} onChange={e => { const n = { ...aboutConfigData }; n.capabilities[idx].desc = e.target.value; setAboutConfigData(n); }} className={textareaClass} rows={2} /></Field>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horizon Protocol */}
                <div className="brutalist-panel-white brutalist-border p-8 shadow-[8px_8px_0px_var(--text-primary)]">
                  <h3 className="text-xl font-bold uppercase tracking-tighter mb-6 border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                    <Terminal className="w-5 h-5" /> Horizon Protocol
                  </h3>
                  <div className="space-y-6">
                    {aboutConfigData.horizon?.map((item: any, idx: number) => (
                      <div key={idx} className="grid md:grid-cols-3 gap-4 border p-4 border-[var(--border-color)] bg-[var(--surface-dark)]">
                        <Field label="TAG (e.g. [ CURRENT FOCUS ])"><input type="text" value={item.tag || ""} onChange={e => { const n = { ...aboutConfigData }; n.horizon[idx].tag = e.target.value; setAboutConfigData(n); }} className={inputClass} /></Field>
                        <Field label={`PHASE ${idx + 1} TITLE`}><input type="text" value={item.title || ""} onChange={e => { const n = { ...aboutConfigData }; n.horizon[idx].title = e.target.value; setAboutConfigData(n); }} className={inputClass} /></Field>
                        <Field label="DESCRIPTION"><textarea value={item.desc || ""} onChange={e => { const n = { ...aboutConfigData }; n.horizon[idx].desc = e.target.value; setAboutConfigData(n); }} className={textareaClass} rows={2} /></Field>
                      </div>
                    ))}
                  </div>
                </div>
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
      className={`w-full flex items-center justify-between px-4 py-3 border transition-all ${active
        ? "bg-[var(--text-primary)] text-[var(--deep-surface)] border-[var(--text-primary)] font-bold shadow-[2px_2px_0px_var(--neon-cyan)] translate-x-[2px] translate-y-[2px]"
        : "text-[var(--text-primary)] bg-[var(--surface-dark)] border-[var(--border-color)] hover:bg-[var(--deep-surface)] hover:border-[var(--text-primary)] shadow-[2px_2px_0px_var(--border-color)] hover:shadow-[2px_2px_0px_var(--text-primary)]"
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? "text-[var(--neon-cyan)]" : "text-[var(--text-primary)]"}`} />
        <span className="text-sm font-bold uppercase tracking-widest font-mono">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold ${active ? "bg-[var(--neon-cyan)] text-[var(--deep-surface)] border-[var(--neon-cyan)]" : "bg-[var(--deep-surface)] text-[var(--text-primary)] border-[var(--border-color)]"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="technical-label ml-1 font-bold">{label}</label>
      {children}
    </div>
  );
}

function Header({ title, onSave, isSaving, actionButton }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6 bg-[var(--background)]">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[var(--text-primary)]">{title}</h2>
        {actionButton}
      </div>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="px-8 py-3 bg-[var(--text-primary)] border border-[var(--text-primary)] text-[var(--deep-surface)] font-black uppercase tracking-widest text-xs hover:bg-[var(--neon-cyan)] hover:text-[var(--deep-surface)] flex items-center justify-center gap-2 transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_var(--border-color)] hover:shadow-[4px_4px_0px_var(--text-primary)]"
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