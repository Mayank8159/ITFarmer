// lib/projects.ts
export interface ProjectHighlight { title: string; desc: string }
export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  architecture: string[];
  highlights: ProjectHighlight[];
  stack: string[];
  image: string;
}

export const verifiedProjects: Project[] = [
  {
    slug: 'rocm-bridge', index: '01', title: 'ROCm Bridge', category: 'GPU & Infrastructure',
    summary: 'Automated CUDA-to-HIP transpilation pipeline that breaks proprietary hardware lock-in and enables true cross-vendor GPU portability.',
    problem: 'GPU compute teams are locked into a single vendor\u2019s proprietary CUDA ecosystem. Manually porting thousands of kernel lines to alternative hardware costs months of senior engineering time.',
    solution: 'An automated transpilation pipeline that parses CUDA kernel calls at the source level and emits equivalent AMD HIP C++, with validation passes against the target architecture.',
    architecture: ['Source-level CUDA kernel AST mapping', 'Automated HIP C++ code generation', 'Hardware abstraction benchmarking layer', 'Cross-vendor portability validation suite'],
    highlights: [
      { title: 'Kernel-Level Fidelity', desc: 'Every CUDA kernel call maps to its HIP equivalent, preserving grid/block semantics and memory hierarchy behavior.' },
      { title: 'Zero Manual Porting', desc: 'Teams move workloads across GPU vendors without rewriting the compute layer by hand.' },
      { title: 'Lock-In Elimination', desc: 'Infrastructure decisions become cost-driven, not vendor-driven.' },
    ],
    stack: ['C++', 'Python', 'CUDA', 'HIP'], image: '/projects/rocm-bridge.webp',
  },
  {
    slug: 'zorvyn-finance', index: '02', title: 'Zorvyn Finance Engine', category: 'Fintech & Microservices',
    summary: 'High-concurrency financial routing API with custom JWT middleware, strict rate limiting, and fully async transactional pipelines.',
    problem: 'Financial routing APIs must hold correctness and authentication under high concurrency. Off-the-shelf boilerplate collapses under real transactional load.',
    solution: 'A FastAPI microservice layering custom JWT middleware and strict rate limiting in front of fully asynchronous transaction pipelines over MongoDB.',
    architecture: ['Custom JWT authentication middleware', 'Strict per-client rate limiting', 'Async transactional routing pipelines', 'Non-blocking MongoDB persistence'],
    highlights: [
      { title: 'Non-Blocking by Design', desc: 'The entire request path is asynchronous, keeping throughput stable under concurrent load.' },
      { title: 'Defense at the Edge', desc: 'Authentication and rate limiting run as middleware before a single transaction is touched.' },
      { title: 'Production Hardened', desc: 'Dockerized deployment with environment-isolated configuration.' },
    ],
    stack: ['Python', 'FastAPI', 'MongoDB', 'JWT'], image: '/projects/zorvyn-finance.webp',
  },
  {
    slug: 'trackchain', index: '03', title: 'TrackChain Telemetry', category: 'Embedded & Telemetry',
    summary: 'Railway track fault detection combining hardware sensor arrays with tamper-proof, ledger-backed inspection records.',
    problem: 'Railway inspections produce readings that can be lost, altered, or disputed. There is no verifiable, ordered history of track state.',
    solution: 'Sensor arrays feed a telemetry pipeline that detects fault signatures and writes every inspection as a tamper-evident ledger entry.',
    architecture: ['Hardware sensor array telemetry capture', 'Real-time fault signature detection', 'Tamper-evident inspection ledger', 'Hardware-software signal synchronization'],
    highlights: [
      { title: 'Verifiable Inspections', desc: 'Every reading becomes an ordered, immutable entry \u2014 not a disposable log line.' },
      { title: 'Fault Signature Detection', desc: 'Track surface anomalies are flagged from live sensor telemetry.' },
      { title: 'Embedded Sync', desc: 'Low-level hardware signals stay synchronized with application state.' },
    ],
    stack: ['Python', 'IoT', 'Hardware', 'Ledger'], image: '/projects/trackchain.webp',
  },
  {
    slug: 'vitalguard-ai', index: '04', title: 'VitalGuard-AI', category: 'AI & Telemetry',
    summary: 'Decoupled biometric telemetry microservices with predictive anomaly detection and sub-second WebSocket alerting.',
    problem: 'Continuous biometric monitoring is useless if alerts are slow, or if a single service failure can silence them.',
    solution: 'Decoupled microservices capture biometric streams, run PyTorch anomaly detection, and push sub-second alerts over persistent WebSockets.',
    architecture: ['Decoupled telemetry capture services', 'PyTorch anomaly detection pipeline', 'Sub-second WebSocket alert dispatch', 'Real-time React monitoring dashboard'],
    highlights: [
      { title: 'Sub-Second Alerts', desc: 'Anomaly to dashboard notification in under a second over persistent WebSockets.' },
      { title: 'Failure Isolation', desc: 'Capture, inference, and alerting are separate services \u2014 no single crash silences an alert.' },
      { title: 'Predictive Detection', desc: 'Models flag physiological deviations before they become critical events.' },
    ],
    stack: ['FastAPI', 'React', 'PyTorch', 'WebSockets'], image: '/projects/vitalguard-ai.webp',
  },
  {
    slug: 'prism-credit', index: '05', title: 'PRISM-CREDIT', category: 'ML & Risk',
    summary: 'Predictive credit risk analytics engine converting multi-variable financial data into probability-of-default scores and risk tiers.',
    problem: 'Lending workflows need risk decisions that are calibrated and interpretable \u2014 not raw, unbounded model guesses.',
    solution: 'An ML engine ingesting multi-variable financial datasets and producing probability-of-default scores mapped to explicit risk tiers.',
    architecture: ['Multi-variable financial feature pipeline', 'ML-driven risk classification', 'Probability-of-default scoring', 'Explicit risk-tier mapping'],
    highlights: [
      { title: 'Calibrated Scores', desc: 'Outputs are probability-of-default estimates, not unbounded raw scores.' },
      { title: 'Interpretable Tiers', desc: 'Scores map to explicit risk tiers downstream workflows can act on.' },
      { title: 'Multi-Variable Intake', desc: 'The feature pipeline handles heterogeneous financial datasets.' },
    ],
    stack: ['Python', 'ML', 'Risk Analytics'], image: '/projects/prism-credit.webp',
  },
  {
    slug: 'sleep-detector', index: '06', title: 'Vision Drowsiness System', category: 'Computer Vision',
    summary: 'Real-time driver drowsiness monitoring through webcam facial and eye-tracking with instant closure-state alerts.',
    problem: 'Driver microsleeps are invisible until they become accidents, and specialized hardware monitors are expensive and non-portable.',
    solution: 'A computer-vision pipeline tracking facial landmarks and blink-rate telemetry from a standard webcam, triggering alerts on closure states.',
    architecture: ['Real-time facial landmark tracking', 'Blink-rate telemetry analysis', 'Eye-closure state detection', 'Immediate alert triggering'],
    highlights: [
      { title: 'Commodity Hardware', desc: 'Runs on a standard webcam \u2014 no specialized sensors required.' },
      { title: 'Continuous Evaluation', desc: 'Blink-rate and closure telemetry are evaluated frame by frame in real time.' },
      { title: 'Instant Escalation', desc: 'Sustained closure states trigger immediate alerts.' },
    ],
    stack: ['TypeScript', 'Computer Vision'], image: '/projects/sleep-detector.webp',
  },
  {
    slug: 'evolzen-world', index: '07', title: 'EvolZen World', category: 'Agentic Systems',
    summary: 'Exploratory AI ecosystem modeling evolutionary agent dynamics, fitness functions, and multi-agent state spaces.',
    problem: 'Multi-agent adaptation is hard to study without a controlled environment where agents evolve under measurable pressure.',
    solution: 'A simulated ecosystem where autonomous agents interact while fitness functions, mutations, and communication pathways evolve across epochs.',
    architecture: ['Multi-agent simulation environment', 'Fitness-function evaluation loops', 'Mutation and epoch tracking', 'Agent state-space dependency mapping'],
    highlights: [
      { title: 'Evolutionary Pressure', desc: 'Agents adapt under fitness functions that shift across epochs.' },
      { title: 'State-Space Mapping', desc: 'Communication pathways and dependencies are tracked as first-class data.' },
      { title: 'AGI Research Sandbox', desc: 'A controlled environment for studying emergent multi-agent behavior.' },
    ],
    stack: ['Python', 'AGI', 'Multi-Agent'], image: '/projects/evolzen-world.webp',
  },
  {
    slug: 'avaani-ai', index: '08', title: 'LLM Context Architecture', category: 'AI Systems',
    summary: 'NLP assistant architecture orchestrating prompt workflows, context routing, and retrieval-ready conversational pipelines.',
    problem: 'Production assistants fail as context grows \u2014 without structured routing, long conversations degrade into incoherence.',
    solution: 'An NLP architecture orchestrating prompt workflows, managing context window state, and exposing retrieval hooks for domain knowledge injection.',
    architecture: ['Prompt workflow orchestration', 'Context window state management', 'Retrieval-augmented generation hooks', 'Conversational state persistence'],
    highlights: [
      { title: 'Structured Context', desc: 'Context is routed and managed, not dumped into a prompt blindly.' },
      { title: 'RAG-Ready', desc: 'Retrieval hooks inject domain knowledge at inference time.' },
      { title: 'Workflow Orchestration', desc: 'Prompt pipelines are composed, versioned, and reusable.' },
    ],
    stack: ['LangGraph', 'RAG', 'Vector DB'], image: '/projects/avaani-ai.webp',
  },
  {
    slug: 'revexbot', index: '09', title: 'RevEx Autonomous Agent', category: 'Autonomous Agents',
    summary: 'Autonomous agent loop that parses code diff streams, flags structural defects, and gates approvals without human intervention.',
    problem: 'Manual code review is a bottleneck, and defects slip through whenever reviewers are overloaded.',
    solution: 'An autonomous agent consuming diff streams, scanning for structural defects, and escalating flagged segments through an approval gate.',
    architecture: ['Diff stream parsing', 'Autonomous defect detection loop', 'Lint and structural validation passes', 'Approval gate escalation'],
    highlights: [
      { title: 'Continuous Review', desc: 'Every diff is scanned the moment it lands \u2014 no queue, no fatigue.' },
      { title: 'Autonomous Loop', desc: 'The agent runs its review cycle without human intervention.' },
      { title: 'Gated Escalation', desc: 'Flagged segments route through an explicit approval gate.' },
    ],
    stack: ['Python', 'LLM', 'CI/CD'], image: '/projects/revexbot.webp',
  },
  {
    slug: 'daytona', index: '10', title: 'Daytona Elastic Workspaces', category: 'Infrastructure',
    summary: 'Elastic containerized sandbox infrastructure for the safe, isolated execution of AI-generated code.',
    problem: 'AI-generated code cannot be trusted on a host \u2014 it needs isolation, quotas, and instant provisioning.',
    solution: 'Elastic containerized sandboxes where every execution is isolated, resource-quota-bound, and spawned on demand from a cold pool.',
    architecture: ['Isolated sandbox provisioning', 'Elastic cold-pool scaling', 'Strict execution resource quotas', 'Instant workspace spawning'],
    highlights: [
      { title: 'Total Isolation', desc: 'Generated code cannot touch the host or neighboring workspaces.' },
      { title: 'Elastic Capacity', desc: 'Cold workspaces spawn on demand; the pool scales with load.' },
      { title: 'Quota Enforcement', desc: 'Every execution runs inside strict resource boundaries.' },
    ],
    stack: ['TypeScript', 'Docker', 'Infra'], image: '/projects/daytona.webp',
  },
  {
    slug: 'credit-risk-cpp', index: '11', title: 'C++ Risk Engine', category: 'Core Systems',
    summary: 'High-performance C++ backend engine for credit scoring \u2014 minimal-allocation, cache-friendly computation at the metal.',
    problem: 'Interactive risk tooling needs a compute core that processes scoring matrices at maximum throughput \u2014 managed runtimes add overhead.',
    solution: 'A C++ engine with minimal-allocation scoring loops and cache-friendly data layout, operating as close to the metal as the problem allows.',
    architecture: ['Minimal-allocation scoring loops', 'Cache-friendly data layout', 'Clock-cycle level optimization', 'Throughput benchmarking harness'],
    highlights: [
      { title: 'Metal-Level Performance', desc: 'No managed-runtime overhead between the data and the CPU.' },
      { title: 'Allocation Discipline', desc: 'Scoring loops are designed to avoid heap churn entirely.' },
      { title: 'Benchmarked, Not Assumed', desc: 'A dedicated harness validates throughput claims.' },
    ],
    stack: ['C++', 'Algorithms', 'Low-Latency'], image: '/projects/credit-risk-cpp.webp',
  },
  {
    slug: 'smart-mirror', index: '12', title: 'Smart-Mirror IoT Hub', category: 'IoT',
    summary: 'Hardware-integrated IoT dashboard fusing live weather, news, and sensor feeds into a real-time edge display.',
    problem: 'Smart displays usually become static dashboards \u2014 feeds stall and widgets desynchronize.',
    solution: 'An IoT hub with a widget bus that ingests asynchronous live feeds and continuously refreshes an edge display.',
    architecture: ['Real-time widget bus', 'Asynchronous live feed ingestion', 'IoT hub orchestration', 'Edge display rendering'],
    highlights: [
      { title: 'Live by Default', desc: 'Widgets refresh continuously from asynchronous feeds.' },
      { title: 'Widget Bus', desc: 'A single bus orchestrates heterogeneous data sources.' },
      { title: 'Edge Rendering', desc: 'The display renders locally on edge hardware.' },
    ],
    stack: ['TypeScript', 'IoT', 'Real-Time'], image: '/projects/smart-mirror.webp',
  },
];
