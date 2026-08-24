// app/works/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { verifiedProjects, Project } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Selected Architecture | Neural Forge Hub',
  description: 'A verified catalog of production-grade systems, autonomous agents, and high-throughput platforms engineered by Neural Forge Hub.',
};

export default function WorksPage() {
  return (
    <main className="bg-[#050505] text-[#F5F5F5] min-h-screen">
      {/* HEADER — tight, no void */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-[#FF6A00] uppercase mb-4">
              {'// ARCHIVE_INDEX'}
            </p>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter">
              Selected <span className="text-[#FF6A00]">Architecture</span>
            </h1>
          </div>
          <p className="font-mono text-xs text-[#66707A]">
            {verifiedProjects.length} SYSTEMS // VERIFIED BUILDS // NO VAPORWARE
          </p>
        </div>
        <p className="mt-8 max-w-2xl text-[#94A3B8] leading-relaxed">
          A verified catalog of production-grade systems, autonomous agents, and high-throughput
          platforms. No conceptual mockups. Only deployed engineering. Select any system to read
          its full architecture breakdown.
        </p>
      </section>

      {/* GRID — 2 columns, editorial weight */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {verifiedProjects.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}

function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/works/${project.slug}`}
      className="group block bg-[#0B0D0F] border border-white/5 rounded-xl overflow-hidden hover:border-[#FF6A00]/40 transition-colors duration-300"
    >
      <div className="relative w-full aspect-[16/9] bg-[#030712] overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-mono text-xs text-[#66707A]">
            [ ASSET PENDING ]
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0F] via-transparent to-transparent" />
        <span className="absolute top-4 left-5 font-mono text-xs text-[#FF6A00]">{project.index}</span>
        <span className="absolute top-4 right-5 font-mono text-[10px] tracking-widest text-[#66707A] uppercase">
          {project.category}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-2xl font-semibold tracking-tight text-[#F5F5F5]">{project.title}</h2>
          <span className="font-mono text-xs text-[#66707A] group-hover:text-[#FF6A00] transition-colors mt-2 whitespace-nowrap">
            READ →
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[#94A3B8] mb-5">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#FF6A00] bg-white/5 border border-white/5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
