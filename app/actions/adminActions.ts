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

// Ensure inquiries file exists
async function ensureInquiriesFile() {
  try {
    await fs.access(inquiriesPath);
  } catch {
    await fs.writeFile(inquiriesPath, JSON.stringify([], null, 2), "utf-8");
  }
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

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const directory = formData.get("directory") as string; // 'founders', 'posts', or 'clients'
    
    if (!file) {
      return { success: false, error: "No file provided." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Secure the directory path
    const safeDir = directory === "posts" ? "posts" : directory === "clients" ? "clients" : "founders";
    const uploadDir = path.join(process.cwd(), "public", safeDir);
    
    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    return { success: true, filePath: `/${safeDir}/${file.name}` };
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
