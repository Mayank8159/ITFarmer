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

    // Upgrade: Fetch ALL data from the AWS S3 database
    const filesToFetch = [
      "aboutConfig.json",
      "aboutContent.json",
      "clientsContent.json",
      "ecosystemContent.json",
      "faqContent.json",
      "heroContent.json",
      "postsContent.json",
      "systemConfig.json"
    ];

    const dataPromises = filesToFetch.map(async (file) => {
      const data = await readJson(file);
      return { file: file.replace('.json', ''), data };
    });

    const results = await Promise.all(dataPromises);
    
    let dbContext = "";
    results.forEach(res => {
      if (res.data) {
        dbContext += `[${res.file.toUpperCase()} DATA]\n${JSON.stringify(res.data)}\n\n`;
      }
    });

    // Clean up initial history if it includes 'ORBIT CORE ONLINE' to prevent sequence errors with Groq API
    const safeMessages = messages.filter(
      (msg) => !(msg.role === "assistant" && msg.content.includes("ORBIT CORE ONLINE"))
    );

    const systemPrompt = {
      role: "system",
      content: `You are ORBIT CORE, the AI assistant for ITFarmer (or Neural/Horizon Protocol). 
You have access to the complete company database below. Use this information to answer user inquiries accurately.
Keep answers concise, professional, and slightly brutalist/cyberpunk in tone.

DATABASE CONTENT:
${dbContext}`,
    };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // More stable model name for Groq
        messages: [systemPrompt, ...safeMessages],
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
