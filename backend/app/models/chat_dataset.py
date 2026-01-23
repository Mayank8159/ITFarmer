from pydantic import BaseModel

class ChatPair(BaseModel):
    user_message: str
    bot_reply: str
