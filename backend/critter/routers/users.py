from operator import and_
from typing import Optional
from critter.models import User, Post
from critter.database import session
from critter.common import auth, auth_optional
from critter import schemas
from critter.models.models import Follow, Interaction
from critter.schemas.users import PublicUser
from critter.controllers import post as ctrl_post
from fastapi.param_functions import Depends, Query
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import joinedload
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
async def get_user(username: str, _user: User = Depends(auth_optional)):
    try:
        stmt = select(User).filter_by(username=username)
        user = session.execute(stmt).scalar()
        follower_count = session.execute(
            select(Follow)
            .filter_by(followee_id=user.id)
            .with_only_columns([func.count()])
        ).scalar()
        followee_count = session.execute(
            select(Follow)
            .filter_by(follower_id=user.id)
            .with_only_columns([func.count()])
        ).scalar()
        following = False
        if _user:
            following = bool(
                session.execute(
                    select(Follow).filter(
                        and_(
                            Follow.followee_id == user.id,
                            Follow.follower_id == _user.id,
                        )
                    )
                ).scalar()
            )
        user = schemas.PublicUser(
            **user.__dict__,
            followers_num=follower_count,
            followees_num=followee_count,
            is_following=following
        )

        return {"user": user}

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)


@router.get("/{username}/posts", response_model=schemas.OutPosts)
async def get_user_posts(
    username: str,
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
    _user: Optional[User] = Depends(auth_optional),
    likes: Optional[bool] = Query(False)
):
    try:
        subquery = ctrl_post.get_posts(
            user_id=_user.id if _user else None, skip=skip, limit=limit
        )

        stmt = select(User).filter_by(username=username)
        user = session.execute(stmt).scalar()

        if not user:
            raise HTTPException(404)

        stmt = select(Post, subquery)
        stmt = stmt.options(joinedload(Post.parent))
        stmt = stmt.join(subquery, subquery.c.id == Post.id)
        if likes:
            stmt = stmt.join(Post.interactions)
            stmt = stmt.filter(and_(Interaction.user_id == user.id, Interaction.type == 'like'))
        else:
            stmt = stmt.filter(Post.user_id == user.id)

        results = session.execute(stmt).all()
        posts = ctrl_post.parse_posts(results)

        return {"posts": posts}

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)

@router.get("/{username}/posts/likes", response_model=schemas.OutPosts)
async def get_user_posts(
    username: str,
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
    _user: Optional[User] = Depends(auth_optional),
):
    try:
        subquery = ctrl_post.get_posts(
            user_id=_user.id if _user else None, skip=skip, limit=limit
        )

        stmt = select(User).filter_by(username=username)
        user = session.execute(stmt).scalar()

        if not user:
            raise HTTPException(404)

        stmt = (
            select(Post, subquery)
            .options(joinedload(Post.parent))
            .join(subquery, subquery.c.id == Post.id)
            .filter(Post.user_id == user.id)
        )

        results = session.execute(stmt).all()
        posts = ctrl_post.parse_posts(results)

        return {"posts": posts}

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)
