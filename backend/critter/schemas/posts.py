from datetime import datetime
from typing import List, Optional
from sqlalchemy.sql.sqltypes import Enum
from .base import CoreModel, BaseModel
from .users import PublicUser

class InteractType(str, Enum):
    like = "like"
    share = "share"

class InPost(CoreModel):
    text: str


class BaseOutPost(CoreModel):
    id: int
    text: str
    created_at: datetime
    parent: Optional['BaseOutPost'] = None
    user: Optional[PublicUser]

BaseOutPost.update_forward_refs()

class OutPost(CoreModel):
    id: int
    text: str
    created_at: datetime
    parent: Optional[BaseOutPost] = None
    user: Optional[PublicUser]
    shares: int
    likes: int
    liked: Optional[bool] = False
    shared: Optional[bool] = False
    
    

class OutPosts(CoreModel):
    posts: List[OutPost]

class InInteract(CoreModel):
    set: bool

