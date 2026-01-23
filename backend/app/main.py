from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import chatbot_controller

app = FastAPI()

# Allow your frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(chatbot_controller.router)
