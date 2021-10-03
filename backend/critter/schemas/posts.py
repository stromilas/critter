from datetime import datetime
from typing import List, Optional
from pydantic.fields import Field
from pydantic.types import UUID4
from sqlalchemy.sql.sqltypes import Enum
from .base import CoreModel, BaseModel
from .users import PublicUser

class InteractType(str, Enum):
    like = "like"
    share = "share"


class Media(CoreModel):
    id: int
    file_name: str
    
class InPost(CoreModel):
    id: UUID4
    text: str
    files: List[str] = []


class BaseOutPost(CoreModel):
    id: UUID4
    text: str
    created_at: datetime
    parent: Optional['BaseOutPost'] = None
    user: Optional[PublicUser]
    files: Optional[List[str]]

BaseOutPost.update_forward_refs()

class OutPost(CoreModel):
    id: UUID4
    text: str
    created_at: datetime
    parent: Optional[BaseOutPost] = None
    user: Optional[PublicUser]
    shares: int
    likes: int
    liked: Optional[bool] = False
    shared: Optional[bool] = False
    media: Optional[List[Media]]


class OutPosts(CoreModel):
    posts: List[OutPost]

class InInteract(CoreModel):
    set: bool

