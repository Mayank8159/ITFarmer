"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Phone } from "lucide-react";

/* EXISTING COMPONENTS */
import FloatingNavbar from "@/components/Navbar";
import OrbitChat from "@/components/orbit/OrbitChat";

export default function AboutPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-[#020202] text-white overflow-hidden">
      
      <FloatingNavbar />
      <OrbitChat />

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-36 pb-28">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter"
        >
          About <span className="text-zinc-400">Us</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 max-w-2xl text-zinc-400 font-light leading-relaxed"
        >
          We build intelligent, scalable, and future-ready digital products
          for startups and enterprises.
        </motion.p>
      </section>

      {/* MISSION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <AnimatedBorderCard>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Mission
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Transform ideas into powerful digital products using modern
            web technologies, AI, and scalable system design.
          </p>
        </AnimatedBorderCard>
      </section>

      {/* FOUNDERS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-14"
        >
          The Creators
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          <FounderCard
            name="Mayank Kumar Sharma"
            role="Co-Founder & Full-Stack Developer"
            email="team.techserve55@gmail.com"
            phone="+918159842418"
            githubUrl="https://github.com/Mayank8159"
            linkedinUrl="https://www.linkedin.com/in/mayank-kumar-sharma-900318318/"
            imageSrc="/founders/Mayank.png"
            description="System architecture, AI platforms, and scalable product engineering."
          />

          <FounderCard
            name="Shreyan Mitra"
            role="Co-Founder & Software Developer"
            email="team.techserve55@gmail.com"
            phone="+918240591893"
            githubUrl="https://github.com/shreyan"
            linkedinUrl="https://linkedin.com/in/shreyan"
            imageSrc="/founders/shreyan.jpeg"
            description="Backend engineering, performance optimization, and reliability."
          />
        </div>
      </section>
    </main>
  );
}

/* ===================== ANIMATED BORDER CARD ===================== */

function AnimatedBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative rounded-3xl p-[1.5px] overflow-hidden"
    >
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="absolute inset-0 rounded-3xl
          bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.7),transparent)]
          bg-[length:200%_100%]"
      />

      <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl opacity-30" />

      <div className="relative bg-zinc-950/80 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">
        {children}
      </div>
    </motion.div>
  );
}

/* ===================== FOUNDER CARD ===================== */

function FounderCard({
  name,
  role,
  email,
  phone,
  description,
  imageSrc,
  githubUrl,
  linkedinUrl,
}: {
  name: string;
  role: string;
  email: string;
  phone: string;
  description: string;
  imageSrc: string;
  githubUrl: string;
  linkedinUrl: string;
}) {
  return (
    <AnimatedBorderCard>
      {/* PROFILE */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 p-[2px] shadow-[0_0_25px_rgba(255,255,255,0.2)]">
          <div className="relative h-full w-full rounded-full overflow-hidden bg-black">
            <Image src={imageSrc} alt={name} fill className="object-cover" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-zinc-400 text-sm">{role}</p>
        </div>
      </div>

      <p className="text-zinc-400 leading-relaxed mb-6">{description}</p>

      {/* CONTACT */}
      <div className="flex flex-wrap items-center gap-4">
        <a href={`mailto:${email}`} className="flex items-center gap-2 text-zinc-300 hover:text-white">
          <Mail className="h-4 w-4" /> <span className="text-sm">{email}</span>
        </a>

        <a href={`tel:${phone}`} className="flex items-center gap-2 text-zinc-300 hover:text-white">
          <Phone className="h-4 w-4" /> <span className="text-sm">Call</span>
        </a>

        <div className="flex gap-3 ml-auto">
          <a href={githubUrl} target="_blank">
            <Github className="h-5 w-5 text-zinc-500 hover:text-white transition" />
          </a>
          <a href={linkedinUrl} target="_blank">
            <Linkedin className="h-5 w-5 text-zinc-500 hover:text-white transition" />
          </a>
        </div>
      </div>
    </AnimatedBorderCard>
  );
}
