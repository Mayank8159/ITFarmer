const fs = require('fs');
const path = require('path');

const BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod";
const dataDir = path.join(__dirname, 'public', 'data');

async function migrate() {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const slug = file.replace('.json', '');
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    
    console.log(`Migrating ${slug}...`);
    try {
      const res = await fetch(`${BACKEND_URL}/data/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: content,
      });
      if (res.ok) {
        console.log(`  Success: ${slug}`);
      } else {
        console.error(`  Failed: ${slug} - ${res.status}`);
        console.error(await res.text());
      }
    } catch (err) {
      console.error(`  Error: ${slug}`, err);
    }
  }
}

migrate();
