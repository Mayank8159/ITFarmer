"use server";

import fs from "fs/promises";
import path from "path";

// Paths to our JSON data files
const dataDir = path.join(process.cwd(), "public", "data");
const heroPath = path.join(dataDir, "heroContent.json");
const aboutPath = path.join(dataDir, "aboutContent.json");
const postsPath = path.join(dataDir, "postsContent.json");
const inquiriesPath = path.join(dataDir, "inquiries.json");
const clientsPath = path.join(dataDir, "clientsContent.json");
const faqPath = path.join(dataDir, "faqContent.json");
const ecosystemPath = path.join(dataDir, "ecosystemContent.json");
const systemConfigPath = path.join(dataDir, "systemConfig.json");
const aboutConfigPath = path.join(dataDir, "aboutConfig.json");

// Ensure inquiries file exists
async function ensureInquiriesFile() {
  try {
    await fs.access(inquiriesPath);
  } catch {
    await fs.writeFile(inquiriesPath, JSON.stringify([], null, 2), "utf-8");
  }
}

// Security
export async function authenticateAdmin(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) return { success: false, error: "ADMIN_PASSWORD not set in environment." };
  
  // Hardcoded fallback ONLY for local dev if .env is missing
  if (correctPassword === "Neural@123#" && password === "Neural@123#") {
    return { success: true };
  }
  
  return { success: password === correctPassword };
}

// Data Fetchers
export async function getHeroData() {
  try {
    const fileContent = await fs.readFile(heroPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return null; }
}

export async function getAboutData() {
  try {
    const fileContent = await fs.readFile(aboutPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return []; }
}

export async function getPostsData() {
  try {
    const fileContent = await fs.readFile(postsPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return []; }
}

export async function getClientsData() {
  try {
    const fileContent = await fs.readFile(clientsPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return []; }
}

export async function getFaqData() {
  try {
    const fileContent = await fs.readFile(faqPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return []; }
}

export async function getEcosystemData() {
  try {
    const fileContent = await fs.readFile(ecosystemPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return []; }
}

export async function getSystemConfig() {
  try {
    const fileContent = await fs.readFile(systemConfigPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return null; }
}

export async function saveHeroContent(data: any) {
  try {
    await fs.writeFile(heroPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function saveAboutContent(data: any) {
  try {
    await fs.writeFile(aboutPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function savePostsContent(data: any) {
  try {
    await fs.writeFile(postsPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function saveClientsContent(data: any) {
  try {
    await fs.writeFile(clientsPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function saveFaqContent(data: any) {
  try {
    await fs.writeFile(faqPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function saveEcosystemContent(data: any) {
  try {
    await fs.writeFile(ecosystemPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function saveSystemConfig(data: any) {
  try {
    await fs.writeFile(systemConfigPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function saveAboutConfig(data: any) {
  try {
    await fs.writeFile(aboutConfigPath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getAboutConfig() {
  try {
    const fileContent = await fs.readFile(aboutConfigPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) { return null; }
}

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { success: false, error: "No file provided." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bypass EROFS (read-only filesystem) by encoding the image as a Base64 Data URL
    // This allows images to be stored directly inside the JSON configurations.
    const mimeType = file.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return { success: true, filePath: dataUrl };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function submitInquiry(data: any) {
  try {
    await ensureInquiriesFile();
    const fileContent = await fs.readFile(inquiriesPath, "utf-8");
    const inquiries = JSON.parse(fileContent || "[]");
    
    const newInquiry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data
    };
    
    inquiries.unshift(newInquiry); // Add to beginning
    await fs.writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getInquiries() {
  try {
    await ensureInquiriesFile();
    const fileContent = await fs.readFile(inquiriesPath, "utf-8");
    return JSON.parse(fileContent || "[]");
  } catch (error) {
    console.error("Failed to read inquiries:", error);
    return [];
  }
}

export async function clearAllInquiries() {
  try {
    await ensureInquiriesFile();
    await fs.writeFile(inquiriesPath, JSON.stringify([], null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await ensureInquiriesFile();
    const fileContent = await fs.readFile(inquiriesPath, "utf-8");
    let inquiries = JSON.parse(fileContent || "[]");
    inquiries = inquiries.filter((inq: any) => inq.id !== id);
    await fs.writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
