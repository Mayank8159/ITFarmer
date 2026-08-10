import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/backend';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  try {
    const { file } = await params;
    
    if (!/^[a-zA-Z0-9_-]+$/.test(file)) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }
    
    const res = await fetch(`${BACKEND_URL}/data/${file}`, { 
      next: { revalidate: 60, tags: [file] } 
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
