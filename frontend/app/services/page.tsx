"use client";

import React, { useState, useRef, useEffect, JSX } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useInView,
  animate
} from "framer-motion";
import { 
  Code2, Cpu, Globe, Shield, ArrowRight,
  Layout, LineChart, CheckCircle, 
  Loader2, ChevronDown
} from "lucide-react";

// --- TYPES & DATA ---

interface Service {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  priceStart: string;
  features: string[];
  icon: React.ReactNode;
}

const SERVICES: Service[] = [
  {
    id: "s1",
    title: "Custom Software",
    tagline: "Monolithic & Microservices",
    desc: "Bespoke engineering for complex operational challenges. We build systems that define industries.",
    priceStart: "$25k+",
    features: ["Enterprise Architecture", "Legacy Modernization", "High-Load Systems"],
    icon: <Code2 className="w-8 h-8" />
  },
  {
    id: "s2",
    title: "Neural Systems",
    tagline: "AI & LLM Integration",
    desc: "Deploying autonomous agents and predictive models to automate your core business logic.",
    priceStart: "$40k+",
    features: ["Custom LLM Training", "Automated Agents", "Predictive Analytics"],
    icon: <Cpu className="w-8 h-8" />
  },
  {
    id: "s3",
    title: "SaaS Platforms",
    tagline: "Multi-Tenant Scalability",
    desc: "End-to-end product development for high-growth startups targeting global markets.",
    priceStart: "$30k+",
    features: ["Subscription Logic", "Multi-Tenancy", "Global CDNs"],
    icon: <Globe className="w-8 h-8" />
  },
  {
    id: "s4",
    title: "Cyber Security",
    tagline: "Fortress Architecture",
    desc: "Military-grade penetration testing and infrastructure hardening for zero-trust environments.",
    priceStart: "$15k+",
    features: ["Pen-Testing", "Compliance Audits", "Zero-Trust Setup"],
    icon: <Shield className="w-8 h-8" />
  },
  {
    id: "s5",
    title: "Product Design",
    tagline: "Spatial UI/UX",
    desc: "Award-winning interfaces focusing on conversion, retention, and cinematic user experiences.",
    priceStart: "$15k+",
    features: ["Design Systems", "Prototyping", "User Research"],
    icon: <Layout className="w-8 h-8" />
  },
  {
    id: "s6",
    title: "Growth Eng.",
    tagline: "Data-Driven Scale",
    desc: "Technical marketing infrastructure to capture, track, and convert high-value leads.",
    priceStart: "$10k+",
    features: ["Attribution Modeling", "CRM Integration", "Funnel Optimization"],
    icon: <LineChart className="w-8 h-8" />
  }
];

const PROCESS_STEPS = [
  { title: "Discovery & Blueprint", desc: "We deconstruct your vision into technical reality." },
  { title: "Strategic Architecture", desc: "Selecting the stack for scale, security, and speed." },
  { title: "Cinematic Design", desc: "Crafting interfaces that feel alive and convert." },
  { title: "Elite Fabrication", desc: "Sprint-based engineering with our senior squads." },
  { title: "Launch & Hyper-Scale", desc: "Deployment, monitoring, and continuous optimization." },
];

const STATS = [
  { label: "Projects Shipped", value: 140, suffix: "+" },
  { label: "Client ROI (Avg)", value: 300, suffix: "%" },
  { label: "Code Audited", value: 2, suffix: "M+" },
];

// --- COMPONENTS ---

export default function ServicesPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      <GrainOverlay />
      <HeroSection />
      <ServicesGrid />
      <ProcessTimeline />
      <StatsSection />
      <InquirySection />
      <FinalCTA />
    </main>
  );
}

/* 1. HERO SECTION */
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-24 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-blue-600/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-300">Accepting New Protocols</span>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl lg:text-[110px] font-black uppercase italic tracking-tighter leading-[0.9] mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {["Engineering", "The", "Impossible."].map((word, i) => (
            <motion.span 
              key={i} 
              className={`block ${i === 2 ? "text-transparent bg-clip-text bg-linear-to-r from-zinc-200 via-zinc-400 to-zinc-600" : "text-white"}`}
              variants={{
                hidden: { y: 100, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-2xl text-zinc-400 max-w-2xl font-light leading-relaxed"
        >
          We are the foundry for high-ticket digital assets. Deploying elite squads to build scalable, future-proof infrastructure for global brands.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-6"
        >
          <button onClick={() => document.getElementById('inquiry')?.scrollIntoView({behavior: 'smooth'})} className="group relative px-8 py-4 bg-white text-black text-sm font-black uppercase tracking-widest overflow-hidden rounded-none hover:scale-105 transition-transform duration-300">
            <span className="relative z-10 flex items-center gap-2">Start Project <ArrowRight className="w-4 h-4" /></span>
          </button>
          <button className="px-8 py-4 border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
            View Case Studies
          </button>
        </motion.div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-[#020202] to-transparent z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </section>
  );
}

/* 2. SERVICES GRID */
function ServicesGrid() {
  return (
    <section className="relative py-32 px-6 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <h2 className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4">Core Capabilities</h2>
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Our Services</h3>
          </div>
          <p className="text-zinc-500 max-w-sm text-right mt-6 md:mt-0 font-mono text-xs">
            {/* DEPLOYING ELITE ENGINEERING SQUADS */}
            <br />
            {/* ACROSS SIX STRATEGIC DOMAINS */}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. INDIVIDUAL SERVICE CARD (TILT & EXPAND) */
function ServiceCard({ service }: { service: Service }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative min-h-100 bg-zinc-900/40 border border-white/10 rounded-4xl p-8 backdrop-blur-xl flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/5 group-hover:to-transparent transition-all duration-700 ease-in-out" />
      
      {/* Neon Border on Hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-4xl transition-colors duration-300" />

      <div className="relative z-10 transform transition-transform duration-300 group-hover:translate-z-10">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all duration-300 mb-8">
          {service.icon}
        </div>
        
        <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">{service.tagline}</h4>
        <h3 className="text-3xl font-black italic uppercase tracking-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
          {service.title}
        </h3>
        <p className="text-zinc-400 font-light leading-relaxed mb-6 group-hover:text-white transition-colors">
          {service.desc}
        </p>
      </div>

      {/* Expanded Content (Visible on Hover/Focus) */}
      <div className="relative z-10 border-t border-white/10 pt-6 mt-auto">
        <div className="flex flex-col gap-3 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-blue-400">
            <span>ENGAGEMENT START</span>
            <span>{service.priceStart}</span>
          </div>
          <ul className="space-y-2">
            {service.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle className="w-3 h-3 text-blue-500" /> {feat}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Default State Indicator */}
        <div className="flex justify-between items-center group-hover:hidden transition-all duration-300">
          <span className="text-xs font-mono uppercase text-zinc-600">Explore Details</span>
          <ChevronDown className="w-4 h-4 text-zinc-600 animate-bounce" />
        </div>
      </div>
    </motion.div>
  );
}

/* 4. PROCESS TIMELINE */
function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">The Protocol</h2>
          <p className="text-zinc-500 mt-4">From Chaos to clarity in five steps.</p>
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-3.75 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          <motion.div 
            style={{ height }}
            className="absolute left-3.75 md:left-1/2 top-0 w-px bg-linear-to-b from-blue-500 via-purple-500 to-blue-500 -translate-x-1/2 z-10"
          />

          <div className="space-y-24">
            {PROCESS_STEPS.map((step, i) => (
              <ProcessStep key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index }: { step: { title: string, desc: string }, index: number }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''} items-center`}
    >
      <div className="flex-1 w-full md:w-1/2" />
      
      {/* Node */}
      <div className="absolute left-3.75 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border border-blue-500/50 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>

      <div className={`flex-1 w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
        <span className="text-blue-500 font-mono text-sm font-bold mb-2 block">PHASE 0{index + 1}</span>
        <h3 className="text-2xl font-bold uppercase italic mb-3 text-white">{step.title}</h3>
        <p className="text-zinc-400 font-light leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

/* 5. INQUIRY FORM (PREMIUM) */
function InquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <section id="inquiry" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Initialize Project</h2>
          <p className="text-zinc-400">Secure your slot in our production pipeline.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-4xl space-y-8 shadow-2xl"
        >
          {!isSuccess ? (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <InputGroup label="Name" placeholder="John Doe" type="text" />
                <InputGroup label="Company" placeholder="Acme Inc." type="text" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <InputGroup label="Email" placeholder="john@acme.com" type="email" />
                <InputGroup label="Budget" placeholder="$25k - $100k+" type="text" />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Service Required</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Software", "AI/ML", "SaaS", "Security", "Design", "Other"].map((opt) => (
                    <label key={opt} className="cursor-pointer group">
                      <input type="radio" name="service" className="peer sr-only" />
                      <div className="px-4 py-3 rounded-xl bg-black border border-white/10 text-zinc-400 text-sm text-center peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-500 transition-all group-hover:border-white/30">
                        {opt}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Briefing</label>
                <textarea 
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors resize-none h-24"
                  placeholder="Tell us about your mission..."
                />
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-3 mt-8"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Transmit Request"}
              </button>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Transmission Received</h3>
              <p className="text-zinc-400">Our operations team is decoding your brief. Expect contact within 24 hours.</p>
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function InputGroup({ label, placeholder, type }: { label: string, placeholder: string, type: string }) {
  return (
    <div className="flex flex-col gap-2 relative group">
      <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 group-focus-within:text-blue-500 transition-colors">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="bg-transparent border-b border-white/20 py-2 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500 transition-colors w-full"
      />
    </div>
  );
}

/* 6. STATS / SOCIAL PROOF */
function StatsSection() {
  return (
    <section className="py-20 border-y border-white/5 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {STATS.map((stat, i) => (
          <Counter key={i} {...stat} />
        ))}
      </div>
    </section>
  );
}

function Counter({ label, value, suffix }: { label: string, value: number, suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, value, count]);

  return (
    <div ref={ref}>
      <div className="text-5xl md:text-7xl font-black text-white mb-2 flex justify-center">
        <motion.span>{rounded}</motion.span>{suffix}
      </div>
      <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

/* 7. FINAL CTA */
function FinalCTA() {
  return (
    <section className="py-32 px-6 bg-linear-to-b from-[#020202] to-blue-950/20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">
          Ready to <br /> <span className="text-blue-500">Dominate?</span>
        </h2>
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
          Stop building average software. Partner with an agency that treats your infrastructure as a weapon.
        </p>
        <button 
          onClick={() => document.getElementById('inquiry')?.scrollIntoView({behavior: 'smooth'})}
          className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase tracking-widest text-sm shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
        >
          Secure Your Squad
        </button>
      </div>
    </section>
  );
}

/* UTILS */
function GrainOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-9999 mix-blend-overlay">
      <svg className="w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}