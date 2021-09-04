from critter.schemas.auth import JWTContext
from os import environ as env
from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

# Load environment variables from .env
load_dotenv()

# Establish token scheme
token_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

# Configure JWT and password hashing 
password_context = CryptContext(schemes=["bcrypt"])
jwt_context = JWTContext(
    secret_key=env.get("SECRET_KEY"),
    algorithm=env.get("ALGORITHM"),
    access_token_expire_minutes=env.get("ACCESS_TOKEN_EXPIRE_MINUTES"),
)