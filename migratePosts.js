const BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod";

async function migratePosts() {
  console.log("Fetching posts...");
  const getRes = await fetch(`${BACKEND_URL}/data/postsContent`);
  let posts = await getRes.json();
  
  console.log(`Found ${posts.length} posts. Migrating formats...`);
  
  posts = posts.map(post => {
    // Legacy projects become Works
    if (post.category === "Project") {
      post.category = "Work";
      post.scope = post.client === "Internal Engineering" || post.client === "Internal Operations" || post.client === "Internal CI/CD" ? "Internal" : "Client";
    } 
    // Legacy updates become Posts
    else if (post.category === "Update" || post.category === "Team" || post.category === "Technical Write-up") {
      post.category = "Post";
      post.scope = "Internal"; // Legacy updates were mostly internal
    }
    return post;
  });
  
  console.log("Uploading migrated data...");
  const putRes = await fetch(`${BACKEND_URL}/data/postsContent`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(posts)
  });
  
  if (putRes.ok) {
    console.log("Migration successful!");
  } else {
    console.error("Migration failed:", putRes.status, await putRes.text());
  }
}

migratePosts();
