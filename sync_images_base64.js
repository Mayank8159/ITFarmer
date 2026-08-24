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

function getBase64DataUrl(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const bytes = fs.readFileSync(fullPath);
  const base64Data = bytes.toString('base64');
  return `data:image/jpeg;base64,${base64Data}`;
}

async function run() {
  try {
    const getRes = await fetch(`${BACKEND_URL}/data/postsContent`);
    if (!getRes.ok) throw new Error("Failed to get postsContent");
    const postsContent = await getRes.json();
    
    // Map of old path -> Base64 data URL
    const b64Urls = {};
    for (const [oldPath, localPath] of Object.entries(imageMappings)) {
      console.log(`Converting ${localPath}...`);
      b64Urls[oldPath] = getBase64DataUrl(localPath);
    }
    
    // Update postsContent
    for (const post of postsContent) {
      if (post.image && b64Urls[post.image]) {
        post.image = b64Urls[post.image];
        console.log(`Updated post: ${post.title}`);
      }
    }
    
    // Save back to AWS
    const putRes = await fetch(`${BACKEND_URL}/data/postsContent`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postsContent)
    });
    
    if (putRes.ok) {
      console.log("Successfully synced Base64 image data to AWS postsContent!");
    } else {
      console.error("Failed to update db:", await putRes.text());
    }
    
  } catch(e) {
    console.error(e);
  }
}

run();
