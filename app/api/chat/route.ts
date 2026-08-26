import { NextResponse } from 'next/server';
import {
  getHeroData,
  getAboutData,
  getPostsData,
  getClientsData,
  getFaqData,
  getEcosystemData,
  getSystemConfig,
  getAboutConfig
} from '@/app/actions/adminActions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    // Clean up initial history if it includes 'ORBIT CORE ONLINE' to prevent sequence errors with Groq API
    const safeMessages = messages.filter(
      (msg) => !(msg.role === "assistant" && msg.content.includes("ORBIT CORE ONLINE"))
    );

    // Fetch all database content via our AWS data endpoints
    const [
      hero, aboutContent, posts, clients, faq, ecosystem, sysConfig, aboutConfig
    ] = await Promise.all([
      getHeroData(), getAboutData(), getPostsData(), getClientsData(),
      getFaqData(), getEcosystemData(), getSystemConfig(), getAboutConfig()
    ]);

    let dbContext = "";
    const addContext = (title: string, data: any) => {
      if (data) {
        dbContext += `[${title} DATA]\n${JSON.stringify(data)}\n\n`;
      }
    };

    addContext("HERO", hero);
    addContext("ABOUT_CONTENT", aboutContent);
    addContext("POSTS", posts);
    addContext("CLIENTS", clients);
    addContext("FAQ", faq);
    addContext("ECOSYSTEM", ecosystem);
    addContext("SYSTEM_CONFIG", sysConfig);
    addContext("ABOUT_CONFIG", aboutConfig);

    const systemPrompt = {
      role: "system",
      content: `You are ORBIT CORE, the AI assistant for ITFarmer / Neural Forge Hub. 
You have access to the complete company database below. Use this information to answer user inquiries accurately.
Keep answers concise, professional, and slightly brutalist/cyberpunk in tone.

DATABASE CONTENT:
${dbContext}`,
    };

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      console.error("GROQ_API_KEY is not defined in Next.js environment variables");
      return NextResponse.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Stable model
        messages: [systemPrompt, ...safeMessages],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json({ error: "Failed to fetch from AI provider", details: errorText }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
