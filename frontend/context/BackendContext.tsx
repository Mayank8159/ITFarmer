"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

type BackendState = "checking" | "online" | "offline";

interface BackendContextType {
  state: BackendState;
  lastCheckedAt: string | null;
  checkNow: () => Promise<void>;
}

const BackendContext = createContext<BackendContextType>({
  state: "checking",
  lastCheckedAt: null,
  checkNow: async () => {},
});

async function pingBackend(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    window.clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

export function BackendProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BackendState>("checking");
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const checkNow = async () => {
    setState((prev) => (prev === "online" ? "online" : "checking"));
    const ok = await pingBackend();
    setState(ok ? "online" : "offline");
    setLastCheckedAt(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    void checkNow();

    const id = window.setInterval(() => {
      void checkNow();
    }, 15000);

    return () => window.clearInterval(id);
  }, []);

  const value = useMemo(
    () => ({ state, lastCheckedAt, checkNow }),
    [state, lastCheckedAt],
  );

  return <BackendContext.Provider value={value}>{children}</BackendContext.Provider>;
}

export function useBackend() {
  return useContext(BackendContext);
}

export function BackendRequired({ children }: { children: React.ReactNode }) {
  const { state, lastCheckedAt, checkNow } = useBackend();

  if (state === "online") {
    return <>{children}</>;
  }

  if (state === "checking") {
    return (
      <main className="min-h-screen bg-[#020202] text-white flex items-center justify-center px-6">
        <section className="max-w-xl w-full rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-8 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">Backend Check</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Connecting To API</h1>
          <p className="mt-4 text-zinc-400">Waiting for backend at <span className="text-blue-400">{BACKEND_URL}</span></p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white flex items-center justify-center px-6">
      <section className="max-w-xl w-full rounded-3xl border border-red-500/30 bg-zinc-950/90 backdrop-blur-xl p-8 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-400">Backend Required</p>
        <h1 className="mt-4 text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Backend Offline</h1>
        <p className="mt-4 text-zinc-300">All frontend pages are blocked until backend responds.</p>
        <p className="mt-2 text-zinc-500 text-sm">Expected: {BACKEND_URL}</p>
        {lastCheckedAt && (
          <p className="mt-2 text-zinc-600 text-xs font-mono uppercase tracking-widest">Last check: {lastCheckedAt}</p>
        )}
        <button
          type="button"
          onClick={() => void checkNow()}
          className="mt-6 px-6 py-3 rounded-xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-500 hover:text-white transition-all"
        >
          Retry Connection
        </button>
      </section>
    </main>
  );
}
