import { getPostsData } from "@/app/actions/adminActions";

export interface ProjectHighlight { title: string; desc: string }
export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  architecture: string[];
  highlights: ProjectHighlight[];
  stack: string[];
  image: string;
}

export async function fetchVerifiedProjects(): Promise<Project[]> {
  const posts = await getPostsData();
  const works = posts.filter((p: any) => p.category === "Work");
  
  return works.map((w: any, idx: number) => {
    // Parse architecture
    let cleanArch: string[] = [];
    let solText = w.solution || "";
    
    if (solText.includes('System Architecture:')) {
      const parts = solText.split('\n\nSystem Architecture:');
      solText = parts[0];
      const archSection = parts[1] || "";
      cleanArch = archSection.split('\n').filter((l: string) => l.includes('▸')).map((l: string) => l.replace('▸', '').trim());
    }
    
    // Parse highlights from results
    const highlights: ProjectHighlight[] = [];
    if (w.results) {
      const parts = w.results.split('\n\n');
      for (const part of parts) {
        const lines = part.split('\n').filter(Boolean);
        if (lines.length >= 3) {
          highlights.push({
            title: lines[1],
            desc: lines.slice(2).join(' ')
          });
        }
      }
    }
    
    return {
      slug: w.id || `work-${idx}`,
      index: String(idx + 1).padStart(2, '0'),
      title: w.title || "Untitled",
      category: w.client || "Work",
      summary: w.description || "",
      problem: w.challenge || "",
      solution: solText,
      architecture: cleanArch,
      highlights,
      stack: w.technologies ? w.technologies.split(',').map((t: string) => t.trim()) : [],
      image: w.image || ""
    };
  });
}
