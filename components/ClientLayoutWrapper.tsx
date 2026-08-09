"use client";

import { usePathname } from "next/navigation";
import React from "react";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import ShortcutListener from "@/components/ShortcutListener";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import OrbitChat from "@/components/orbit/OrbitChat";
import ScrollProvider from "@/components/ScrollProvider";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="admin-layout-root bg-black min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      <LoadingScreen />
      <ScrollProvider>
        <ShortcutListener />
        <Navbar />
        {children}
        <Footer />
        <OrbitChat />
      </ScrollProvider>
    </>
  );
}
