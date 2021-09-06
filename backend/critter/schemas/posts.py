from datetime import datetime
from typing import List, Optional
from .base import CoreModel


class InPost(CoreModel):
    text: str

class OutPost(CoreModel):
    id: int
    user_id: int
    text: str
    name: str
    username: str
    shares: int
    likes: int
    liked: bool = False
    shared: bool = False
    created_at: datetime
    

class OutPosts(CoreModel):
    posts: List[OutPost]

class InInteract(CoreModel):
    set: bool

