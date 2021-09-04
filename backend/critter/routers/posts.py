from typing import Optional
from critter.models import User, Post
from critter.schemas.posts import Posts
from critter.database import session
from critter.common import auth, auth_optional
from critter import schemas
from fastapi.param_functions import Body, Query
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import joinedload

# Configuration
router = APIRouter(
    prefix="/posts", tags=["posts"], responses={404: {"detail": "Not found"}}
)


@router.get("")
async def get_posts(
    user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0), 
    limit: Optional[int] = Query(10)
    ):
    try:
        if user:
            stmt = select(Post).options(joinedload(Post.user)).order_by(Post.created_at).limit(limit).offset(skip)
            posts = session.execute(stmt).scalars().all()
            posts = Posts(posts=posts)
            return posts
        else:
            # TODO: Customise posts for logged in user
            stmt = select(Post).options(joinedload(Post.user)).order_by(Post.created_at).limit(limit).offset(skip)
            posts = session.execute(stmt).scalars().all()
            posts = Posts(posts=posts)
            return posts

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)


@router.post("")
async def create_post(
    user: User = Depends(auth), post: schemas.Post = Body(..., embed=True)
):
    try:
        user.posts.append(Post(**post.__dict__))
        session.commit()

        return post

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        session.rollback()
        raise HTTPException(500)


@router.post("/{id}/reply", status_code=201)
async def create_reply(
    id: int,
    user: User = Depends(auth),
    post: schemas.Post = Body(..., embed=True),
):
    try:
        reply = Post(**post.__dict__, user_id=user.id)

        stmt = select(Post).filter_by(id=id)
        post = session.execute(stmt).scalar_one()
        
        post.replies.append(reply)
        session.commit()

        return {"detail": "Post created"}

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        session.rollback()
        raise HTTPException(500)
