from operator import and_
from typing import Optional
from critter.models import User, Post
from critter.database import session
from critter.common import auth, auth_optional
from critter.core import error
from critter import schemas
from critter.models.models import Interaction
from fastapi.param_functions import Body, Query
from sqlalchemy import select, desc
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.sql.expression import case
from sqlalchemy.sql.functions import func

# Configuration
router = APIRouter(
    prefix="/posts", tags=["posts"], responses={404: {"detail": "Not found"}}
)


@router.get("")
async def get_posts(
    user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        subquery = (
            select(
                Post.id,
                Post.text,
                Post.user_id,
                Post.created_at,
                func.sum(
                    case(
                        [
                            (Interaction.type == "like", 1),
                        ],
                        else_=0,
                    ),
                ).label("likes"),
                func.sum(
                    case(
                        [
                            (Interaction.type == "share", 1),
                        ],
                        else_=0,
                    ),
                ).label("shares"),
            )
            .join(Interaction, Post.interactions, isouter=True)
            .group_by(Post.id)
            .limit(limit)
            .offset(skip)
            .subquery()
        )

        stmt = select(User.name, User.username, subquery).join(
            subquery, subquery.c.user_id == User.id
        )

        result = session.execute(stmt)
        keys = result.keys()
        posts = {
            "posts": [schemas.OutPost.from_core(keys, post) for post in result.all()]
        }

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
        new_post = Post(**post.__dict__)
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


@router.post("/{id}/like", status_code=201)
async def interact_like(
    id: int, like: schemas.InInteract = Body(...), user: User = Depends(auth)
):
    """
    Note: user can like his own post
    """
    try:
        # Has user already liked the post
        stmt = select(Interaction).filter(
            and_(
                Interaction.type == "like",
                and_(Interaction.user_id == user.id, Interaction.post_id == id),
            )
        )
        interaction = session.execute(stmt).scalar()

        # User has pressed like
        if like.set:
            # Like must not exist
            if interaction is None:
                interaction = Interaction(user=user, post_id=id, type="like")
                session.add(interaction)
                session.commit()

        # User has pressed un-like
        else:
            # Like must exist
            if interaction is not None:
                session.delete(interaction)
                session.commit()
        return

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)
