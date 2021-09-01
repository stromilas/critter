from typing import Optional
from pydantic import BaseModel

class Post(BaseModel):
    text: str
