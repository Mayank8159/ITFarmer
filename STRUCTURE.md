# 📁 Project Structure - IT FARM

Clean, organized project structure after optimization.

## Directory Tree

```
farm/
├── .git/                      # Git repository
├── .gitignore                 # Project-wide ignores (OS, IDEs, env files)
├── .vscode/                   # VS Code settings
├── README.md                  # Main project documentation (hub)
├── docker-compose.yml         # Full-stack orchestration
│
├── backend/                   # FastAPI Backend
│   ├── .dockerignore          # Docker build optimization
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment template
│   ├── .gitignore             # Backend-specific ignores
│   ├── Dockerfile             # Production container image
│   ├── docker-compose.yml     # Dev with hot-reload
│   ├── docker-compose.prod.yml # Production config
│   ├── requirements.txt       # Python dependencies
│   ├── render.yaml            # Render deployment config
│   ├── start-docker.bat       # Windows quick start
│   ├── start-docker.sh        # Linux/Mac quick start
│   ├── README.md              # Backend API documentation
│   ├── DOCKER.md              # Docker deployment guide
│   │
│   ├── app/                   # Application code
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app + keep-alive
│   │   ├── database.py        # MongoDB connection
│   │   │
│   │   ├── controllers/       # Route handlers
│   │   │   ├── __init__.py
│   │   │   ├── auth_controller.py
│   │   │   ├── chatbot_controller.py
│   │   │   ├── inquiry_controller.py
│   │   │   ├── notifications_controller.py
│   │   │   └── update_controller.py
│   │   │
│   │   ├── services/          # Business logic
│   │   │   ├── chatbot_service.py
│   │   │   ├── inquiry_service.py
│   │   │   └── update_service.py
│   │   │
│   │   ├── models/            # MongoDB serializers
│   │   │   ├── user.py
│   │   │   ├── inquiry.py
│   │   │   ├── update.py
│   │   │   └── chat_dataset.py
│   │   │
│   │   ├── schemas/           # Pydantic validation
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── inquiry_schema.py
│   │   │   └── update_schema.py
│   │   │
│   │   ├── routes/            # Route registration
│   │   │   └── auth.py
│   │   │
│   │   └── utils/             # Utilities
│   │       └── preprocess.py
│   │
│   └── venv/ (ignored)        # Virtual environment
│
└── frontend/                  # Next.js Frontend
    ├── .dockerignore          # Docker build optimization
    ├── .gitignore             # Frontend-specific ignores
    ├── .next/ (ignored)       # Next.js build cache
    ├── Dockerfile             # Multi-stage container
    ├── node_modules/ (ignored) # Dependencies
    ├── package.json           # npm dependencies
    ├── package-lock.json      # Locked versions
    ├── tsconfig.json          # TypeScript config
    ├── next.config.ts         # Next.js config (standalone)
    ├── eslint.config.mjs      # ESLint rules
    ├── postcss.config.mjs     # PostCSS config
    ├── next-env.d.ts          # Next.js types
    ├── README.md              # Frontend documentation
    │
    ├── app/                   # Next.js pages (App Router)
    │   ├── layout.tsx         # Root layout
    │   ├── page.tsx           # Home page
    │   ├── globals.css        # Global styles
    │   ├── login/             # Auth pages
    │   ├── admin/             # Admin dashboard
    │   ├── services/          # Service inquiry
    │   ├── posts/             # Updates/blog
    │   └── about/             # About page
    │
    ├── components/            # React components
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── Body.tsx
    │   ├── Footer.tsx
    │   ├── AdminNotifications.tsx
    │   ├── payment.tsx
    │   ├── SmokeBackground.tsx
    │   └── orbit/             # Chat widget
    │       ├── OrbitChat.tsx
    │       ├── OrbitOrb.tsx
    │       └── orbit.types.ts
    │
    ├── context/               # React Context
    │   ├── AuthContext.tsx    # JWT auth state
    │   └── BackendContext.tsx # Backend health
    │
    └── public/                # Static assets
        └── founders/          # Team photos
```

## Documentation Structure

### Root Level
- **README.md** - Project overview, quick start, tech stack
- **docker-compose.yml** - Full-stack development setup

### Backend (backend/)
- **README.md** - API docs, endpoints, environment setup
- **DOCKER.md** - Complete Docker deployment guide
- **render.yaml** - Render platform config (free tier)

### Frontend (frontend/)
- **README.md** - Frontend features, components, deployment

## Files Removed

✅ Cleaned up:
- ❌ `DOCKER-SETUP.md` (root) - Redundant with backend/DOCKER.md
- ❌ `backend/DEPLOYMENT.md` - Merged into backend/README.md
- ❌ `backend/app/**/__pycache__/` - Python cache directories

## Ignored Files (.gitignore)

### Root
- `.env`, `.env.local`
- `.DS_Store`, `Thumbs.db`
- `.vscode/`, `.idea/`
- Logs and swap files

### Backend
- `venv/`, `.venv`, `env/`
- `__pycache__/`, `*.pyc`
- `.env`, `.env.local`
- ML model cache

### Frontend
- `node_modules/`
- `.next/`, `out/`
- `.env*`
- Build artifacts

## Key Principles

✅ **Single Source of Truth**: Each topic has ONE authoritative document
✅ **Hierarchical Docs**: Root → subsection → detailed guides
✅ **Clear Separation**: Frontend / Backend / DevOps docs
✅ **No Duplication**: Link to other docs instead of copying
✅ **Proper Ignores**: Cache, build, env files stay out of git

## Quick Navigation

### For Development
- Start: [README.md](../README.md) → Quick Start
- Backend API: [backend/README.md](../backend/README.md)
- Frontend: [frontend/README.md](../frontend/README.md)

### For Deployment
- Docker: [backend/DOCKER.md](../backend/DOCKER.md)
- Render: [backend/README.md](../backend/README.md#deployment-options)
- Vercel: [frontend/README.md](../frontend/README.md#deployment)

### For Configuration
- Backend env: [backend/.env.example](../backend/.env.example)
- Frontend env: See [frontend/README.md](../frontend/README.md#environment-variables)
- Docker compose: [docker-compose.yml](../docker-compose.yml)

## Status

✅ Structure optimized
✅ Redundant files removed
✅ Documentation consolidated
✅ Proper .gitignore files
✅ Cache directories cleaned
✅ No errors in codebase

Last updated: March 2, 2026
