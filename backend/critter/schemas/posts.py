from datetime import datetime
from typing import List, Optional
from .base import BaseORM
from pydantic import BaseModel
from .users import PublicUser


class InPost(BaseModel):
    text: str
    
class Post(BaseORM):
    id: int
    text: str
    created_at: datetime
    user: Optional[PublicUser]

class Posts(BaseModel):
    posts: List[Post]

