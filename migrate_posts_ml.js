const BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod";

const posts = [
  {
    id: "post-llm-orchestration",
    title: "Research Log: Extreme Low-Latency LLM Orchestration",
    category: "Post",
    scope: "Internal",
    date: "2025-07",
    image: "/assets/res/avani_ai_1787598291980.jpg",
    client: "AI Research: Core Inference",
    technologies: "vLLM, TensorRT-LLM, Qwen, Llama 3",
    description: "Deep dive into our methodologies for achieving sub-second time-to-first-token (TTFT) on edge hardware.",
    challenge: "Deploying high-parameter LLMs (70B+) in production often results in unacceptable latency and massive VRAM fragmentation, making real-time user interaction impossible.",
    solution: "We engineered a custom continuous batching pipeline leveraging PagedAttention and FP8 quantization. By aggressively optimizing the KV cache and structuring prompt templates for maximum prefix-caching hits, we bypassed traditional IO bottlenecks.",
    results: "01\nZero Memory Fragmentation\nPagedAttention eliminated KV cache fragmentation, allowing 4x higher concurrency.\n\n02\nSub-Second TTFT\nAchieved 380ms TTFT on a 70B parameter model by offloading prefill to dedicated hardware.\n\n03\nFP8 Precision Maintenance\nQuantization-Aware Training preserved 99.1% of fp16 accuracy while halving the memory footprint.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-rag-pipelines",
    title: "Research Log: Deterministic RAG Architectures",
    category: "Post",
    scope: "Internal",
    date: "2025-09",
    image: "/assets/res/civiclink_1787598556959.jpg",
    client: "AI Research: Semantic Search",
    technologies: "LangChain, Qdrant, BGE-M3, GraphRAG",
    description: "Moving beyond naive vector similarity by implementing Graph-augmented Retrieval and dynamic semantic chunking.",
    challenge: "Naive RAG pipelines fail catastrophically when queries require multi-hop reasoning or when document context is spread across disparate knowledge bases.",
    solution: "We transitioned to a GraphRAG topology, extracting entities and relationships into a hybrid vector-graph database. We implemented a two-pass retrieval system: first filtering by topological graph proximity, then reranking with cross-encoder models.",
    results: "01\nMulti-Hop Reasoning\nGraph traversal allows the LLM to synthesize answers from documents that share no direct lexical similarity.\n\n02\nContext Density\nSemantic chunking ensures that retrieved text blocks contain complete logical thoughts, eliminating 'cut-off' sentences.\n\n03\nHallucination Mitigation\nStrict citation-enforcement prompts dropped hallucination rates from 14% to 0.8%.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-reinforcement-learning",
    title: "Research Log: Deep RL for Continuous Control",
    category: "Post",
    scope: "Internal",
    date: "2025-11",
    image: "/assets/res/revexbot_1787598584531.jpg",
    client: "AI Research: Robotics & Simulation",
    technologies: "PyTorch, PPO, NVIDIA Isaac Gym, Omniverse",
    description: "Training physically-accurate humanoid policies using massively parallel reinforcement learning environments.",
    challenge: "Training continuous control policies requires millions of environmental steps, which is bottlenecked by CPU-GPU data transfers and sequential physics calculations.",
    solution: "We rebuilt our training loops inside NVIDIA Isaac Gym, keeping both the physics simulation and the PPO network entirely on the GPU. We introduced Adversarial Skill Embeddings (ASE) to ensure policies remained fluid and physically plausible.",
    results: "01\nMassive Parallelism\nSimulating 16,384 environments simultaneously on a single GPU yielded 100x faster convergence.\n\n02\nZero Tensor Transfer\nKeeping observation tensors in VRAM eliminated PCIe bandwidth bottlenecks.\n\n03\nFluid Retargeting\nPolicies successfully generalized from simulation to URDF-mapped hardware without jitter.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-agentic-pipelines",
    title: "Research Log: Stateful Autonomous Agent Swarms",
    category: "Post",
    scope: "Internal",
    date: "2026-01",
    image: "/assets/res/edubridge_1787598544433.jpg",
    client: "AI Research: Multi-Agent Systems",
    technologies: "LangGraph, FastAPI, Python, Playwright",
    description: "Architecting non-deterministic, self-healing multi-agent pipelines for complex software engineering tasks.",
    challenge: "Linear LLM chains break easily when confronted with unexpected API responses or complex reasoning tasks that require iteration.",
    solution: "We adopted a cyclical, stateful graph architecture (LangGraph) where agents act as specialized nodes (Planner, Executor, Reviewer). State is persisted at every step, allowing agents to self-correct and backtrack upon failure.",
    results: "01\nSelf-Healing Execution\nAgents autonomously detect syntax errors in generated code and route back to the Executor node for fixing.\n\n02\nMemory Persistence\nCheckpointer mechanisms allow us to pause a multi-agent swarm, inject human feedback, and resume seamlessly.\n\n03\nParallel Tool Calling\nAgents simultaneously trigger web scraping, API calls, and local execution, merging the results asynchronously.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-ai-security",
    title: "Research Log: Zero-Leakage Edge ML Security",
    category: "Post",
    scope: "Internal",
    date: "2026-03",
    image: "/assets/res/goprivate_1787598275730.jpg",
    client: "AI Research: Security Architectures",
    technologies: "C++, ONNX, TFLite, Android NDK",
    description: "Engineering air-gapped, on-device machine learning firewalls to protect against data exfiltration.",
    challenge: "Cloud-based AI security requires transmitting sensitive telemetry off-device, violating strict DPDP and GDPR compliance rules.",
    solution: "We engineered an entirely local inference pipeline using C++ JNI and quantized TFLite sequence models. The model inspects network flow metadata directly at the OS kernel level without ever opening an external socket.",
    results: "01\nAbsolute Privacy\nZero bytes of telemetry leave the device. All inference is cryptographically isolated in local memory.\n\n02\nMicro-Footprint\nAggressive structured pruning reduced the anomaly detection model size to 8MB.\n\n03\nBattery Efficiency\nOptimized C++ tensor allocations resulted in negligible battery impact during continuous background monitoring.",
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
    
    // Remove old Posts to replace them with the new ML/AI focused ones
    const everythingExceptPosts = postsContent.filter(p => p.category !== "Post");
    
    // Assemble the final array
    const newDbState = [
      ...posts,                // The 5 newly upgraded ML/AI posts
      ...everythingExceptPosts // All the Works and other content
    ];
    
    const putRes = await fetch(`${BACKEND_URL}/data/postsContent`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDbState)
    });
    
    if (putRes.ok) {
      console.log("Successfully upgraded posts to ML/AI focus and pushed to AWS!");
    } else {
      console.error("Failed to migrate:", await putRes.text());
    }
  } catch(e) {
    console.error("Error migrating:", e);
  }
}

run();
