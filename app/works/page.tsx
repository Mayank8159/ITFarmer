// app/works/page.tsx
import { Metadata } from 'next';
import ProjectShowcase from '@/components/sections/ProjectShowcase';

export const metadata: Metadata = {
  title: 'Verified Engineering Output | Neural Forge Hub',
  description: 'Production-grade infrastructure, autonomous agents, and high-throughput platforms engineered by Neural Forge Hub.',
};

export default function WorksPage() {
  return (
    <main className="bg-[#050505] text-[#F5F5F5] min-h-screen pt-32">
      {/* Editorial Page Header */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <p className="font-mono text-[11px] tracking-widest text-[#FF6A00] uppercase mb-4">
          // ARCHIVE_INDEX
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6">
          Selected <span className="text-[#FF6A00]">Architecture</span>
        </h1>
        <p className="text-lg text-[#66707A] max-w-2xl leading-relaxed">
          A verified catalog of production-grade systems, autonomous agents, and high-throughput platforms. 
          No vaporware. No conceptual mockups. Only deployed engineering.
        </p>
      </section>

      {/* The Hardened Grid */}
      <ProjectShowcase />
    </main>
  );
}
