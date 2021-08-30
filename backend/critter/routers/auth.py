from datetime import datetime, timedelta
from dotenv import load_dotenv
from os import environ as env
from critter.models import User
from critter.database import session
from critter.types.auth import JWTContext, SignUpForm, Token
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException
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


def tokenise(username: str, name: str) -> Token:
    unencoded = {
        "username": username,
        "name": name,
        "exp": datetime.utcnow()
        + timedelta(minutes=jwt_context.access_token_expire_minutes),
    }
    encoded = jwt.encode(unencoded, jwt_context.secret_key, jwt_context.algorithm)
    return Token(access_token=encoded, token_type="bearer")


@router.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends()):
    try:
        stmt = select(User).filter_by(username=data.username)
        user = session.execute(stmt).scalar_one()

        if not password_context.verify(secret=data.password, hash=user.password):
            raise HTTPException(403)

        token = tokenise(user.username, user.name)
        return token

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except:
        raise HTTPException(500)


@router.post("/signup")
async def signup(data: SignUpForm = Depends()):
    try:
        stmt = select(User).filter_by(username=data.username)
        user = session.execute(stmt).scalar()

        if user is not None:
            raise HTTPException(403, detail="User already exists")

        user = User(
            username=data.username,
            name=data.name,
            password=password_context.hash(secret=data.password),
        )

        session.add(user)
        session.commit()

        token = tokenise(user.username, user.name)
        return token

    except HTTPException as exception:
        session.rollback()
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        session.rollback()
        raise HTTPException(500)

    finally:
        session.close()
