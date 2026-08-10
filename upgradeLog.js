const fs = require('fs');

let code = fs.readFileSync('app/log/page.tsx', 'utf8');

// 1. Update Filter
code = code.replace(
  'const logs = posts.filter(p => p.category === "Technical Write-up" || p.category === "Update");',
  'const logs = posts.filter(p => p.category === "Post");'
);

// 2. Update Header Title
code = code.replace(
  'ENGINEERING <br /><span className="text-[#ff6b00]">LOG.</span>',
  'SYSTEM <br /><span className="text-[#ff6b00]">POSTS.</span>'
);

// 3. Update the map rendering to include client pic
const mapStr = '{logs.map((log, idx) => (';
const mapEnd = code.indexOf('))}');
if (mapEnd !== -1) {
  const newMapBlock = `{logs.map((log, idx) => (
            <motion.div
              key={log.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="block bg-white border-4 border-black p-6 md:p-8 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Meta & Client Avatar */}
                  <div className="w-full md:w-48 flex-shrink-0 flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/50 mb-2">
                        <Calendar className="w-3 h-3" /> {log.date}
                      </div>
                      <div className={\`text-[10px] font-mono font-bold text-white px-2 py-1 inline-block uppercase tracking-widest \${log.scope === "Client" ? "bg-[#ff6b00]" : "bg-black"}\`}>
                        {log.scope === "Client" ? "Client Post" : "Internal Post"}
                      </div>
                    </div>
                    {log.clientPic && (
                      <div className="w-24 h-24 border-2 border-black overflow-hidden bg-[#e5e5e5]">
                        <img src={log.clientPic} alt={log.client || "Client"} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all" />
                      </div>
                    )}
                    {log.client && (
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/70">
                        {log.client}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 border-l-0 md:border-l-2 border-black/10 pl-0 md:pl-8">
                    <h2 className="font-black text-3xl uppercase text-black mb-4 group-hover:text-[#ff6b00] transition-colors">{log.title}</h2>
                    <p className="font-mono text-sm text-black/70 leading-relaxed font-bold whitespace-pre-wrap mb-6">
                      {log.description}
                    </p>
                    {log.image && (
                      <div className="w-full border-2 border-black mt-6">
                         <img src={log.image} alt={log.title} className="w-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          `;
  
  code = code.substring(0, code.indexOf(mapStr)) + newMapBlock + code.substring(mapEnd);
}

fs.writeFileSync('app/log/page.tsx', code);
console.log("Log Page Updated!");
