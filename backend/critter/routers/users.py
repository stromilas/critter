from typing import Optional
from critter.models import User, Post
from critter.database import session
from critter.common import auth
from critter import schemas
from fastapi.param_functions import Query
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, HTTPException

# Configuration
router = APIRouter(
    prefix="/users", tags=["chirps"], responses={404: {"detail": "Not found"}}
)

@router.get("/{id}")
async def get_posts(id: int):
    try:
        stmt = select(User).filter_by(id=id)
        user = session.execute(stmt).scalar_one()
        user = schemas.PublicUser(**user.__dict__)
        return {"user": user}

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)

@router.get("/{id}/posts")
async def get_posts(id: int, skip: Optional[int] = Query(0), limit: Optional[int] = Query(10)):
    try:
        stmt = select(Post).where(Post.user_id==id).offset(skip).limit(limit)
        posts = session.execute(stmt).scalars().all()
        return {"posts": posts}

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)

