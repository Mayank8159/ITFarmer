"use server";

import { BACKEND_URL } from "@/lib/backend";
import { revalidatePath, revalidateTag } from "next/cache";

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

async function fetchFromAWS(filename: string) {
  try {
    // Statically cache the API response for 60 seconds, but tag it for on-demand invalidation
    const res = await fetch(`${BACKEND_URL}/data/${filename}`, { 
      next: { revalidate: 60, tags: [filename] } 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch ${filename}:`, error);
    return null;
  }
}

async function saveToAWS(filename: string, data: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/data/${filename}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save to AWS");
    
    // Immediately purge Next.js cache so changes reflect instantaneously on the live site
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/work');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Data Fetchers
export async function getHeroData() { return (await fetchFromAWS("heroContent.json")) || null; }
export async function getAboutData() { return (await fetchFromAWS("aboutContent.json")) || []; }
export async function getPostsData() { return (await fetchFromAWS("postsContent.json")) || []; }
export async function getClientsData() { return (await fetchFromAWS("clientsContent.json")) || []; }
export async function getFaqData() { return (await fetchFromAWS("faqContent.json")) || []; }
export async function getEcosystemData() { return (await fetchFromAWS("ecosystemContent.json")) || []; }
export async function getSystemConfig() { return (await fetchFromAWS("systemConfig.json")) || null; }
export async function getAboutConfig() { return (await fetchFromAWS("aboutConfig.json")) || null; }

export async function saveHeroContent(data: any) { return saveToAWS("heroContent.json", data); }
export async function saveAboutContent(data: any) { return saveToAWS("aboutContent.json", data); }
export async function savePostsContent(data: any) { return saveToAWS("postsContent.json", data); }
export async function saveClientsContent(data: any) { return saveToAWS("clientsContent.json", data); }
export async function saveFaqContent(data: any) { return saveToAWS("faqContent.json", data); }
export async function saveEcosystemContent(data: any) { return saveToAWS("ecosystemContent.json", data); }
export async function saveSystemConfig(data: any) { return saveToAWS("systemConfig.json", data); }
export async function saveAboutConfig(data: any) { return saveToAWS("aboutConfig.json", data); }

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { success: false, error: "No file provided." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');

    // Send to AWS Backend
    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: base64Data, mimeType }),
    });

    if (!res.ok) {
      throw new Error("Failed to upload image to AWS");
    }

    const data = await res.json();
    return { success: true, filePath: data.filePath };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function submitInquiry(data: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to submit inquiry");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getInquiries() {
  try {
    const res = await fetch(`${BACKEND_URL}/inquiries`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to read inquiries:", error);
    return [];
  }
}

export async function clearAllInquiries() {
  try {
    const res = await fetch(`${BACKEND_URL}/inquiries`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to clear inquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteInquiry(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/inquiries/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete inquiry");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
