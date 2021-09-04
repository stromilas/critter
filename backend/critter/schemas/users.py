from typing import Optional
from .base import BaseORM

class PublicUser(BaseORM):
    id: int
    username: str
    name: str
    location: Optional[str]
    website: Optional[str]

