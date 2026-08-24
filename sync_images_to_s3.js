const fs = require('fs');
const path = require('path');

const BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod";

const imageMappings = {
  "/assets/res/avani_ai_1787598291980.jpg": "public/assets/res/avani_ai_1787598291980.jpg",
  "/assets/res/civiclink_1787598556959.jpg": "public/assets/res/civiclink_1787598556959.jpg",
  "/assets/res/revexbot_1787598584531.jpg": "public/assets/res/revexbot_1787598584531.jpg",
  "/assets/res/edubridge_1787598544433.jpg": "public/assets/res/edubridge_1787598544433.jpg",
  "/assets/res/goprivate_1787598275730.jpg": "public/assets/res/goprivate_1787598275730.jpg"
};

async function uploadToS3(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const bytes = fs.readFileSync(fullPath);
  const base64Data = bytes.toString('base64');
  const mimeType = "image/jpeg";
  
  const res = await fetch(`${BACKEND_URL}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: base64Data, mimeType })
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${filePath}: ${text}`);
  }
  const data = await res.json();
  return data.filePath; // S3 URL
}

async function run() {
  try {
    const getRes = await fetch(`${BACKEND_URL}/data/postsContent`);
    if (!getRes.ok) throw new Error("Failed to get postsContent");
    const postsContent = await getRes.json();
    
    // Upload images and keep a map of old path -> S3 url
    const s3Urls = {};
    for (const [oldPath, localPath] of Object.entries(imageMappings)) {
      console.log(`Uploading ${localPath}...`);
      const s3Url = await uploadToS3(localPath);
      s3Urls[oldPath] = s3Url;
      console.log(`  -> ${s3Url}`);
    }
    
    // Update postsContent
    for (const post of postsContent) {
      if (post.image && s3Urls[post.image]) {
        post.image = s3Urls[post.image];
      }
    }
    
    // Save back to AWS
    const putRes = await fetch(`${BACKEND_URL}/data/postsContent`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postsContent)
    });
    
    if (putRes.ok) {
      console.log("Successfully synced S3 URLs to postsContent!");
    } else {
      console.error("Failed to update db:", await putRes.text());
    }
    
  } catch(e) {
    console.error(e);
  }
}

run();
