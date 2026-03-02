import os
import httpx
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.database import users_collection
from passlib.context import CryptContext
from datetime import datetime

from app.controllers import (
    chatbot_controller,
    auth_controller,
    inquiry_controller,
    notifications_controller,
    update_controller,
)

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Scheduler for preventing cold starts
scheduler = AsyncIOScheduler()

async def create_test_admin():
    """Create a test admin account if it doesn't exist."""
    admin_username = "admin@itfarm.io"
    admin_password = "AdminSecure123!"
    
    existing_admin = await users_collection.find_one({"username": admin_username})
    if not existing_admin:
        hashed_password = pwd_context.hash(admin_password[:72])
        admin_user = {
            "username": admin_username,
            "password": hashed_password,
            "full_name": "System Administrator",
            "is_admin": True,
            "role": "admin",
            "created_at": datetime.utcnow()
        }
        await users_collection.insert_one(admin_user)
        print(f"✓ Test admin created: {admin_username} / {admin_password}")
    else:
        print(f"✓ Admin account already exists: {admin_username}")

async def keep_alive():
    """Ping self every 50 seconds to prevent Render free tier cold start."""
    try:
        backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
        async with httpx.AsyncClient() as client:
            await client.get(f"{backend_url}/health", timeout=10.0)
            print(f"✓ Keep-alive ping sent to {backend_url}/health")
    except Exception as e:
        print(f"✗ Keep-alive ping failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create test admin and start scheduler
    await create_test_admin()
    
    if os.getenv("BACKEND_URL"):
        scheduler.add_job(keep_alive, 'interval', seconds=50, id='keep_alive')
        scheduler.start()
        print("🚀 Keep-alive scheduler started (50s interval)")
    yield
    # Shutdown: Stop scheduler
    if scheduler.running:
        scheduler.shutdown()
        print("🛑 Keep-alive scheduler stopped")

app = FastAPI(
    title="IT FARM GLOBAL DELIVERY NETWORK API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://neuralforgehub.tech",
        "https://www.neuralforgehub.tech",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.netlify\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_controller.router, tags=["Chatbot"])
app.include_router(auth_controller.router, tags=["Authentication"])
app.include_router(inquiry_controller.router, tags=["Inquiry"])
app.include_router(notifications_controller.router, tags=["Notifications"])  # ← added
app.include_router(update_controller.router, tags=["Updates"])

@app.get("/")
async def root():
    return {
        "status": "Online",
        "network": "IT FARM GLOBAL",
        "db": "MongoDB Atlas",
        "mode": "Async"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and keep-alive pings."""
    return {
        "status": "healthy",
        "service": "IT FARM API",
        "scheduler": "active" if scheduler.running else "inactive"
    }
