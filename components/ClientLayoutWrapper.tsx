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
import MinimalHeader from "@/components/navigation/MinimalHeader";
import MinimalFooter from "@/components/navigation/MinimalFooter";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="admin-layout-root bg-[var(--background)] min-h-screen text-[var(--text-primary)]" style={{ cursor: 'auto' }}>
        {children}
      </div>
    );
  }

  const isLandingPage = pathname?.startsWith("/lp");

  return (
    <>
      <CustomCursor />
      <LoadingScreen />
      <ScrollProvider>
        <ShortcutListener />
        {isLandingPage ? <MinimalHeader /> : <Navbar />}
        {children}
        {isLandingPage ? <MinimalFooter /> : <Footer />}
        {!isLandingPage && <OrbitChat />}
      </ScrollProvider>
    </>
  );
}
