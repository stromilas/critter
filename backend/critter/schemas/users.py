from typing import Optional
from pydantic import BaseModel

class PublicUser(BaseModel):
    id: int
    username: str
    name: str
    location: Optional[str]
    website: Optional[str]
