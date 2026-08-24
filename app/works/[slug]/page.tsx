// app/works/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { verifiedProjects } from '@/lib/projects';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return verifiedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = verifiedProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} | Neural Forge Hub`, description: project.summary };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = verifiedProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="bg-[#050505] text-[#F5F5F5] min-h-screen">
      <article className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <Link
          href="/works"
          className="font-mono text-xs text-[#66707A] hover:text-[#FF6A00] transition-colors"
        >
          ← ALL SYSTEMS
        </Link>

        <header className="mt-8 mb-10">
          <p className="font-mono text-[11px] tracking-widest text-[#FF6A00] uppercase mb-4">
            {project.index} {'//'} {project.category}
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6">{project.title}</h1>
          <p className="text-lg text-[#94A3B8] leading-relaxed max-w-3xl">{project.summary}</p>
        </header>

        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-[#030712] mb-12">
          {project.image && (
            <Image src={project.image} alt={project.title} fill sizes="100vw" className="object-cover" />
          )}
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs tracking-widest text-[#66707A] uppercase mb-4">Overview</h2>
            <p className="text-[#F5F5F5]/90 leading-relaxed whitespace-pre-line">{project.overview}</p>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-mono text-xs tracking-widest text-[#66707A] uppercase mb-4">Architecture</h2>
            <ul className="space-y-3">
              {project.architecture.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-[#94A3B8] leading-relaxed">
                  <span className="text-[#FF6A00] font-mono">▸</span>
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="font-mono text-xs tracking-widest text-[#66707A] uppercase mt-8 mb-4">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#FF6A00] bg-white/5 border border-white/5 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-6">
          <p className="font-mono text-xs text-[#66707A]">VERIFIED BUILD {'//'} NEURAL FORGE ARCHIVE</p>
          <a
            href="https://cal.com/neural-forge-hub"
            target="_blank"
            rel="noreferrer"
            className="bg-[#FF6A00] hover:bg-[#e05e00] text-[#050505] font-semibold text-sm tracking-wide rounded-md px-6 py-3 transition-colors"
          >
            BOOK STRATEGY CALL →
          </a>
        </div>
      </article>
    </main>
  );
}
