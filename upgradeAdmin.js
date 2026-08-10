const fs = require('fs');

let code = fs.readFileSync('app/admin/page.tsx', 'utf8');

// 1. ViewMode type
code = code.replace(
  'type ViewMode = "terminal" | "inquiries" | "hero" | "founders" | "posts" | "clients" | "faqs" | "ecosystem" | "system" | "about_cms";',
  'type ViewMode = "terminal" | "inquiries" | "hero" | "founders" | "works" | "posts" | "faqs" | "ecosystem" | "system" | "about_cms";'
);

// 2. Sidebar buttons
code = code.replace(
  '<SidebarBtn active={viewMode === "posts"} onClick={() => setViewMode("posts")} icon={FileText} label="Case Studies CMS" />',
  '<SidebarBtn active={viewMode === "works"} onClick={() => setViewMode("works")} icon={FileText} label="Works CMS" />'
);
code = code.replace(
  '<SidebarBtn active={viewMode === "clients"} onClick={() => setViewMode("clients")} icon={Star} label="Clients CMS" />',
  '<SidebarBtn active={viewMode === "posts"} onClick={() => setViewMode("posts")} icon={Star} label="Posts CMS" />'
);

// 3. Add Methods
code = code.replace(
  'const addPost = () => {\n    setPostsData([{ id: Date.now().toString(), title: "", description: "", category: "Update", date: new Date().toISOString().split(\'T\')[0], image: "" }, ...postsData]);\n  };',
  `const addWork = () => {
    setPostsData([{ id: Date.now().toString(), title: "", description: "", category: "Work", scope: "Internal", date: new Date().toISOString().split('T')[0], image: "" }, ...postsData]);
  };
  const addPost = () => {
    setPostsData([{ id: Date.now().toString(), title: "", description: "", category: "Post", scope: "Internal", date: new Date().toISOString().split('T')[0], image: "" }, ...postsData]);
  };`
);

// 4. Extract the Posts CMS tab, modify it to use findIndex, and clone it for Works CMS.
const postStr = '{viewMode === "posts" && (';
const postStart = code.indexOf(postStr);
const clientStr = '{viewMode === "clients" && (';
const clientStart = code.indexOf(clientStr);
const faqStr = '{viewMode === "faqs" && (';
const faqStart = code.indexOf(faqStr);

// We replace the entire section from postStart to faqStart.
const newWorksTab = `
            {/* WORKS EDITOR */}
            {viewMode === "works" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header title="Works CMS" onSave={onSavePosts} isSaving={isSaving} actionButton={
                  <button onClick={addWork} className="flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                    <Plus className="w-4 h-4" /> Add Work
                  </button>
                } />
                {postsData.filter(p => p.category === "Work").length === 0 ? (
                  <div className="brutalist-panel-white brutalist-border p-12 text-center flex flex-col items-center justify-center shadow-[8px_8px_0px_var(--text-primary)]">
                    <FileText className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase">No Works Found</h3>
                    <button onClick={addWork} className="mt-6 flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] border border-[var(--text-primary)] text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] transition-all shadow-[4px_4px_0px_var(--text-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                      <Plus className="w-4 h-4" /> Add First Work
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {postsData.filter(p => p.category === "Work").map((post) => {
                        const globalIndex = postsData.findIndex(p => p.id === post.id);
                        return (
                          <motion.div layout key={post.id} className="brutalist-panel-white brutalist-border p-6 group flex flex-col relative shadow-[4px_4px_0px_var(--border-color)]">
                            <button onClick={() => removePost(post.id)} className="absolute top-4 right-4 z-10 p-2 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:bg-[#ff0000] hover:text-white transition-all shadow-[2px_2px_0px_var(--border-color)]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="mb-4">
                              <Field label="COVER IMAGE">
                                <div className="flex gap-2">
                                  <input type="text" value={post.image || ""} onChange={e => { const n = [...postsData]; n[globalIndex].image = e.target.value; setPostsData(n); }} className={inputClass} placeholder="/projects/example.jpg" />
                                  <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].image = path; setPostsData(n); } }} />
                                  </label>
                                </div>
                              </Field>
                            </div>
                            <div className="space-y-4 flex-1 flex flex-col">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="TITLE"><input type="text" value={post.title || ""} onChange={e => { const n = [...postsData]; n[globalIndex].title = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                                <Field label="SCOPE">
                                  <select value={post.scope || "Internal"} onChange={e => { const n = [...postsData]; n[globalIndex].scope = e.target.value; setPostsData(n); }} className={inputClass}>
                                    <option value="Internal">Internal Project</option>
                                    <option value="Client">Client Build</option>
                                  </select>
                                </Field>
                              </div>
                              <Field label="CLIENT / ORG NAME"><input type="text" value={post.client || ""} onChange={e => { const n = [...postsData]; n[globalIndex].client = e.target.value; setPostsData(n); }} className={inputClass} placeholder="Leave empty for generic internal" /></Field>
                              <Field label="TECHNOLOGIES"><input type="text" value={post.technologies || ""} onChange={e => { const n = [...postsData]; n[globalIndex].technologies = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                              <Field label="OVERVIEW"><textarea value={post.description || ""} onChange={e => { const n = [...postsData]; n[globalIndex].description = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="THE CHALLENGE"><textarea value={post.challenge || ""} onChange={e => { const n = [...postsData]; n[globalIndex].challenge = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="THE SOLUTION"><textarea value={post.solution || ""} onChange={e => { const n = [...postsData]; n[globalIndex].solution = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="THE RESULTS"><textarea value={post.results || ""} onChange={e => { const n = [...postsData]; n[globalIndex].results = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="LIVE LINK / REPO"><input type="text" value={post.link || ""} onChange={e => { const n = [...postsData]; n[globalIndex].link = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                                <Field label="ARCHITECTURE DIAGRAM">
                                  <div className="flex gap-2">
                                    <input type="text" value={post.architectureImage || ""} onChange={e => { const n = [...postsData]; n[globalIndex].architectureImage = e.target.value; setPostsData(n); }} className={inputClass} />
                                    <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                      Upload
                                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].architectureImage = path; setPostsData(n); } }} />
                                    </label>
                                  </div>
                                </Field>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* POSTS EDITOR */}
            {viewMode === "posts" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
                <Header title="Posts CMS" onSave={onSavePosts} isSaving={isSaving} actionButton={
                  <button onClick={addPost} className="flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] bg-[var(--deep-surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                    <Plus className="w-4 h-4" /> Compose Post
                  </button>
                } />
                {postsData.filter(p => p.category === "Post").length === 0 ? (
                  <div className="brutalist-panel-white brutalist-border p-12 text-center flex flex-col items-center justify-center shadow-[8px_8px_0px_var(--text-primary)]">
                    <Star className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase">No Posts Found</h3>
                    <button onClick={addPost} className="mt-6 flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] border border-[var(--text-primary)] text-[var(--deep-surface)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] transition-all shadow-[4px_4px_0px_var(--text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                      <Plus className="w-4 h-4" /> Add First Post
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {postsData.filter(p => p.category === "Post").map((post) => {
                        const globalIndex = postsData.findIndex(p => p.id === post.id);
                        return (
                          <motion.div layout key={post.id} className="brutalist-panel-white brutalist-border p-6 group flex flex-col relative shadow-[4px_4px_0px_var(--border-color)]">
                            <button onClick={() => removePost(post.id)} className="absolute top-4 right-4 z-10 p-2 bg-[var(--surface-dark)] border border-[var(--border-color)] text-[var(--text-primary)] opacity-0 group-hover:opacity-100 hover:bg-[#ff0000] hover:text-white transition-all shadow-[2px_2px_0px_var(--border-color)]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="space-y-4 flex-1 flex flex-col">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="TITLE"><input type="text" value={post.title || ""} onChange={e => { const n = [...postsData]; n[globalIndex].title = e.target.value; setPostsData(n); }} className={inputClass} /></Field>
                                <Field label="SCOPE">
                                  <select value={post.scope || "Internal"} onChange={e => { const n = [...postsData]; n[globalIndex].scope = e.target.value; setPostsData(n); }} className={inputClass}>
                                    <option value="Internal">Internal Update</option>
                                    <option value="Client">Client Announcement</option>
                                  </select>
                                </Field>
                              </div>
                              <Field label="CLIENT / ORG NAME"><input type="text" value={post.client || ""} onChange={e => { const n = [...postsData]; n[globalIndex].client = e.target.value; setPostsData(n); }} className={inputClass} placeholder="Only for client posts" /></Field>
                              <Field label="CLIENT AVATAR / LOGO">
                                <div className="flex gap-2">
                                  <input type="text" value={post.clientPic || ""} onChange={e => { const n = [...postsData]; n[globalIndex].clientPic = e.target.value; setPostsData(n); }} className={inputClass} placeholder="/avatars/client.jpg" />
                                  <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].clientPic = path; setPostsData(n); } }} />
                                  </label>
                                </div>
                              </Field>
                              <Field label="POST CONTENT (Markdown supported)"><textarea value={post.description || ""} onChange={e => { const n = [...postsData]; n[globalIndex].description = e.target.value; setPostsData(n); }} className={textareaClass} /></Field>
                              <Field label="ATTACHED IMAGE (Optional)">
                                <div className="flex gap-2">
                                  <input type="text" value={post.image || ""} onChange={e => { const n = [...postsData]; n[globalIndex].image = e.target.value; setPostsData(n); }} className={inputClass} />
                                  <label className="cursor-pointer bg-[var(--text-primary)] text-[var(--deep-surface)] px-4 py-3 flex items-center justify-center font-bold text-xs uppercase hover:bg-[var(--neon-cyan)] transition-colors shrink-0">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const path = await handleFileUpload(e, "posts"); if (path) { const n = [...postsData]; n[globalIndex].image = path; setPostsData(n); } }} />
                                  </label>
                                </div>
                              </Field>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
`;

code = code.substring(0, postStart) + newWorksTab + code.substring(faqStart);

fs.writeFileSync('app/admin/page.tsx', code);
console.log("Admin Page Updated!");
