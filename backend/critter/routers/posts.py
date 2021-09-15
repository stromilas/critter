from operator import and_, or_
from typing import List, Optional
from critter.models import User, Post
from critter.database import session
from critter.common import auth, auth_optional
from critter.core import error
from critter import schemas
from critter.models.models import Interaction
from fastapi.param_functions import Body, Query
from sqlalchemy import select, desc, asc
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import contains_eager, joinedload, aliased
from sqlalchemy.sql.expression import case
from sqlalchemy.sql.functions import func

# Configuration
router = APIRouter(
    prefix="/posts", tags=["posts"], responses={404: {"detail": "Not found"}}
)


@router.get("", response_model=schemas.OutPosts)
async def get_posts(
    user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        subquery = posts_subquery(user_id=user.id, skip=skip, limit=limit)

        stmt = (
            select(Post, subquery)
            .options(joinedload(Post.parent))
            .join(subquery, subquery.c.id == Post.id)
        )

        results = session.execute(stmt).all()
        posts = parse_posts(results)

        return {"posts": posts}

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        raise HTTPException(500)


@router.get("/{id}")
async def get_post(id: int, user: Optional[User] = Depends(auth_optional)):
    try:
        subquery = posts_subquery(user_id=user.id, ids=[id])

        stmt = select(Post, subquery).join(subquery, subquery.c.id == Post.id)

        results = session.execute(stmt).all()
        post = parse_posts(results)[0]

        return {"post": post}

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        raise HTTPException(500)


@router.get("/{id}/parents")
async def get_parents(
    id: int,
    user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        # Traverse parent posts and get IDs
        hierarchy = (
            select(Post.id)
            .filter(and_(Post.parent_id == None, Post.id != id))
            .cte(name="hierarchy", recursive=True)
        )

        stmt = hierarchy.union_all(
            select(Post.id).filter(
                and_(Post.parent_id == hierarchy.c.id, Post.id != id)
            )
        )

        results = session.execute(select(stmt)).all()
        parent_ids = [x[0] for x in results]

        # If current post is the root
        if len(parent_ids) < 1:
            return {"posts": []}

        # Get parent post chain
        subquery = posts_subquery(
            user_id=user.id, ids=parent_ids, skip=skip, limit=limit
        )
        stmt = select(Post, subquery).join(subquery, subquery.c.id == Post.id)

        results = session.execute(stmt).all()
        posts = parse_posts(results)

        return {"posts": posts}

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        raise HTTPException(500)


@router.get("/{id}/replies")
async def get_replies(
    id: int,
    user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        subquery = posts_subquery(user_id=user.id, parent_id=id, skip=skip, limit=limit)

        stmt = select(Post, subquery).join(subquery, subquery.c.id == Post.id)

        results = session.execute(stmt).all()
        posts = parse_posts(results)

        return {"posts": posts}

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


@router.post("/{id}/replies", status_code=201)
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


@router.post("/{id}/{type}", status_code=201)
async def interact_like(
    id: int,
    type: schemas.InteractType,
    body: schemas.InInteract = Body(...),
    user: User = Depends(auth),
):
    """Note: user can like/share his own post"""

    try:
        # Find existing interaction
        stmt = select(Interaction).filter(
            and_(
                Interaction.type == type,
                and_(Interaction.user_id == user.id, Interaction.post_id == id),
            )
        )
        interaction = session.execute(stmt).scalar()

        # User is adding interaction
        if body.set:
            # Must not exist
            if interaction is None:
                interaction = Interaction(user=user, post_id=id, type=type)
                session.add(interaction)
                session.commit()

        # User is removing interaction
        else:
            # Must exist
            if interaction is not None:
                session.delete(interaction)
                session.commit()
        return

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)


def parse_posts(results):
    posts = []
    for post in results:
        p = post[0].__dict__
        p["likes"] = post.likes
        p["shares"] = post.shares
        p["liked"] = post.liked
        p["shared"] = post.shared
        posts.append(schemas.OutPost(**p))
    return posts


def posts_subquery(
    user_id: int,
    parent_id: int = None,
    ids: List = None,
    limit: int = 10,
    skip: int = 0,
):
    subquery = (
        select(
            Post.id,
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
            func.max(
                case(
                    [
                        (
                            and_(
                                Interaction.type == "like",
                                Interaction.user_id == user_id,
                            ),
                            1,
                        ),
                    ],
                    else_=0,
                ),
            ).label("liked")
            if user_id is not None
            else None,
            func.max(
                case(
                    [
                        (
                            and_(
                                Interaction.type == "share",
                                Interaction.user_id == user_id,
                            ),
                            1,
                        ),
                    ],
                    else_=0,
                ),
            ).label("shared")
            if user_id is not None
            else None,
        )
        .join(Interaction, Post.interactions, isouter=True)
        .filter(Post.parent_id == parent_id if parent_id is not None else True)
        .filter(Post.id.in_(ids) if ids else True)
        .group_by(Post.id)
        .order_by(desc(Post.created_at))
        .offset(skip)
        .limit(limit)
        .subquery()
    )

    return subquery
