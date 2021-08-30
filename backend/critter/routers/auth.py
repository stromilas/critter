from datetime import datetime, timedelta
from dotenv import load_dotenv
from os import environ as env
from fastapi import APIRouter
from critter.models import User
from critter.database import session
from critter.types.auth import JWTContext, Token
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt


# Configuration
router = APIRouter(
    prefix="/auth", tags=["auth"], responses={404: {"description": "Not found"}}
)
load_dotenv()
token = OAuth2PasswordBearer(tokenUrl="auth/login")
password_context = CryptContext(schemes=["bcrypt"])
jwt_context = JWTContext(
    secret_key=env.get("SECRET_KEY"),
    algorithm=env.get("ALGORITHM"),
    access_token_expire_minutes=env.get("ACCESS_TOKEN_EXPIRE_MINUTES"),
)


@router.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends()):
    try:
        stmt = select(User).filter_by(username=data.username)
        user = session.execute(stmt).scalar_one()

        if not password_context.verify(secret=data.password, hash=user.password):
            raise HTTPException(403)

        unencoded = {
            "username": user.username,
            "name": user.name,
            "exp": datetime.utcnow()
            + timedelta(minutes=jwt_context.access_token_expire_minutes),
        }

        encoded = jwt.encode(unencoded, jwt_context.secret_key, jwt_context.algorithm)
        token = Token(access_token=encoded, token_type="bearer")

        return token

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except:
        raise HTTPException(500)
