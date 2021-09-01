from critter.models import User, Post
from critter.database import session
from critter.common import authenticated
from critter import schemas
from fastapi.openapi.models import HTTPBase, Response
from fastapi.param_functions import Body
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException

# Configuration
router = APIRouter(
    prefix="/posts", tags=["chirps"], responses={404: {"detail": "Not found"}}
)


@router.get("")
async def get_posts(user: User = Depends(authenticated)):
    try:
        return {"posts": user.posts}

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)


@router.post("")
async def create_post(
    user: User = Depends(authenticated), post: schemas.Post = Body(..., embed=True)
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
    user: User = Depends(authenticated),
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
