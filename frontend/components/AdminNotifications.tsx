"use client";

import React, { useEffect, useState } from "react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Inquiry[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/notifications/admin");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "new_inquiry") {
        setNotifications((prev) => [msg.data, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="fixed top-5 right-5 w-80 max-h-[80vh] overflow-y-auto space-y-2 bg-zinc-900/80 p-4 rounded-xl shadow-xl">
      <h3 className="font-bold text-white mb-2">New Inquiries</h3>
      {notifications.length === 0 && <p className="text-zinc-400 text-sm">No new inquiries</p>}
      {notifications.map((n) => (
        <div key={n.id} className="bg-black/50 p-3 rounded-lg border border-white/10">
          <p className="text-white font-bold">{n.name} ({n.service})</p>
          <p className="text-zinc-400 text-xs">{n.date} {n.time}</p>
          <p className="text-zinc-300 text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
