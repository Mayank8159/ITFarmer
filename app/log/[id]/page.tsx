import { Metadata } from 'next';
import Link from 'next/link';
import { Terminal, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { getPostsData } from '@/app/actions/adminActions';

// Fetch specific post metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const posts = await getPostsData();
    const post = posts.find((p: any) => p.id === params.id);
    
    if (post) {
      return {
        title: `${post.title} | Engineering Log`,
        description: post.description,
        openGraph: {
          title: post.title,
          description: post.description,
          images: post.imageUrl || post.image ? [post.imageUrl || post.image] : undefined,
        }
      };
    }
  } catch (err) {
    console.error(err);
  }
  
  return {
    title: 'Engineering Log | Neural Forge Hub'
  };
}

export default async function LogPostPage({ params }: { params: { id: string } }) {
  let post = null;
  
  try {
    const posts = await getPostsData();
    post = posts.find((p: any) => p.id === params.id);
  } catch (err) {
    console.error(err);
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#e5e5e5] flex items-center justify-center font-mono uppercase font-bold">
        POST NOT FOUND.
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[800px] mx-auto px-6">
        
        <Link href="/log" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-black/50 hover:text-[#ff6b00] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> BACK TO LOGS
        </Link>

        {/* HEADER */}
        <div className="mb-12 border-b-4 border-black pb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="text-[10px] font-mono font-bold text-white bg-black px-3 py-1 uppercase tracking-widest">
              {post.category}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/50">
              <Calendar className="w-3 h-3" /> {post.date}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-black mb-6">
            {post.title}
          </h1>
          {post.client && (
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-black/50">
              UPLINK: {post.client}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col mb-16">
          <p className="font-mono text-sm md:text-base text-black/80 leading-relaxed whitespace-pre-wrap mb-10">
            {post.description}
          </p>

          {/* MANUAL MEDIA RENDER (IMAGE) */}
          {(post.imageUrl || post.image) && (
            <div className="w-full mb-10 border-4 border-black bg-[#f8f8f8] p-4 flex items-center justify-center relative overflow-hidden">
              <img 
                src={post.imageUrl || post.image} 
                alt={post.title} 
                className="w-full h-auto object-contain max-h-[500px]" 
              />
              <div className="absolute top-2 right-2 bg-black text-white text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-1">
                ATTACHED ASSET
              </div>
            </div>
          )}

          {/* MANUAL MEDIA RENDER (REEL) */}
          {post.reelUrl && (
            <div className="border-t-4 border-black pt-8 mt-4">
              <a 
                href={post.reelUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full block bg-black text-white p-6 font-black uppercase text-xl text-center hover:bg-[#ff6b00] hover:text-black transition-colors border-2 border-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              >
                [ WATCH REEL ON INSTAGRAM <ExternalLink className="w-6 h-6" /> ]
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
