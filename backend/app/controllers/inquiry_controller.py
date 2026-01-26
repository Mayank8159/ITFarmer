from fastapi import APIRouter
from typing import List

from app.schemas.inquiry_schema import InquiryCreate, InquiryResponse
from app.services.inquiry_service import create_inquiry, get_all_inquiries

router = APIRouter(prefix="/inquiry")

@router.post("", response_model=InquiryResponse)
async def submit_inquiry(inquiry: InquiryCreate):
    return await create_inquiry(inquiry)

@router.get("", response_model=List[InquiryResponse])
async def fetch_inquiries():
    return await get_all_inquiries()
