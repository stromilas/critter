from typing import Optional
from pydantic import BaseModel


class JWTContext(BaseModel):
    secret_key: str
    algorithm: str
    access_token_expire_minutes: Optional[int] = 60


class Token(BaseModel):
    access_token: str
    token_type: str