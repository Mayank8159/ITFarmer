import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  try {
    const { file } = await params;
    
    // basic validation to prevent directory traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(file)) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }
    
    const dataDir = path.join(process.cwd(), "public", "data");
    const filePath = path.join(dataDir, `${file}.json`);
    
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
