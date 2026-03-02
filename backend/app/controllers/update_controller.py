from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from app.schemas.update_schema import UpdateCreate, UpdateResponse
from app.services.update_service import create_update, get_updates
from app.controllers.auth_controller import get_current_user

router = APIRouter(prefix="/updates")


@router.get("", response_model=List[UpdateResponse])
async def fetch_updates(category: Optional[str] = Query(default=None)):
    return await get_updates(category)


@router.post("", response_model=UpdateResponse)
async def submit_update(payload: UpdateCreate, current_user: str = Depends(get_current_user)):
    # Auth dependency ensures only logged-in users can publish updates.
    return await create_update(payload)
