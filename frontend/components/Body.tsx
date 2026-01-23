"use client";

import React, { useRef, useState, JSX } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, 
  ShieldCheck, 
  Search, 
  Zap, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Star,
  Quote
} from "lucide-react";

/**
 * DATA TYPE INTERFACES
 * Defining these explicitly prevents "implicit any" errors during Vercel's Typecheck stage.
 */
interface OSModule {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface TestimonialData {
  name: string;
  role: string;
  content: string;
  avatar: string;
  glow: string;
}

interface PipelineStep {
  title: string;
  sub: string;
}

interface StatItem {
  label: string;
  value: string;
}

/**
 * DATA DEFINITIONS
 */
const OPERATING_SYSTEM_MODULES: OSModule[] = [
  {
    title: "Talent Engine",
    description: "Multi-stage vetting process ensuring only the top 1% of specialized engineering talent enters our farm.",
    icon: <Search className="w-6 h-6" />,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Project Management OS",
    description: "Integrated agile workflows with real-time sprint tracking and transparent milestone reporting.",
    icon: <Terminal className="w-6 h-6" />,
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "QA & Security Layer",
    description: "Automated testing pipelines and military-grade security audits embedded in every deployment.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "AI Automation Layer",
    description: "Leveraging LLM-driven code reviews and automated documentation to accelerate delivery speed.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-yellow-500/20 to-orange-500/20"
  },
  {
    title: "Client Control Hub",
    description: "Direct dashboard access to team performance, documentation, and instant communication channels.",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-indigo-500/20 to-blue-500/20"
  },
  {
    title: "Performance Monitoring",
    description: "Deep analytics on velocity, code quality metrics, and infrastructure health, 24/7.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-rose-500/20 to-red-500/20"
  }
];

const TESTIMONIALS: TestimonialData[] = [
  {
    name: "Alexander Volkov",
    role: "CTO, Nexus Dynamics",
    content: "The precision of their Talent Engine is unmatched. We assembled a 10-man specialized squad in under 72 hours. It feels like having an internal elite team.",
    avatar: "https://i.pravatar.cc/150?u=alex",
    glow: "rgba(59, 130, 246, 0.5)"
  },
  {
    name: "Sarah Chen",
    role: "Head of Product, Solara AI",
    content: "Scaling our infrastructure was becoming a nightmare until we integrated with their OS. The transparency gave us the confidence to ship 30% faster.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    glow: "rgba(168, 85, 247, 0.5)"
  },
  {
    name: "Marcus Thorne",
    role: "VP Engineering, Quantix",
    content: "Military-grade is an understatement. Their Security Layer caught vulnerabilities our previous vendors missed.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    glow: "rgba(16, 185, 129, 0.5)"
  }
];

const PIPELINE_STEPS: PipelineStep[] = [
  { title: "Onboarding", sub: "Architecture Mapping" },
  { title: "Assembly", sub: "Squad Formulation" },
  { title: "Execution", sub: "Agile Sprints" },
  { title: "Validation", sub: "QA & Security Audit" },
  { title: "Scaling", sub: "Production Release" }
];

const STATS: StatItem[] = [
  { label: "Delivery SLA", value: "99.9%" },
  { label: "Engineers", value: "50+" },
  { label: "Uptime Support", value: "24/7" },
  { label: "Coverage", value: "Global" }
];

/**
 * COMPONENTS
 */
const SystemCard = ({ module, index }: { module: OSModule, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group relative p-8 rounded-[2rem] bg-zinc-900/40 border border-white/10 backdrop-blur-xl overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-blue-400 group-hover:text-white transition-colors">
        {module.icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight text-white">{module.title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
        {module.description}
      </p>
    </div>
  </motion.div>
);

export default function NextSection(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section ref={containerRef} className="relative bg-[#020202] text-white py-32 px-6 lg:px-24 overflow-hidden selection:bg-blue-500/30">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      
      {/* SECTION HEADER */}
      <div className="max-w-4xl mb-24">
        <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="inline-block text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4">
          Operating System
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 italic uppercase leading-none">
          A Scalable Remote <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">IT Engine.</span>
        </motion.h2>
      </div>

      {/* CORE MODULE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
        {OPERATING_SYSTEM_MODULES.map((module, idx) => (
          <SystemCard key={idx} module={module} index={idx} />
        ))}
      </div>

      {/* PIPELINE VISUALIZATION */}
      <div className="relative py-24 border-y border-white/5 bg-zinc-900/10 rounded-[3rem] px-8 overflow-hidden mb-40">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-blue-500/20 via-white/10 to-purple-500/20" />
          {PIPELINE_STEPS.map((step, idx) => (
            <motion.div key={`step-${idx}`} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className="relative flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full bg-[#050505] border border-white/20 flex items-center justify-center mb-6 z-10 transition-all group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <span className="text-xs font-bold font-mono text-zinc-500 group-hover:text-blue-400">0{idx + 1}</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 px-4">{step.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS DIAL */}
      <div className="mb-40 relative">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-20">
          <Quote className="w-12 h-12 text-blue-500/20 mx-auto mb-6" />
          <h3 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">Client Deployments</h3>
        </motion.div>

        <div className="relative h-[500px] md:h-[400px] flex items-center justify-center overflow-visible">
          {TESTIMONIALS.map((testimonial, i) => {
            const isCenter = i === activeIndex;
            const isLeft = i === (activeIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
            const isRight = i === (activeIndex + 1) % TESTIMONIALS.length;
            const isVisible = isCenter || isLeft || isRight;

            if (!isVisible) return null;

            return (
              <motion.div
                key={`testimonial-${i}`}
                initial={false}
                animate={{
                  x: isCenter ? 0 : isLeft ? -350 : 350,
                  scale: isCenter ? 1 : 0.8,
                  opacity: isCenter ? 1 : 0.3,
                  zIndex: isCenter ? 20 : 10,
                  rotateY: isCenter ? 0 : isLeft ? 15 : -15,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute w-full max-w-xl p-8 lg:p-12 rounded-[2.5rem] bg-zinc-900/40 border border-white/10 backdrop-blur-3xl shadow-2xl"
              >
                <div 
                  className="absolute -top-12 -right-12 w-48 h-48 blur-[80px] rounded-full opacity-50 pointer-events-none"
                  style={{ backgroundColor: testimonial.glow }}
                />
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <img src={testimonial.avatar} className="w-16 h-16 rounded-xl border border-white/10" alt={testimonial.name} />
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider">{testimonial.name}</h4>
                      <p className="text-xs font-mono text-blue-500 uppercase">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-lg text-zinc-300 italic font-light">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, star) => <Star key={star} className="w-3 h-3 fill-blue-500 text-blue-500" />)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center items-center gap-12 mt-12">
          <button onClick={prevTestimonial} className="group p-4 rounded-full border border-white/10 bg-zinc-900/50 hover:border-blue-500 hover:text-blue-500 transition-all active:scale-90">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            {TESTIMONIALS.map((_, i) => (
              <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${activeIndex === i ? "w-10 bg-blue-500" : "w-2 bg-zinc-800"}`} />
            ))}
          </div>
          <button onClick={nextTestimonial} className="group p-4 rounded-full border border-white/10 bg-zinc-900/50 hover:border-blue-500 hover:text-blue-500 transition-all active:scale-90">
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-40">
        {STATS.map((stat, idx) => (
          <motion.div key={`stat-${idx}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center group">
            <span className="text-4xl lg:text-5xl font-black mb-2 text-white group-hover:text-blue-500 transition-colors block">{stat.value}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold block">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* BOTTOM CTA */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center">
        <div className="w-px h-24 bg-gradient-to-b from-blue-500 to-transparent mb-12" />
        <h4 className="text-2xl font-bold text-white mb-8 uppercase tracking-tighter">Ready to deploy your elite squad?</h4>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest">
          Initiate Onboarding <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </section>
  );
}