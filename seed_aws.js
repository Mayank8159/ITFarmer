// Native fetch used in Node 18+

const BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod";

const heroContent = {
  headline: "BUILD. CONNECT. INFER.",
  subheadline: "We build production-ready AI software, native mobile apps, and robust web applications for technical founders and engineering teams.",
  primaryCta: { text: "Launch Neural Forge", href: "/contact", label: "Launch Neural Forge" },
  secondaryCta: { text: "Explore Ecosystem", href: "/#agents", label: "Explore Ecosystem" }
};

const aboutContent = [
  {
    id: "1", name: "Priyanshu Roy", role: "Lead AI & Systems Engineer", image: "/founders/Priyanshu.jpg", email: "services@neuralforgehub.tech", github: "https://github.com/priyanshu-ogdev", linkedin: "https://www.linkedin.com/in/priyanshu-roy-25b91a31a/",
    description: "Specializing in the intersection of deep learning and production software. Extensive experience engineering custom RAG pipelines, deploying YOLO object detection models, and building autonomous agents."
  },
  {
    id: "2", name: "Mayank Sharma", role: "Founder & Systems Architect", image: "/founders/Mayank.png", email: "services@neuralforgehub.tech", github: "https://github.com/Mayank8159", linkedin: "https://www.linkedin.com/in/mayank-kumar-sharma-900318318/",
    description: "Architecting native applications (Android & Windows .exe), high-performance software, and rigorous enterprise system designs. Focused on building robust, scalable infrastructure."
  },
  {
    id: "3", name: "Shreyan Mitra", role: "Co-Founder & Full Stack Architect", image: "/founders/Shreyan_v2.jpeg", email: "services@neuralforgehub.tech", github: "https://github.com/MURPHIOP", linkedin: "https://www.linkedin.com/in/shreyan-mitra/",
    description: "Building high-quality web platforms, seamless UI architectures, and full-stack cloud workflows from the ground up."
  }
];

const ecosystemContent = [
  { id: "1", icon: "Lock", title: "Zero-Trust Infrastructure", desc: "Military-grade access control, end-to-end encryption, and isolated execution environments.", accent: "bg-black text-white" },
  { id: "2", icon: "Terminal", title: "Autonomous Swarms", desc: "Multi-agent LLM systems that dynamically route tasks, self-heal, and parallelize complex engineering operations.", accent: "bg-[#ff6b00] text-white" },
  { id: "3", icon: "Globe", title: "Edge & Cloud Deployment", desc: "Seamless deployment across Kubernetes clusters, serverless edge functions, and global CDN networks.", accent: "bg-white border-2 border-black text-black" }
];

const postsContent = [
  {
    id: "w1", title: "Neural Forge Architecture", category: "Work", scope: "Internal", date: "2026-08", image: "",
    client: "Neural Forge Hub", technologies: "Next.js, AWS Serverless, Typescript, LangGraph",
    description: "A highly secure, brutalist architecture built for internal data orchestration.",
    challenge: "Need for a fast, edge-cached system without database overhead.",
    solution: "Serverless AWS JSON storage with Next.js App Router caching.",
    results: "Instant load times, 0 backend latency."
  }
];

const faqContent = [
  { id: "1", question: "What stack do you use?", answer: "Next.js, PyTorch, LangChain, Tailwind CSS, and AWS Serverless." },
  { id: "2", question: "Do you build native apps?", answer: "Yes, we architect native Android apps and Windows Desktop software." },
  { id: "3", question: "What is your development workflow?", answer: "We operate on a strict, anti-fragile methodology. We never build fragile UI wrappers; we engineer complete, scalable systems through a rigorous 4-phase delivery pipeline." }
];

const clientsContent = [];

async function seed(filename, data) {
  console.log("Seeding " + filename + "...");
  try {
    const res = await fetch(`${BACKEND_URL}/data/${filename}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) console.log("Success: " + filename);
    else console.log("Failed: " + filename, await res.text());
  } catch (e) {
    console.error("Error pushing " + filename, e);
  }
}

async function run() {
  await seed("heroContent", heroContent);
  await seed("aboutContent", aboutContent);
  await seed("postsContent", postsContent);
  await seed("ecosystemContent", ecosystemContent);
  await seed("faqContent", faqContent);
  await seed("clientsContent", clientsContent);
  console.log("Seeding complete.");
}

run();
