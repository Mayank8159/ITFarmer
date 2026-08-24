# ITFarmer // AI & Architecture Portfolio

> "Verified Builds. No Vaporware. Only deployed engineering."

A high-performance, cyber-brutalist Next.js web application built for Priyanshu Roy, showcasing production-grade AI systems, autonomous agents, and high-throughput architectures. Designed with the custom **"Obsidian Tempest"** design language, blending deep blacks, holographic glassmorphism, and intense neon gradients (Red, Cyan, Matrix-Green).

## 🚀 Live Features
- **Dynamic Thematic UI:** Architecture and System logs render unique Heads-Up-Display (HUD) frames and image filters based on their specific category (e.g. Security gets Scanner UI, AI gets Matrix UI).
- **Serverless AWS Backend:** Powered by AWS API Gateway and DynamoDB. Full CRUD functionality seamlessly integrates via JSON REST APIs.
- **Base64 Image Pipeline:** Sidesteps AWS API payload limits by automatically utilizing client-side downscaling and compression before storing images directly into DynamoDB as Base64 JSON payloads. No S3 configuration required.
- **Secure Admin Panel:** Built-in CMS to directly mutate AWS databases (`worksContent`, `postsContent`, `capabilities`, `about`). 
- **Inline Holographic Expansion:** Projects in the Works grid dynamically expand inline, utilizing CSS Grid and Framer Motion for buttery-smooth layout transitions without relying on restrictive modal overlays.

## 🛠️ Stack Architecture
- **Frontend Framework:** Next.js 14+ (App Router), React 18, TypeScript
- **Styling Engine:** Tailwind CSS, Framer Motion (Animations), Lucide React (Icons)
- **Backend / Database:** AWS Lambda / API Gateway, DynamoDB (NoSQL)
- **Deployment:** Vercel (Frontend), Serverless Framework / Manual Configuration (Backend)

## ⚙️ Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:3000`

### Admin Access
The CMS is located at `/admin`. This allows direct mutation of the DynamoDB endpoints. Ensure your `.env.local` is populated with the correct API Gateway endpoints:
```env
NEXT_PUBLIC_AWS_API_ENDPOINT=https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

## 📁 System Layout
- `/app` - Next.js App Router (Pages: Home, `/works`, `/log`, `/about`, `/admin`)
- `/components` - Modular UI pieces (Hero, Bento Grid, Project Showcase)
- `/lib` - AWS data fetching logic and type definitions
- `/docs` - Deep-dive technical documentation on DB integration and structure

## 🎨 The "Obsidian Tempest" Style
Built entirely on raw CSS Grid and heavily customized Tailwind config. Key features include brutalist high-contrast borders, deep inset shadows, floating crosshairs, glowing data-streams, and `mix-blend-color` image rendering techniques.

---
**Status:** Online // **Indexing:** Active
