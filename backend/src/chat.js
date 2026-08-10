const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const { json } = require("./lib/response");

const s3 = new S3Client();
const BUCKET = process.env.CONTENT_BUCKET;

async function readJson(key) {
  try {
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    return JSON.parse(await Body.transformToString());
  } catch (error) {
    return null;
  }
}

exports.handler = async (event) => {
  try {
    const { messages } = JSON.parse(event.body || "{}");
    if (!Array.isArray(messages)) {
      return json(400, { error: "messages array required" });
    }

    const founders = (await readJson("aboutContent.json")) || [];
    const aboutConfig = (await readJson("aboutConfig.json")) || {};
    const posts = (await readJson("postsContent.json")) || [];
    const capabilities = aboutConfig.capabilities || [];

    const founderNames = founders.map((f) => `${f.name} (${f.role})`).join(", ");
    const capNames = capabilities.map((c) => c.title).join(", ");
    const postTitles = posts.slice(0, 5).map((p) => p.title).join(", ");

    const systemPrompt = {
      role: "system",
      content: `You are ORBIT CORE, the AI assistant for ITFarmer (or Neural/Horizon Protocol). 
Company Founders: ${founderNames}.
Core Capabilities: ${capNames}.
Recent Updates/Projects: ${postTitles}.
Keep answers concise, professional, and slightly brutalist/cyberpunk in tone.`,
    };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [systemPrompt, ...messages],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Groq API Error:", errorText);
      return json(500, { error: "Failed to fetch from AI provider" });
    }

    const data = await res.json();
    return json(200, data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return json(500, { error: "Internal Server Error" });
  }
};
