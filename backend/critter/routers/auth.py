from datetime import datetime, timedelta

from critter.models import User
from critter.database import session
from critter.schemas.auth import SignUpForm, Token
from critter.schemas.users import PublicUser
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from critter.core.security import jwt_context, password_context

# Configuration
router = APIRouter(
    prefix="/auth", tags=["auth"], responses={404: {"detail": "Not found"}}
)

def tokenise(username: str, name: str) -> Token:
    expires = datetime.utcnow() + timedelta(minutes=jwt_context.access_token_expire_minutes)
    unencoded = {
        "username": username,
        "name": name,
        "exp": expires
    }
    encoded = jwt.encode(unencoded, jwt_context.secret_key, jwt_context.algorithm)
    return Token(access_token=encoded, token_type="bearer", expires=expires)


@router.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends()):
    try:
        stmt = select(User).filter_by(username=data.username)
        user = session.execute(stmt).scalar_one()

        if not password_context.verify(secret=data.password, hash=user.password):
            raise HTTPException(403)

        token = tokenise(user.username, user.name)

        response = {
            'token': token,
            'user': PublicUser.from_orm(user)
        }

        return response

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

        response = {
            'token': token,
            'user': PublicUser.from_orm(user)
        }

        return response

    except HTTPException as exception:
        session.rollback()
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        session.rollback()
        raise HTTPException(500)

    finally:
        session.close()
