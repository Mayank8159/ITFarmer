const fs = require('fs');

let code = fs.readFileSync('app/work/page.tsx', 'utf8');

// 1. Update Filters
code = code.replace(
  'const projects = posts.filter(p => p.category === "Project");',
  'const projects = posts.filter(p => p.category === "Work");'
);
code = code.replace(
  'const updates = posts.filter(p => p.category === "Update" || p.category === "Team");\n',
  ''
);

// 2. Update Badge
code = code.replace(
  '{project.client || "Internal Project"} • {project.date}',
  '[{project.scope === "Client" ? "CLIENT BUILD" : "INTERNAL BUILD"}] • {project.client ? project.client : "Neural Forge Hub"} • {project.date}'
);

// 3. Remove System Updates section completely
const updateStart = code.indexOf('{/* LIVE UPDATES SECTION */}');
const mainEnd = code.lastIndexOf('</div>\n    </main>');
if (updateStart !== -1 && mainEnd !== -1) {
  code = code.substring(0, updateStart) + code.substring(mainEnd);
}

fs.writeFileSync('app/work/page.tsx', code);
console.log("Work Page Updated!");
