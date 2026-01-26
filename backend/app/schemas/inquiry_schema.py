from pydantic import BaseModel, EmailStr
from typing import Optional

class InquiryCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    budget: Optional[str] = None
    service: str
    date: str
    time: str
    message: str

class InquiryResponse(InquiryCreate):
    id: str
