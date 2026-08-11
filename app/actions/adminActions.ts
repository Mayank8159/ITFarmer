"use server";

import { BACKEND_URL } from "@/lib/backend";
import { revalidatePath, revalidateTag } from "next/cache";

// Security
export async function authenticateAdmin(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD?.trim();
  
  console.log("[Auth Debug] ADMIN_PASSWORD loaded:", correctPassword ? "Yes" : "No");

  if (!correctPassword) {
    console.error("[Auth Error] ADMIN_PASSWORD is undefined. Next.js did not load .env.local");
    return { success: false, error: "ADMIN_PASSWORD not set in environment. Please check .env.local and restart the server." };
  }
  
  // Hardcoded fallback ONLY for local dev if .env is missing
  if (correctPassword === "Neural@123#" && password === "Neural@123#") {
    return { success: true };
  }
  
  if (password === correctPassword) {
    return { success: true };
  } else {
    return { success: false, error: "Incorrect password." };
  }
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
    
    // NOTE: Cache is no longer purged immediately here. 
    // It will purge when the admin disconnects, or naturally expire after 60s.
    
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function finalizeAdminEdits() {
  console.log("[Admin] Disconnecting. Purging frontend cache to reflect all edits simultaneously.");
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/work');
  return { success: true };
}

// Data Fetchers
export async function getHeroData() { return (await fetchFromAWS("heroContent")) || null; }
export async function getAboutData() { return (await fetchFromAWS("aboutContent")) || []; }
export async function getPostsData() { return (await fetchFromAWS("postsContent")) || []; }
export async function getClientsData() { return (await fetchFromAWS("clientsContent")) || []; }
export async function getFaqData() { return (await fetchFromAWS("faqContent")) || []; }
export async function getEcosystemData() { return (await fetchFromAWS("ecosystemContent")) || []; }
export async function getSystemConfig() { return (await fetchFromAWS("systemConfig")) || null; }
export async function getAboutConfig() { return (await fetchFromAWS("aboutConfig")) || null; }

export async function saveHeroContent(data: any) { return saveToAWS("heroContent", data); }
export async function saveAboutContent(data: any) { return saveToAWS("aboutContent", data); }
export async function savePostsContent(data: any) { return saveToAWS("postsContent", data); }
export async function saveClientsContent(data: any) { return saveToAWS("clientsContent", data); }
export async function saveFaqContent(data: any) { return saveToAWS("faqContent", data); }
export async function saveEcosystemContent(data: any) { return saveToAWS("ecosystemContent", data); }
export async function saveSystemConfig(data: any) { return saveToAWS("systemConfig", data); }
export async function saveAboutConfig(data: any) { return saveToAWS("aboutConfig", data); }

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
    
    // Instead of relying on a non-existent AWS /upload endpoint, 
    // we encode the compressed image directly into a Data URL for JSON storage.
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return { success: true, filePath: dataUrl };
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
