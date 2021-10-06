from typing import Optional
from .base import CoreModel

class PublicUser(CoreModel):
    id: int
    username: str
    name: str
    profile: str
    banner: str
    is_following: Optional[bool]
    is_followed_by: Optional[bool]
    followers_num: Optional[int]
    followees_num: Optional[int]
    location: Optional[str]
    website: Optional[str]

PublicUser.update_forward_refs()
