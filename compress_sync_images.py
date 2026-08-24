import json
import base64
import urllib.request
from PIL import Image
from io import BytesIO

BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod"

image_mappings = {
    "/assets/res/avani_ai_1787598291980.jpg": "public/assets/res/avani_ai_1787598291980.jpg",
    "/assets/res/civiclink_1787598556959.jpg": "public/assets/res/civiclink_1787598556959.jpg",
    "/assets/res/revexbot_1787598584531.jpg": "public/assets/res/revexbot_1787598584531.jpg",
    "/assets/res/edubridge_1787598544433.jpg": "public/assets/res/edubridge_1787598544433.jpg",
    "/assets/res/goprivate_1787598275730.jpg": "public/assets/res/goprivate_1787598275730.jpg"
}

def compress_and_base64(filepath):
    print(f"Compressing {filepath}...")
    with Image.open(filepath) as img:
        # Convert to RGB just in case
        img = img.convert("RGB")
        # Resize to 800x450 (16:9)
        img.thumbnail((800, 450))
        # Save to buffer
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=75)
        # Convert to base64
        b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return f"data:image/jpeg;base64,{b64}"

def run():
    try:
        # Get postsContent
        req = urllib.request.Request(f"{BACKEND_URL}/data/postsContent", method="GET")
        with urllib.request.urlopen(req) as response:
            posts_content = json.loads(response.read().decode())
        
        # Map old paths to compressed base64
        b64_urls = {}
        for old_path, local_path in image_mappings.items():
            b64_urls[old_path] = compress_and_base64(local_path)
            
        # Update postsContent
        for post in posts_content:
            if post.get("image") in b64_urls:
                post["image"] = b64_urls[post["image"]]
                print(f"Updated post: {post['title']}")
                
        # Save back to AWS
        payload = json.dumps(posts_content).encode("utf-8")
        req = urllib.request.Request(
            f"{BACKEND_URL}/data/postsContent", 
            data=payload,
            headers={"Content-Type": "application/json"},
            method="PUT"
        )
        
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("Successfully compressed and synced Base64 image data to AWS postsContent!")
            else:
                print(f"Failed to update db: {response.read()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run()
