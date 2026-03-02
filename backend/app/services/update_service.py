from datetime import datetime
from typing import List, Optional

from app.database import updates_collection
from app.models.update import update_serializer
from app.schemas.update_schema import UpdateCreate
from app.controllers.notifications_controller import notify_admins


def _display_date(dt: datetime) -> str:
    return dt.strftime("%b %d, %Y").upper()


async def create_update(payload: UpdateCreate):
    now = datetime.utcnow()
    data = payload.model_dump()
    data["created_at"] = now
    data["date"] = _display_date(now)

    result = await updates_collection.insert_one(data)
    data["_id"] = result.inserted_id
    serialized = update_serializer(data)

    await notify_admins({
        "type": "new_update",
        "data": {
            "id": serialized["id"],
            "title": serialized["title"],
            "category": serialized["category"],
        },
    })

    return serialized


async def get_updates(category: Optional[str] = None) -> List[dict]:
    query = {"category": category} if category else {}
    updates = []

    async for update in updates_collection.find(query).sort("created_at", -1):
        updates.append(update_serializer(update))

    return updates
