# 🪐 IT FARM // GLOBAL DELIVERY NETWORK

![Status](https://img.shields.io/badge/Status-Operational-00ff00?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

> **"We don't hire freelancers. We deploy elite engineering squads."**

Full-stack IT service platform with Next.js frontend and FastAPI backend.

## 🚀 Quick Start

### Local Development

```bash
# Frontend (Next.js)
cd frontend
npm install
npm run dev
# → http://localhost:3000

# Backend (FastAPI)
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# → http://localhost:8000
```

### Docker (Recommended)

```bash
# Full stack (frontend + backend)
docker-compose up

# Backend only
cd backend
docker-compose up
```

## 📁 Project Structure

```
farm/
├── frontend/          # Next.js 16 + React 19 + TypeScript
│   ├── app/           # Pages and API routes
│   ├── components/    # React components (Navbar, Hero, Admin, etc.)
│   └── context/       # Auth & Backend context providers
│
├── backend/           # FastAPI + MongoDB + JWT Auth
│   ├── app/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # MongoDB models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── utils/        # Utilities
│   ├── Dockerfile     # Backend container
│   └── render.yaml    # Render deployment config
│
└── docker-compose.yml # Full stack orchestration
```

## 💎 Features

### Frontend
- 🎨 Modern UI with Tailwind CSS + Framer Motion
- 🔐 JWT Authentication (login/register)
- 💬 AI Chatbot (ORBIT interface)
- 👥 Admin Dashboard (users, inquiries, notifications)
- 📝 Service inquiry forms
- 🔄 Real-time WebSocket notifications
- 📱 Fully responsive design

### Backend
- ⚡ FastAPI async API
- 🗄️ MongoDB Atlas integration
- 🔒 JWT + bcrypt authentication
- 🤖 AI chatbot with transformer models
- 📡 WebSocket support
- 🔄 Anti-cold-start system (free tier hosting)
- 🐳 Production-ready Docker setup

## 🌐 Deployment

### Frontend → Vercel (Recommended)
```bash
# Connect GitHub repo to Vercel
# Set environment variable:
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### Backend → Render (Free Tier)
```bash
# Push to GitHub
# Connect to Render
# Auto-deploys using render.yaml
```

See detailed guides:
- **Backend Deployment**: [backend/README.md](backend/README.md#deployment-options)
- **Docker Guide**: [backend/DOCKER.md](backend/DOCKER.md)

## 📚 Documentation

- [Frontend README](frontend/README.md) - Frontend architecture
- [Backend README](backend/README.md) - API documentation  
- [Backend Docker Guide](backend/DOCKER.md) - Container deployment
- [API Endpoints](backend/README.md#api-endpoints) - Full API reference

## 🔧 Tech Stack

| Frontend | Backend | DevOps |
|----------|---------|--------|
| Next.js 16 | FastAPI 0.128 | Docker |
| React 19 | Motor (MongoDB) | Docker Compose |
| TypeScript | PyJWT + Passlib | Render |
| Tailwind v4 | APScheduler | Vercel |
| Framer Motion | WebSockets | GitHub Actions |

## 🛠️ Environment Variables

### Frontend `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend `.env`
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/itfarm
SECRET_KEY=your-secret-key-here
BACKEND_URL=  # For production keep-alive
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 📧 Contact

Team: team.techserve55@gmail.com

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**ENGINEERED BY THE CREATORS**





Mayank Kumar Sharma & Shreyan Mitra





*Building Global Icons.*

</div>

```

```
