from pydantic import BaseModel, Field
from typing import List, Optional, Literal

UpdateCategory = Literal["project", "team", "update"]


class UpdateCreate(BaseModel):
    category: UpdateCategory
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=1200)
    tags: List[str] = Field(default_factory=list)
    image: Optional[str] = None
    role: Optional[str] = None
    link: Optional[str] = None


class UpdateResponse(UpdateCreate):
    id: str
    date: str
    created_at: str
