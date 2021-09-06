from typing import Optional
from .base import CoreModel

class PublicUser(CoreModel):
    id: int
    username: str
    name: str
    location: Optional[str]
    website: Optional[str]

