from datetime import datetime
from app.database import inquiry_collection
from app.models.inquiry import inquiry_serializer
from app.schemas.inquiry_schema import InquiryCreate
from app.controllers.notifications_controller import notify_admins

async def create_inquiry(inquiry: InquiryCreate):
    inquiry_dict = inquiry.dict()
    inquiry_dict["created_at"] = datetime.utcnow()

    result = await inquiry_collection.insert_one(inquiry_dict)
    inquiry_dict["_id"] = result.inserted_id

    # Serialize
    serialized = inquiry_serializer(inquiry_dict)

    # 🔔 Notify admin
    await notify_admins({
        "type": "new_inquiry",
        "data": serialized
    })

    return serialized

async def get_all_inquiries():
    inquiries = []
    async for inquiry in inquiry_collection.find().sort("created_at", -1):
        inquiries.append(inquiry_serializer(inquiry))
    return inquiries
