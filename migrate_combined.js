const BACKEND_URL = "https://sroeqkui3i.execute-api.ap-south-1.amazonaws.com/prod";

const combinedWorks = [
  {
    id: "elastic-gpu-infra",
    title: "Elastic GPU Infrastructure",
    category: "Work",
    scope: "Internal",
    date: "2025-08",
    image: "/projects/rocm-bridge.webp",
    client: "GPU & Cloud Computing",
    technologies: "C++, CUDA, HIP, TypeScript, Docker",
    description: "A dual-stack infrastructure platform combining an automated CUDA-to-HIP transpilation pipeline with elastic, containerized sandbox provisioning.",
    challenge: "Compute teams are locked into proprietary GPU hardware and untrusted AI-generated code requires strict execution isolation.",
    solution: "An automated transpilation core that breaks vendor lock-in alongside a cold-pool sandbox engine for safe, on-demand execution.\n\nSystem Architecture:\n▸ Source-level CUDA to HIP AST Mapping\n▸ Automated HIP C++ Code Generation\n▸ Isolated Containerized Sandbox Provisioning\n▸ Elastic Cold-Pool Resource Scaling",
    results: "01\nCross-Vendor Portability\nZero manual porting required when moving workloads between Nvidia and AMD architectures.\n\n02\nTotal Sandbox Isolation\nGenerated code runs within strict resource quotas without host-level access.\n\n03\nInstant Elastic Spawning\nContainerized workspaces spin up from the cold-pool in under 2 seconds.",
    link: "",
    architectureImage: ""
  },
  {
    id: "zorvyn-risk-engine",
    title: "Zorvyn Risk Engine",
    category: "Work",
    scope: "Internal",
    date: "2025-10",
    image: "/projects/zorvyn-finance.webp",
    client: "FinTech & Risk Analytics",
    technologies: "C++, Python, FastAPI, MongoDB, Algorithms",
    description: "A highly-concurrent financial routing and credit risk evaluation engine optimized for minimal-allocation memory layout and low latency.",
    challenge: "Financial routing architectures face severe bottlenecks under heavy concurrency, and managed runtimes introduce unpredictable latency during complex matrix scoring.",
    solution: "A C++ backend compute engine integrated seamlessly behind a FastAPI asynchronous routing layer guarded by edge-level JWT middleware.\n\nSystem Architecture:\n▸ Custom JWT Authentication & Edge Rate Limiting\n▸ Async Transactional Routing Pipeline\n▸ Metal-Level C++ Minimal-Allocation Scoring Loop\n▸ Cache-Friendly Data Structures for Risk Tiers",
    results: "01\nNon-Blocking Concurrency\nAsynchronous pipelines prevent thread-starvation during peak financial load.\n\n02\nMetal-Level Performance\nC++ scoring engine avoids heap churn entirely, maximizing L3 cache hits.\n\n03\nInterpretable Outputs\nRaw probability-of-default bounds map directly to auditable risk tiers.",
    link: "",
    architectureImage: ""
  },
  {
    id: "edge-telemetry-suite",
    title: "Edge Telemetry Suite",
    category: "Work",
    scope: "Internal",
    date: "2025-11",
    image: "/projects/trackchain.webp",
    client: "IoT & Distributed Systems",
    technologies: "Python, FastAPI, TypeScript, PyTorch, Hardware Sensors",
    description: "A unified telemetry platform bridging track-fault detection, biometric stream processing, and real-time edge displays via WebSocket aggregation.",
    challenge: "IoT networks suffer from decoupled data ingestion, stalled displays, and unauditable sensor telemetry lacking cryptographical integrity.",
    solution: "A tamper-proof ledger backend ingesting continuous asynchronous feeds, paired with PyTorch anomaly detection and an edge widget bus.\n\nSystem Architecture:\n▸ Tamper-Evident Sensor Telemetry Ledger\n▸ PyTorch Biometric Anomaly Detection\n▸ Real-Time Hardware Widget Bus\n▸ Sub-Second WebSocket Alert Dispatch",
    results: "01\nImmutable Inspections\nSensor data is written to a verifiable ledger ensuring complete auditability.\n\n02\nSub-Second Reactivity\nAnomalies in hardware streams trigger dashboard alerts instantly.\n\n03\nLive Edge Rendering\nThe hardware display bus remains synchronized continuously without polling.",
    link: "",
    architectureImage: ""
  },
  {
    id: "vision-guard",
    title: "Vision Guard System",
    category: "Work",
    scope: "Internal",
    date: "2026-01",
    image: "/projects/sleep-detector.webp",
    client: "Computer Vision & Edge AI",
    technologies: "TypeScript, Python, OpenCV, Dlib",
    description: "A real-time driver drowsiness and closure-state tracking pipeline running directly on commodity webcam hardware.",
    challenge: "Driver microsleep detection typically requires expensive specialized hardware and closed-source proprietary sensors.",
    solution: "A lightweight computer-vision pipeline that tracks facial landmarks and computes blink-rate telemetry frame-by-frame.\n\nSystem Architecture:\n▸ Real-Time Facial Landmark Tracking\n▸ Blink-Rate & Closure Telemetry Analysis\n▸ Frame-by-Frame Rolling Heuristics\n▸ Instant Auditory/Visual Alert Triggering",
    results: "01\nCommodity Hardware Access\nFunctions effectively on any standard 720p webcam without depth sensors.\n\n02\nContinuous Evaluation\nAnalyzes state continuously rather than waiting for discrete polling intervals.\n\n03\nInstant Escalation\nSustained eye-closure states map directly to high-priority alert interrupts.",
    link: "",
    architectureImage: ""
  },
  {
    id: "evolzen-sandbox",
    title: "EvolZen Multi-Agent Sandbox",
    category: "Work",
    scope: "Internal",
    date: "2026-03",
    image: "/projects/evolzen-world.webp",
    client: "Agentic Systems & AGI",
    technologies: "Python, Multi-Agent, AGI Simulation",
    description: "An exploratory ecosystem simulator designed to model evolutionary agent dynamics, adaptive fitness functions, and state-space communication.",
    challenge: "Studying emergent multi-agent behavior requires a heavily controlled environment where selective pressures can be explicitly engineered and measured.",
    solution: "A rigid simulation framework tracking mutation loops, agent-to-agent communication pathways, and epoch-shifting fitness functions.\n\nSystem Architecture:\n▸ Epoch-Driven Multi-Agent Environment\n▸ Adaptive Fitness Function Evaluation Loops\n▸ Deterministic Mutation Tracking\n▸ First-Class Communication Dependency Mapping",
    results: "01\nControlled Evolutionary Pressure\nAgents rapidly adapt behavior as environmental fitness requirements dynamically shift.\n\n02\nState-Space Mapping\nInter-agent communication pathways are graphed transparently for behavioral analysis.\n\n03\nAGI Research Platform\nProvides a deterministic baseline for testing complex multi-agent orchestration.",
    link: "",
    architectureImage: ""
  }
];

const posts = [
  {
    id: "post-llm",
    title: "Research Log: State-Space in LLMs & RAG",
    category: "Post",
    scope: "Internal",
    date: "2025-07",
    image: "/assets/res/avani_ai_1787598291980.jpg",
    client: "LLMs & Agentic Systems",
    technologies: "Python, PyTorch, LangGraph",
    description: "Exploring context routing, memory persistence, and intent extraction in Large Language Models.",
    challenge: "Production assistants suffer severe context degradation and hallucination as conversational history expands.",
    solution: "Our core research focused on decoupling intent recognition from the generative pass. We implemented semantic chunking and probabilistic decision layers to route contexts effectively.",
    results: "01\nStructured RAG Context\nWe learned that context must be strictly routed and managed, rather than blindly appended to the prompt.\n\n02\nDual-Pass Latency\nApplying a two-pass pipeline (intent classification -> generative synthesis) dramatically improved accuracy without sacrificing hardware bounds.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-telemetry",
    title: "Research Log: Edge Telemetry & Hardware Sync",
    category: "Post",
    scope: "Internal",
    date: "2025-09",
    image: "/assets/res/civiclink_1787598556959.jpg",
    client: "IoT & Distributed Systems",
    technologies: "WebSockets, PyTorch, C++",
    description: "Architecting tamper-proof sensor pipelines and sub-second anomaly detection at the edge.",
    challenge: "Decoupled hardware sensors often desynchronize and their feeds lack cryptographic integrity.",
    solution: "We shifted focus to building a unified 'widget bus' and a tamper-evident ledger. This guaranteed that every biometric or mechanical reading was immutably recorded and instantly processed.",
    results: "01\nImmutable Trust\nCryptographic ledgers transform disposable sensor logs into auditable, verifiable data.\n\n02\nSub-Second Websockets\nIsolating the capture layer from the inference layer ensures that hardware spikes don't crash the anomaly alerting system.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-fintech",
    title: "Research Log: High-Concurrency Finance Architectures",
    category: "Post",
    scope: "Internal",
    date: "2025-11",
    image: "/assets/res/edubridge_1787598544433.jpg",
    client: "FinTech & Risk Analytics",
    technologies: "C++, FastAPI, MongoDB",
    description: "Solving memory allocation and thread starvation in transaction-heavy risk engines.",
    challenge: "Garbage-collected runtimes introduce unpredictable latency spikes during complex matrix scoring operations.",
    solution: "We separated concerns: a FastAPI asynchronous layer for routing, and a strict, minimal-allocation C++ engine for compute.",
    results: "01\nMetal-Level Execution\nEliminating heap churn in the scoring loops directly maximizes CPU cache hits.\n\n02\nDefense at the Edge\nImplementing strict JWT and rate-limiting middleware keeps the core engine insulated from connection spikes.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-cv",
    title: "Research Log: Vision Systems on Commodity Hardware",
    category: "Post",
    scope: "Internal",
    date: "2026-01",
    image: "/assets/res/goprivate_1787598275730.jpg",
    client: "Computer Vision & Edge AI",
    technologies: "OpenCV, Dlib, TypeScript",
    description: "Extracting highly accurate telemetry from standard, low-cost camera sensors.",
    challenge: "Specialized depth sensors are too expensive for ubiquitous deployment, requiring fallback to standard webcams.",
    solution: "We refined a frame-by-frame rolling heuristics pipeline that calculates facial landmarks and eye-closure states without needing high-resolution inputs.",
    results: "01\nContinuous Evaluation\nRolling heuristics allow for real-time alerting without the lag of discrete polling.\n\n02\nAccessibility\nAdvanced safety telemetry can be achieved purely through software optimization on existing hardware.",
    link: "",
    architectureImage: ""
  },
  {
    id: "post-agents",
    title: "Research Log: Evolutionary Multi-Agent Logic",
    category: "Post",
    scope: "Internal",
    date: "2026-03",
    image: "/assets/res/revexbot_1787598584531.jpg",
    client: "Agentic Systems & AGI",
    technologies: "Python, AGI, Simulation",
    description: "Designing closed environments to study how autonomous agents adapt to shifting fitness functions.",
    challenge: "It is difficult to measure agent intelligence and adaptability without a strictly controlled, deterministic environment.",
    solution: "We engineered a sandbox where communication dependencies, mutations, and evolutionary pressures are treated as first-class, trackable data.",
    results: "01\nDeterministic Measurement\nBy isolating the environment, we can concretely measure how agents optimize their pathways.\n\n02\nEmergent Behavior\nAgents naturally develop unexpected communication topologies when subjected to dynamic epoch shifts.",
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
    
    // The user previously requested to migrate the new 6 projects. 
    // We will keep the recent 6 Works, add the 5 combined legacy Works, and the 5 new Posts.
    
    // Separate existing Works and non-Works
    const currentWorks = postsContent.filter(p => p.category === "Work" && !combinedWorks.find(w => w.id === p.id));
    const nonWorksAndPosts = postsContent.filter(p => p.category !== "Work" && p.category !== "Post");
    
    // Assemble the final array
    const newDbState = [
      ...currentWorks,     // The 6 new ones we pushed earlier
      ...combinedWorks,    // The 5 combined legacy works
      ...posts,            // The 5 new posts
      ...nonWorksAndPosts  // Anything else
    ];
    
    const putRes = await fetch(`${BACKEND_URL}/data/postsContent`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDbState)
    });
    
    if (putRes.ok) {
      console.log("Successfully migrated combined works and posts to AWS!");
    } else {
      console.error("Failed to migrate:", await putRes.text());
    }
  } catch(e) {
    console.error("Error migrating:", e);
  }
}

run();
