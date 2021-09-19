from typing import Optional
from critter.models import User, Post
from critter.database import session
from critter.common import auth
from critter import schemas
from critter.models.models import Follow
from critter.schemas.users import PublicUser
from fastapi.param_functions import Depends, Query
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm.strategy_options import joinedload, noload
from sqlalchemy.orm.util import aliased
from sqlalchemy.sql.functions import func

# Configuration
router = APIRouter(
    prefix="/users", tags=["chirps"], responses={404: {"detail": "Not found"}}
)

@router.get("/me")
async def get_self(user: User = Depends(auth)):
    try:
        user = PublicUser.from_orm(user)
        return user
    except Exception as e:
        print(e)
        raise HTTPException(500)

@router.get("/{username}")
async def get_posts(username: str):
    try:
        stmt = select(User).filter_by(username=username)
        user = session.execute(stmt).scalar()
        follower_count = session.execute(select(Follow).filter_by(followee_id=user.id).with_only_columns([func.count()])).scalar()
        followee_count = session.execute(select(Follow).filter_by(follower_id=user.id).with_only_columns([func.count()])).scalar()

        user = schemas.PublicUser(
            **user.__dict__, 
            followers_num=follower_count,
            followees_num=followee_count
        )

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

