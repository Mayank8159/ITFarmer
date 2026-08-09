"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, LayoutGrid, Users, Rocket, Info, Briefcase, FileText, Code } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "work", label: "Work", icon: LayoutGrid, path: "/work" },
  { id: "about", label: "About Us", icon: Info, path: "/about" },
  { id: "contact", label: "Contact", icon: Users, path: "/contact" },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState("home");
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(pathname.replace("/", "") || "home");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const timeoutId = setTimeout(() => {
      NAV_ITEMS.forEach((item) => {
        if (item.path.startsWith("/#") || item.id === "home") {
          const el = document.getElementById(item.id);
          if (el) observer.observe(el);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [pathname]);

  const handleNavigate = (item: any) => {
    if (pathname === "/" && (item.path.startsWith("/#") || item.id === "home")) {
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push(item.path);
    }
  };

  return (
    <motion.nav
      className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-2 p-2 rounded-2xl bg-[#0a0e27]/60 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      initial={{ x: -100, opacity: 0, width: 64 }}
      animate={{ x: 0, opacity: 1, width: isHovered ? 240 : 64 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item)}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 w-full shrink-0 group
              ${isActive
                ? "bg-[#FFD700]/15 border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                : "border border-transparent hover:bg-white/5"
              }
            `}
          >
            <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-[#FFD700]" : "text-zinc-500 group-hover:text-zinc-300"}`} />
            <span
              className={`text-[10px] font-mono uppercase tracking-[0.1em] font-bold text-left whitespace-nowrap transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"} ${isActive ? "text-[#FFD700]" : "text-zinc-400 group-hover:text-white"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
