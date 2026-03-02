# IT FARM API Backend

FastAPI backend for IT FARM Global Delivery Network.

## Features

- 🔐 JWT Authentication with bcrypt password hashing
- 💬 AI Chatbot with DialoGPT (optional) + fallback replies
- 📝 Inquiry management system
- 👥 User management
- 📢 Real-time WebSocket notifications
- 📰 Updates/Posts API
- 🔄 Auto keep-alive for free tier deployments

## Tech Stack

- **Framework**: FastAPI 0.128.0
- **Database**: MongoDB (Motor async driver)
- **Auth**: JWT (python-jose), Passlib bcrypt
- **Background Tasks**: APScheduler
- **ML**: PyTorch + Transformers (optional)

## Quick Start

### 🐳 With Docker (Recommended)

```bash
# Start with Docker Compose
docker-compose up

# API runs at http://localhost:8000
```

See [DOCKER.md](DOCKER.md) for full Docker documentation.

### 🐍 Without Docker (Manual Setup)

#### Prerequisites

- Python 3.11+
- MongoDB Atlas account (or local MongoDB)
- pip

#### Setup

1. Clone the repository:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and SECRET_KEY
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

## Deployment Options

### 🐳 Docker (Any Platform)

Deploy to any Docker-compatible platform:
- Railway, Fly.io, AWS ECS, Google Cloud Run, Azure Container Instances

See [DOCKER.md](DOCKER.md) for complete Docker deployment guide.

### 🌐 Render (Free Tier - Serverless)

#### Option 1: Using render.yaml (Recommended)

1. Push code to GitHub
2. Connect Render to your repository
3. Render will auto-detect `render.yaml` and configure everything
4. Set environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SECRET_KEY`: Auto-generated (or set manually)
   - `BACKEND_URL`: Your Render app URL (e.g., `https://itfarm-api.onrender.com`)

### Option 2: Manual Setup

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
4. Add environment variables (same as above)

### Anti-Cold-Start System

The backend includes an automatic keep-alive system for free tier deployments:

- **How it works**: Self-pings `/health` every 50 seconds
- **Activation**: Automatically starts when `BACKEND_URL` env var is set
- **Result**: Prevents Render free tier from spinning down (15min inactivity)

**Important**: Make sure to set `BACKEND_URL` to your deployed URL on Render!

## API Endpoints

### Public Routes
- `GET /` - API status
- `GET /health` - Health check
- `POST /token` - Login (get JWT)
- `POST /register` - Create account
- `POST /api/chat` - Chatbot (no auth required)
- `GET /updates` - Get all updates/posts
- `POST /inquiry` - Submit service inquiry

### Protected Routes (Require JWT)
- `GET /users` - List all users (admin)
- `POST /updates` - Create new update/post
- `GET /inquiry` - List all inquiries (admin)
- `WS /notifications/admin` - WebSocket for real-time notifications

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `SECRET_KEY` | JWT secret key | ✅ Yes |
| `ALGORITHM` | JWT algorithm (default: HS256) | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry (default: 1440) | No |
| `BACKEND_URL` | Deployed backend URL (for keep-alive) | Production only |

## MongoDB Collections

1. **users**: User accounts with hashed passwords
2. **inquiries**: Service inquiry submissions
3. **updates**: Blog posts/updates with categories

## Chatbot Configuration

The chatbot has two modes:

1. **AI Mode** (optional): Uses DialoGPT-medium transformer
   - Install: `pip install torch transformers`
   - Requires GPU for speed (CPU works but slow)

2. **Fallback Mode** (default): Rule-based responses
   - No ML dependencies required
   - Fast and reliable
   - Handles: services, contact, pricing, greetings

The API automatically uses fallback mode if ML models aren't available.

## Troubleshooting

### Windows NumPy Build Issues
If you see GCC errors during `pip install`:
- ML dependencies are optional
- Backend works fine without torch/transformers
- Chatbot uses fallback replies automatically

### MongoDB Connection
Test your connection string:
```python
from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient("your-uri-here")
await client.server_info()  # Should not raise exception
```

### JWT Token Issues
Generate a strong secret key:
```bash
openssl rand -hex 32
```

## License

MIT

## Support

Contact: team.techserve55@gmail.com
