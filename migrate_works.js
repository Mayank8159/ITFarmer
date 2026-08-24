const BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod";

const newWorks = [
  {
    id: "goprivate-edr",
    title: "GoPrivate EDR",
    category: "Work",
    scope: "Internal",
    date: "2026-08",
    image: "/assets/projects/goprivate.jpg",
    client: "Cybersecurity & Edge AI",
    technologies: "C++, JNI, Android NDK, TFLite, VpnService API",
    description: "An open-source, entirely on-device machine learning firewall for Android that performs real-time network traffic interception and threat scoring.",
    challenge: "Traditional network security requires cloud telemetry which compromises user privacy and is prone to latency.",
    solution: "A zero-cloud architecture bridging a C++ system-level JNI with heavily optimized local sequence models to detect anomalous network patterns locally.\n\nSystem Architecture:\n▸ Native Packet Interceptor (C++ JNI) hooking into Android VpnService\n▸ Lightweight Feature Extractor for flow-level metadata\n▸ Quantized Threat Classifier (TFLite INT8 sequence model)\n▸ Telemetry Hub with cryptographic integrity checks",
    results: "01\nZero Remote Inference\n100% of ML execution is isolated in a native Android process for absolute privacy.\n\n02\nMemory-Safe Custom Allocators\nEliminated OOM crashes during sustained heavy traffic bursts.\n\n03\nSub-50ms Latency\nCompressed model footprint to under 8MB through structured pruning and QAT.",
    link: "",
    architectureImage: ""
  },
  {
    id: "avani-ai",
    title: "Avani AI",
    category: "Work",
    scope: "Internal",
    date: "2026-08",
    image: "/assets/projects/avani-ai.jpg",
    client: "AI & NLP Systems",
    technologies: "Python, PyTorch, Local LLMs, ONNX Runtime, Bayesian Networks",
    description: "An advanced natural language perception engine utilizing a highly optimized single-model, two-pass pipeline for extreme low-latency intent extraction.",
    challenge: "LLM orchestration on edge devices struggles with memory overhead and context latency limitations.",
    solution: "The V21.0-Lite dual-pass RAG architecture optimized for extreme low-latency context retrieval and synthesis directly on hardware-constrained devices.\n\nSystem Architecture:\n▸ V21.0-Lite Pipeline for low-latency context retrieval\n▸ Intent Recognition Matrix driven by NLP state machines\n▸ Semantic Chunking Engine for conversational history\n▸ Probabilistic Decision Layer with Bayesian networks",
    results: "01\nOn-Device Execution\n100% on-device processing ensures conversational text vectors never leave the hardware.\n\n02\nHardware-Aware Quantization\nINT8 quantization preserves linguistic accuracy while maximizing token throughput.\n\n03\nSub-800ms End-to-End Latency\nAchieved sub-800ms generation on edge hardware under 4GB VRAM limits.",
    link: "",
    architectureImage: ""
  },
  {
    id: "edubridge",
    title: "Edubridge",
    category: "Work",
    scope: "Internal",
    date: "2026-08",
    image: "/assets/projects/edubridge.jpg",
    client: "Full-Stack Architecture",
    technologies: "Next.js 14, Supabase, PostgreSQL, WebSockets, Service Workers",
    description: "A comprehensive educational platform featuring automated curriculum generation and intelligent, offline-first classroom API management.",
    challenge: "Educational platforms often fail in low-connectivity environments and struggle with rigid curriculum generation.",
    solution: "An offline-first PWA leveraging semantic NLP for dynamic topic sequencing, paired with robust state propagation and conflict resolution.\n\nSystem Architecture:\n▸ NLP Curriculum Engine for dynamic sequencing\n▸ Offline-First PWA Core utilizing Service Workers\n▸ Real-Time Sync Layer over WebSockets\n▸ RBAC & Data Isolation with PostgreSQL Row-Level Security",
    results: "01\nOffline-First Reliability\nFull data submission capabilities in low-connectivity environments with cryptographic queueing.\n\n02\nDynamic Generation\nGenerates a 12-week syllabus with 40+ dynamic topics in under 3 seconds.\n\n03\nQuery Optimization\nCut dashboard rendering times from 2.1s to 340ms using materialized views.",
    link: "",
    architectureImage: ""
  },
  {
    id: "civiclink",
    title: "CivicLink",
    category: "Work",
    scope: "Internal",
    date: "2026-08",
    image: "/assets/projects/civiclink.jpg",
    client: "Autonomous Agents & LLMs",
    technologies: "Python, FastAPI, LangGraph, Groq (Llama-3.3-70B), Google Gemini, Playwright",
    description: "An autonomous, multi-agent AI pipeline engineered to process, verify, and resolve citizen grievances at scale using LangGraph and VLMs.",
    challenge: "Citizen grievances are often informal and lack proper context, making them difficult to route to correct municipal authorities efficiently.",
    solution: "A stateful LangGraph architecture featuring VLM forensics, 70B LLM geolocation, and OSINT scraping to generate legally robust formal drafts.\n\nSystem Architecture:\n▸ Stateful Agentic Workflow (LangGraph) for zero context loss\n▸ Omniscient Geo-Resolver utilizing Llama-3.3-70B\n▸ Autonomous OSINT Contact Spider via Headless Playwright\n▸ VLM Forensic Engine for visual severity context via Gemini Pro",
    results: "01\nSub-60s Processing\nTakes raw informal input to a verified, signed government dispatch in under a minute.\n\n02\nHigh Availability Circuit Breakers\nAutonomous Groq-to-Gemini failover ensures 100% inference uptime.\n\n03\nPII Redaction\nStrict DPDP and GDPR privacy compliance executed before reaching external AI models.",
    link: "",
    architectureImage: ""
  },
  {
    id: "ssense-dpdp",
    title: "SSENSE: DPDP Alignment Pipeline",
    category: "Work",
    scope: "Internal",
    date: "2026-08",
    image: "/assets/projects/ssense-dpdp.jpg",
    client: "MLOps & LLM Finetuning",
    technologies: "Unsloth, vLLM, PyTorch, Qwen 72B & 9B, VS Code API",
    description: "An end-to-end machine learning pipeline auditing Indian DPDP compliance, featuring adversarial synthetic data generation and SLM finetuning.",
    challenge: "Training Small Language Models (SLMs) for strict legal reasoning requires complex adversarial datasets and faces massive hardware constraints.",
    solution: "A unified pipeline employing GAN Forge for synthetic data, semantic validation layers, and Unsloth-optimized SFT/DPO alignment loops.\n\nSystem Architecture:\n▸ Adversarial GAN Forge utilizing Qwen2-72B-Instruct-FP8\n▸ Semantic Auditor & Validator using fuzzy logic\n▸ Unsloth SLM Finetuning (SFT & DPO) with Triton kernels\n▸ Serverless Wrapper VS Code extension for remote GPU bridging",
    results: "01\nMassive Context Window\nExpanded sequence length to 24,576 tokens without OOM panics on Grace Blackwell UMA.\n\n02\nRobust Semantic Validation\nGenerated 8,000 highly contextual synthetic policy pairs with strict legal mapping.\n\n03\nAutomated VRAM Airlocks\nSafely extracts 75GB FP8 weights from Nvidia driver contexts between stages.",
    link: "",
    architectureImage: ""
  },
  {
    id: "revexbot",
    title: "RevExBot: Deep RL Architecture",
    category: "Work",
    scope: "Internal",
    date: "2026-08",
    image: "/assets/projects/revexbot.jpg",
    client: "Reinforcement Learning & Robotics",
    technologies: "PyTorch (PPO/GAIL), NVIDIA Isaac Lab, Omniverse PhysX, OpenCV",
    description: "An industry-grade, physically simulated reinforcement learning framework in NVIDIA Isaac Lab to train continuous control policies for humanoid robotics.",
    challenge: "Training continuous control policies requires balancing fluid interpolation and specialized tasks without overloading consumer workstation hardware.",
    solution: "Engineered both ASE (Adversarial Skill Embeddings) and MoE (Mixture of Experts) pipelines bridging raw video ingestion and highly optimized PPO loops.\n\nSystem Architecture:\n▸ Adversarial Skill Embeddings (ASE) Pipeline with continuous latent space\n▸ Mixture of Experts (MoE) Pipeline with High-frequency Gating\n▸ Universal Motion Forge applying strict analytical Inverse Kinematics\n▸ Universal Motion Model (UMM) with Split-Head Actor-Critic policy",
    results: "01\nMassive Parallelism\nSimulated 8,192 parallel physical environments (50Hz) via PyTorch AMP.\n\n02\nZero VRAM Fragmentation\nEngineered an O(1) step-time Motion Library Manager for CPU-to-GPU tensor transfers.\n\n03\nMathematical Rigor\n100% anatomically mapped retargeting without URDF joint-limit violations.",
    link: "",
    architectureImage: ""
  }
];

async function run() {
  try {
    const getRes = await fetch(`${BACKEND_URL}/data/postsContent`);
    let postsContent = [];
    if (getRes.ok) {
      postsContent = await getRes.json();
    }
    
    // Remove old 'Work' entries, keep 'Post' entries
    postsContent = postsContent.filter(p => p.category !== "Work");
    
    // Append the new works
    postsContent = [...newWorks, ...postsContent];
    
    const putRes = await fetch(`${BACKEND_URL}/data/postsContent`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postsContent)
    });
    
    if (putRes.ok) {
      console.log("Successfully migrated works to AWS!");
    } else {
      console.error("Failed to migrate:", await putRes.text());
    }
  } catch(e) {
    console.error("Error migrating:", e);
  }
}

run();
