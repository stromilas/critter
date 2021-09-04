from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from fastapi.param_functions import Form

class JWTContext(BaseModel):
    secret_key: str
    algorithm: str
    access_token_expire_minutes: Optional[int] = 60


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    expires: datetime


class SignUpForm():
    def __init__(
        self,
        username: str = Form(...),
        name: str = Form(...),
        password: str = Form(...)
    ):
        self.username = username
        self.name = name
        self.password = password


