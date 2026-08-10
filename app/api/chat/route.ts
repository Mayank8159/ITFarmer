import { NextResponse } from 'next/server';

import { BACKEND_URL } from '@/lib/backend';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Lambda chat API Error:", res.status, await res.text());
      return NextResponse.json({ error: "Failed to fetch from AI provider" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
