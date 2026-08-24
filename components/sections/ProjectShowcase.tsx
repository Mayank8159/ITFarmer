// components/sections/ProjectShowcase.tsx
"use client";
import Image from 'next/image';
import { useState } from 'react';
import { verifiedProjects } from '@/lib/projects';

export default function ProjectShowcase() {
  return (
    <section id="work" className="w-full bg-[#050505] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {verifiedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group bg-[#0B0D0F] border border-white/5 rounded-xl overflow-hidden hover:border-[#FF6A00]/30 transition-all duration-300 flex flex-col h-full">
      {/* Strict Aspect Ratio Container prevents Cumulative Layout Shift (CLS) */}
      <div className="relative w-full aspect-[16/9] bg-[#030712] overflow-hidden">
        {!imgError ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          // Graceful Fallback if image is missing (Prevents broken UI vulnerability)
          <div className="absolute inset-0 flex items-center justify-center text-[#66707A] font-mono text-xs border border-white/5">
            [ ASSET PENDING ]
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0F] via-transparent to-transparent opacity-80" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-[#F5F5F5] mb-3 tracking-tight">
          {project.title}
        </h3>
        <p className="text-sm text-[#94A3B8] leading-relaxed mb-4 flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.stack.map((tech: string) => (
            <span 
              key={tech} 
              className="px-2 py-1 text-[10px] font-mono tracking-wider uppercase bg-white/5 text-[#FF6A00] border border-white/5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
