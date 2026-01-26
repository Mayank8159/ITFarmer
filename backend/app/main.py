from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import (
    chatbot_controller,
    auth_controller,
    inquiry_controller,
    notifications_controller
)

app = FastAPI(title="IT FARM GLOBAL DELIVERY NETWORK API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_controller.router, tags=["Chatbot"])
app.include_router(auth_controller.router, tags=["Authentication"])
app.include_router(inquiry_controller.router, tags=["Inquiry"])
app.include_router(notifications_controller.router, tags=["Notifications"])  # ← added

@app.get("/")
async def root():
    return {
        "status": "Online",
        "network": "IT FARM GLOBAL",
        "db": "MongoDB Atlas",
        "mode": "Async"
    }
