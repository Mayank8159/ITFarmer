from fastapi import APIRouter
from app.services.chatbot_service import ChatbotService
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/chat",  # ✅ This ensures all endpoints start with /api/chat
    tags=["chatbot"]
)

# Request body model
class ChatRequest(BaseModel):
    message: str

# Response model
class ChatResponse(BaseModel):
    reply: str

chatbot_service = ChatbotService()

@router.post("/")
async def chat(request: ChatRequest):
    reply = chatbot_service.get_reply(request.message)
    return ChatResponse(reply=reply)
