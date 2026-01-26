from app.database import inquiry_collection
from app.models.inquiry import inquiry_serializer  # ✅ correct import
from app.schemas.inquiry_schema import InquiryCreate
from datetime import datetime

async def create_inquiry(inquiry: InquiryCreate):
    inquiry_dict = inquiry.dict()

    # ✅ MongoDB-safe conversions
    inquiry_dict["date"] = str(inquiry_dict["date"])
    inquiry_dict["time"] = str(inquiry_dict["time"])
    inquiry_dict["created_at"] = datetime.utcnow()

    result = await inquiry_collection.insert_one(inquiry_dict)
    inquiry_dict["_id"] = result.inserted_id

    return inquiry_serializer(inquiry_dict)

async def get_all_inquiries():
    inquiries = []
    async for inquiry in inquiry_collection.find().sort("created_at", -1):
        inquiries.append(inquiry_serializer(inquiry))
    return inquiries
