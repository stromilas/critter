from typing import Optional
from critter.models import User, Post
from critter.database import session
from critter.common import auth, auth_optional
from critter.core import error
from critter import schemas
from fastapi.param_functions import Body, Query
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException

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
            stmt = select(Post).order_by(Post.created_at).limit(limit).offset(skip)
            posts = session.execute(stmt).scalars().all()
            posts = schemas.Posts(posts=posts)
            return posts
        else:
            # TODO: Customise posts for logged in user
            stmt = select(Post).order_by(Post.created_at).limit(limit).offset(skip)
            posts = session.execute(stmt).scalars().all()
            posts = schemas.Posts(posts=posts)
            return posts

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        raise HTTPException(500)


@router.post("", status_code=201)
async def create_post(
    user: User = Depends(auth), post: schemas.InPost = Body(..., embed=True)
):
    try:
        print(user.__dict__)
        print(post)
        new_post = Post(**post.__dict__)
        print(new_post.__dict__)
        user.posts.append(new_post)
        session.commit()
        return

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)


@router.post("/{id}/reply", status_code=201)
async def create_reply(
    id: int,
    user: User = Depends(auth),
    post: schemas.InPost = Body(..., embed=True),
):
    try:
        reply = Post(**post.__dict__, user_id=user.id)

        stmt = select(Post).filter_by(id=id)
        post = session.execute(stmt).scalar_one()
        
        post.replies.append(reply)
        session.commit()
        return 

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)
