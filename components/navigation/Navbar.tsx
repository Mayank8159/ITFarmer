"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Menu, X, Terminal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCurrency } from "@/components/CurrencyContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Posts", href: "/log" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();
  const { currency, toggleCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll Spy Logic
      if (pathname === "/") {
        const sections = ["agents", "infrastructure"];
        let current = "";

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If the section top has crossed the middle of the screen, it becomes active.
            // Since we iterate in order, the furthest down section that has crossed will overwrite the previous.
            if (rect.top <= window.innerHeight / 2) {
              current = section;
            }
          }
        }
        setActiveHash(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 flex justify-center w-full border-b-2 border-black ${scrolled ? "bg-[#f2f2f2]" : "bg-[#e5e5e5]"
          }`}
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))"
        }}
      >
        {/* Structural Grid Line across Navbar */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10 pointer-events-none -translate-y-1/2 z-0" />

        <div className="w-full max-w-[1600px] px-6 py-4 flex items-center justify-between relative z-10">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-3 group bg-white border border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="w-6 h-6 bg-black flex items-center justify-center group-hover:bg-[#ff6b00] transition-colors">
              <Terminal className="w-3 h-3 text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-black text-sm tracking-tight uppercase leading-none group-hover:text-[#ff6b00] transition-colors">Neural Forge</span>
            </div>
          </Link>

          {/* CENTER: Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isHashLink = link.href.startsWith("/#");

              // Determine active state considering scroll position on home page
              let isActive = false;
              if (pathname === "/") {
                if (link.href === "/" && !activeHash) {
                  isActive = true; // Platform is active when at top (no hash active)
                } else if (isHashLink && link.href === `/#${activeHash}`) {
                  isActive = true; // Specific hash section is active
                }
              } else {
                isActive = pathname === link.href; // Standard routing for other pages
              }

              const linkClasses = `font-mono text-xs uppercase tracking-widest transition-all relative group flex items-center gap-1 ${isActive ? "text-black font-black" : "text-black/60 hover:text-black font-bold"
                }`;

              const bracketLeft = <span className="text-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200">[</span>;
              const bracketRight = <span className="text-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">]</span>;

              if (isHashLink) {
                return (
                  <a key={link.label} href={link.href} className={linkClasses}>
                    {bracketLeft} {link.label} {bracketRight}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#ff6b00]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={linkClasses}
                  onClick={(e) => {
                    if (pathname === "/" && link.href === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      window.history.pushState(null, '', '/');
                    }
                  }}
                >
                  {bracketLeft} {link.label} {bracketRight}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#ff6b00]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-6 bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-2 py-1">

            <Link href="/contact" className="hidden sm:flex bg-black text-white px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-[#ff6b00] transition-colors">
              Book Strategy Call
            </Link>

            <button
              className="lg:hidden p-2 text-black hover:text-[#ff6b00] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#e5e5e5] flex flex-col px-6 py-8"
          >
            <div className="flex items-center justify-between mb-12">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-10 h-10 bg-white border border-black/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-black" />
                </div>
                <span className="font-bold text-black text-xl tracking-tight uppercase">Neural Forge</span>
              </Link>
              <button
                className="p-2 text-black hover:bg-black/10 border border-black/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {NAV_LINKS.map((link, idx) => {
                const isHashLink = link.href.startsWith("/#");
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {isHashLink ? (
                      <a
                        href={link.href}
                        className="text-2xl font-mono text-black hover:pl-4 transition-all duration-300 block border-b border-black/10 pb-4"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-2xl font-mono text-black hover:pl-4 transition-all duration-300 block border-b border-black/10 pb-4"
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          if (pathname === "/" && link.href === "/") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            window.history.pushState(null, '', '/');
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-auto flex flex-col gap-6">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-4 bg-[#ff6b00] text-white font-mono text-sm uppercase tracking-widest hover:bg-black transition-colors">
                Book Strategy Call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
