from critter.schemas.auth import JWTContext
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from critter.core import config

# Establish token scheme
token_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

# Configure JWT and password hashing
password_context = CryptContext(schemes=["bcrypt"])
jwt_context = JWTContext(
    secret_key=config.auth_secret_key,
    algorithm=config.auth_algorithm,
    access_token_expire_minutes=config.auth_access_token_expires,
)
