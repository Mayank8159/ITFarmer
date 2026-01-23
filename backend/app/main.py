from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import chatbot_controller, auth_controller

app = FastAPI(title="IT FARM GLOBAL DELIVERY NETWORK API")

# 1. CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. ROUTER INCLUSION
# Chatbot Routes
app.include_router(chatbot_controller.router, tags=["Chatbot"])

# Authentication Routes (Register & Token)
app.include_router(auth_controller.router, tags=["Authentication"])

@app.get("/")
async def root():
    return {"status": "Online", "network": "IT FARM GLOBAL"}