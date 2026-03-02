"use client";

import React, { useEffect, useMemo, useState, JSX } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";
import { 
  LayoutGrid,
  Users,
  Zap,
  Plus,
  Send,
  ShieldCheck,
  Database,
  BarChart3,
  Loader2,
  Bell,
  RefreshCcw,
  Search,
  Calendar,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Image,
  X,
} from "lucide-react";

/* COMPONENTS */
import SmokeBackground from "@/components/SmokeBackground";
import FloatingNavbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type AdminTab = "broadcast" | "manage" | "users";

interface Inquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  budget?: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

interface UserRecord {
  _id: string;
  username: string;
  full_name?: string;
  role?: string;
  created_at?: string;
}

interface AdminNotification {
  id: string;
  title: string;
  body: string;
  at: string;
}

export default function AdminDashboard(): JSX.Element {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("broadcast");
  const [isLoading, setIsLoading] = useState(true);

  // Real data from backend
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  // Broadcast form state
  const [isPublishing, setIsPublishing] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastCategory, setBroadcastCategory] = useState<"project" | "team" | "update">("project");
  const [broadcastDescription, setBroadcastDescription] = useState("");
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcastImage, setBroadcastImage] = useState<File | null>(null);
  const [broadcastImagePreview, setBroadcastImagePreview] = useState<string | null>(null);

  // Inquiry filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);

  const uniqueServices = useMemo(() => {
    const services = new Set(inquiries.map((item) => item.service));
    return ["all", ...Array.from(services)];
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    const byService =
      serviceFilter === "all"
        ? inquiries
        : inquiries.filter((item) => item.service === serviceFilter);
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return byService;
    }
    return byService.filter((item) => {
      const haystack = `${item.name} ${item.email} ${item.company ?? ""} ${item.message}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [inquiries, searchTerm, serviceFilter]);

  const stats = [
    {
      label: "Total Inquiries",
      value: String(inquiries.length),
      icon: <Database className="w-4 h-4" />,
    },
    {
      label: "Live Alerts",
      value: String(notifications.length),
      icon: <Bell className="w-4 h-4" />,
    },
    {
      label: "Operators",
      value: String(users.length),
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([fetchInquiries(), fetchUsers()]);
      setIsLoading(false);
    };

    loadInitialData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const ws = new WebSocket(`${API_URL.replace("http", "ws")}/notifications/admin`);
    const keepAlive = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send("ping");
      }
    }, 20000);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type?: string; data?: Inquiry };
        if (payload.type === "new_inquiry" && payload.data) {
          const inquiryData = payload.data as Inquiry;
          setInquiries((prev) => [inquiryData, ...prev]);
          setNotifications((prev) => [
            {
              id: `${inquiryData.id}-${Date.now()}`,
              title: "New Inquiry Received",
              body: `${inquiryData.name} requested ${inquiryData.service}`,
              at: new Date().toLocaleTimeString(),
            },
            ...prev,
          ]);
        }
      } catch {
        // Ignore malformed WS payloads to keep dashboard resilient.
      }
    };

    return () => {
      clearInterval(keepAlive);
      ws.close();
    };
  }, [isLoggedIn]);

  const fetchInquiries = async () => {
    try {
      setInquiryError(null);
      const response = await fetch(`${API_URL}/inquiry`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch inquiries.");
      }
      const data = (await response.json()) as Inquiry[];
      setInquiries(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown inquiry fetch error.";
      setInquiryError(message);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setUsersError("Login required to load operators.");
        return;
      }

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Access denied while loading operators.");
      }

      const data = (await response.json()) as UserRecord[];
      setUsers(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown operators fetch error.";
      setUsersError(message);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setBroadcastError("Image size must be less than 5MB");
        return;
      }
      setBroadcastImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBroadcastImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setBroadcastImage(null);
    setBroadcastImagePreview(null);
  };

  const handleBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);
    setBroadcastError(null);
    setBroadcastSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const broadcastData: Record<string, unknown> = {
        title: broadcastTitle,
        description: broadcastDescription,
        category: broadcastCategory,
        tags: [broadcastCategory],
      };

      if (broadcastImagePreview) {
        broadcastData.image = broadcastImagePreview;
      }

      const response = await fetch(`${API_URL}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(broadcastData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to broadcast update");
      }

      setBroadcastSuccess(true);
      setBroadcastTitle("");
      setBroadcastDescription("");
      setBroadcastCategory("project");
      clearImage();
      
      // Reset success message after 3 seconds
      setTimeout(() => setBroadcastSuccess(false), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Broadcast failed";
      setBroadcastError(message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <main className="relative min-h-screen bg-[#020202] text-white overflow-x-hidden">
        <div className="fixed inset-0 z-0">
          <SmokeBackground />
        </div>
        <FloatingNavbar />
        <section className="relative z-10 max-w-4xl mx-auto px-6 pt-40 pb-16 text-center">
          <ShieldCheck className="w-10 h-10 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
            Admin <span className="text-zinc-600">Access Locked</span>
          </h1>
          <p className="mt-6 text-zinc-400 max-w-xl mx-auto">
            {!isLoggedIn ? "Authenticate first from the login page, then return to open the command center." : "Admin-only access required. Login with admin credentials to proceed."}
          </p>
          <a
            href="/login"
            className="inline-flex mt-8 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-500 hover:text-white transition-all"
          >
            Initialize Login
          </a>
        </section>
      </main>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
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

          <div className="mb-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void fetchInquiries();
                void fetchUsers();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:border-white/30 transition-all text-[10px] font-mono uppercase tracking-widest"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
            {isLoading && (
              <span className="inline-flex items-center gap-2 text-zinc-400 text-[10px] font-mono uppercase tracking-widest">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Syncing State
              </span>
            )}
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
                    <form onSubmit={handleBroadcast} className="space-y-6">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-8">
                          New <span className="text-zinc-600">Broadcast</span>
                        </h2>
                      </div>

                      {broadcastError && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm font-mono flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          {broadcastError}
                        </motion.div>
                      )}

                      {broadcastSuccess && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-green-400 text-sm font-mono flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          ✓ Update broadcast successfully to all terminals
                        </motion.div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Category</label>
                          <select
                            value={broadcastCategory}
                            onChange={(e) => setBroadcastCategory(e.target.value as "project" | "team" | "update")}
                            className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                          >
                            <option value="project">Project Deployment</option>
                            <option value="team">Personnel Update</option>
                            <option value="update">System Patch</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Title</label>
                          <input
                            type="text"
                            value={broadcastTitle}
                            onChange={(e) => setBroadcastTitle(e.target.value)}
                            required
                            placeholder="Update title..."
                            className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Description</label>
                        <textarea
                          value={broadcastDescription}
                          onChange={(e) => setBroadcastDescription(e.target.value)}
                          required
                          className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm h-40 resize-none focus:outline-none focus:border-blue-500 transition-all"
                          placeholder="Provide detailed update information..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest ml-1">Photo (Optional)</label>
                        <label className="w-full border-2 border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-white/40 transition-colors flex items-center justify-center">
                          <div className="text-center">
                            <Image className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
                            <span className="text-[10px] font-mono text-zinc-400">Click to select image (Max 5MB)</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                        {broadcastImagePreview && (
                          <div className="relative rounded-xl overflow-hidden border border-white/10">
                            <img
                              src={broadcastImagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                            <button
                              type="button"
                              onClick={clearImage}
                              className="absolute top-2 right-2 p-2 bg-black/80 rounded-lg hover:bg-red-500 transition-colors"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit"
                        disabled={isPublishing || !broadcastTitle || !broadcastDescription}
                        className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-[0.1em] text-[10px] flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Broadcasting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Transmit Update
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {activeTab === "manage" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-zinc-950/80 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
                        Inquiry <span className="text-zinc-600">Deck</span>
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search name, email, message"
                            className="w-64 bg-black border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="relative">
                          <Filter className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                          <select
                            value={serviceFilter}
                            onChange={(e) => setServiceFilter(e.target.value)}
                            className="w-44 bg-black border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-blue-500"
                          >
                            {uniqueServices.map((service) => (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {inquiryError && (
                      <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {inquiryError}
                      </div>
                    )}

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                      {filteredInquiries.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-zinc-500 text-sm">
                          No inquiries matched current filters.
                        </div>
                      )}
                      {filteredInquiries.map((inquiry) => (
                        <article
                          key={inquiry.id}
                          className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:border-blue-500/40 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-lg">{inquiry.name}</h3>
                              <p className="text-zinc-400 text-sm">{inquiry.email}</p>
                              {inquiry.company && (
                                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wider font-mono">{inquiry.company}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-mono uppercase tracking-widest">
                                {inquiry.service}
                              </span>
                              <div className="mt-2 text-zinc-500 text-xs font-mono flex items-center justify-end gap-3">
                                <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {inquiry.date}</span>
                                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {inquiry.time}</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-zinc-300 leading-relaxed text-sm">{inquiry.message}</p>
                          {inquiry.budget && (
                            <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                              Budget Intent: {inquiry.budget}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "users" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-zinc-950/80 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl"
                  >
                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-8">
                      Operator <span className="text-zinc-600">Registry</span>
                    </h2>

                    {usersError && (
                      <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {usersError}
                      </div>
                    )}

                    <div className="space-y-3 mb-10">
                      {users.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-zinc-500 text-sm">
                          No operators available or token not authorized.
                        </div>
                      )}
                      {users.map((operator) => (
                        <div
                          key={operator._id}
                          className="rounded-2xl border border-white/10 bg-black/40 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold">{operator.full_name || operator.username}</p>
                            <p className="text-zinc-400 text-sm">{operator.username}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400">
                              {operator.role || "user"}
                            </span>
                            {operator.created_at && (
                              <p className="text-[10px] text-zinc-600 mt-1 font-mono uppercase tracking-widest">
                                {new Date(operator.created_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4">
                      Live Notification Feed
                    </h3>
                    <div className="space-y-3 max-h-[28vh] overflow-y-auto">
                      {notifications.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-zinc-500 text-sm">
                          Awaiting real-time inquiry events.
                        </div>
                      )}
                      {notifications.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-blue-400" />
                              {item.title}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{item.at}</span>
                          </div>
                          <p className="mt-2 text-sm text-zinc-300">{item.body}</p>
                        </div>
                      ))}
                    </div>
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

interface AdminNavButtonProps {
  active: boolean;
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}

function AdminNavButton({ active, icon, label, onClick }: AdminNavButtonProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-mono uppercase tracking-widest transition-all ${
        active 
          ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]" 
          : "bg-zinc-950/50 text-zinc-500 border border-white/5 hover:border-white/20"
      }`}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
      {label}
      {active && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
    </button>
  );
}