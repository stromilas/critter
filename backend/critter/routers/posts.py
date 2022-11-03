from operator import and_, or_
from typing import List, Optional
from botocore.config import Config
from critter.models import User, Post
from critter.database import session
from critter.common import auth, auth_optional
from critter.core import error
from critter import schemas
from critter.models.models import Interaction, Media
from fastapi.param_functions import Body, Query
from pydantic.types import UUID4
from sqlalchemy import select, desc, asc
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import contains_eager, joinedload, aliased, selectinload
from sqlalchemy.sql.expression import case
from sqlalchemy.sql.functions import func
from critter.controllers import post as ctrl_post
from critter.core import config
import boto3

# Configuration
boto3.setup_default_session(
    aws_access_key_id=config.aws_access_key,
    aws_secret_access_key=config.aws_secret_key,
)

router = APIRouter(
    prefix="/posts", tags=["posts"], responses={404: {"detail": "Not found"}}
)


@router.get("", response_model=schemas.OutPosts)
async def get_posts(
    me: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        subquery = ctrl_post.get_posts(
            user_id=me.id if me else None, skip=skip, limit=limit
        )

        stmt = (
            select(Post, subquery)
            .options(joinedload(Post.parent))
            .join(subquery, subquery.c.id == Post.id)
            .options(selectinload(Post.media))
        )

        results = session.execute(stmt).all()
        posts = ctrl_post.parse_posts(results)

        return {"posts": posts}

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        raise HTTPException(500)


@router.get("/top", response_model=schemas.OutPosts)
async def get_top_posts(
    me: User = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
    media: Optional[bool] = Query(False),
):
    try:
        subquery = ctrl_post.get_posts(
            user_id=me.id if me else None, skip=skip, limit=limit
        )

        stmt = select(Post, subquery)
        stmt = stmt.join(subquery, subquery.c.id == Post.id)
        stmt = stmt.order_by(desc(subquery.c.likes + subquery.c.shares))
        if media:
            stmt = stmt.join(Post.media)
        else:
            stmt = stmt.join(Post.media, isouter=True)
        stmt = stmt.options(contains_eager(Post.media))

        results = session.execute(stmt).unique().all()
        posts = ctrl_post.parse_posts(results)

        return {"posts": posts}

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)


@router.get("/latest", response_model=schemas.OutPosts)
async def get_latest_posts(
    me: User = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        subquery = ctrl_post.get_posts(
            user_id=me.id if me else None, skip=skip, limit=limit
        )

        stmt = (
            select(Post, subquery)
            .join(subquery, subquery.c.id == Post.id)
            .order_by(desc(Post.created_at))
            .options(selectinload(Post.media))
        )

        results = session.execute(stmt).all()
        posts = ctrl_post.parse_posts(results)

        return {"posts": posts}

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)


@router.get("/saved", response_model=schemas.OutPosts)
async def get_saved_posts(
    me: User = Depends(auth),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        subquery = ctrl_post.get_posts(user_id=me.id, skip=skip, limit=limit)

        stmt = (
            select(Post, subquery)
            .join(subquery, subquery.c.id == Post.id)
            .where(subquery.c.saved == 1)
            .options(selectinload(Post.media))
        )

        results = session.execute(stmt).all()
        posts = ctrl_post.parse_posts(results)

        return {"posts": posts}

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)


@router.get("/media-endpoint")
async def get_media_endpoint(
    me: User = Depends(auth),
    id: UUID4 = Query(...),
    file: str = Query(...),
):
    s3 = boto3.client("s3", config=Config(signature_version="s3v4"))
    try:
        signed_url = s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": "critter-public",
                "Key": f"posts/{me.username}/{id}/{file}",
            },
            ExpiresIn=10,
        )
        return signed_url

    except Exception as e:
        error(e)
        session.rollback()
        raise HTTPException(500)


@router.get("/{id}")
async def get_post(id: UUID4, user: Optional[User] = Depends(auth_optional)):
    try:
        subquery = ctrl_post.get_posts(user_id=user.id if user else None, ids=[id])

        stmt = (
            select(Post, subquery)
            .join(subquery, subquery.c.id == Post.id)
            .options(selectinload(Post.media))
        )

        results = session.execute(stmt).all()
        post = ctrl_post.parse_posts(results)[0]

        print(post.__dict__)

        return {"post": post}

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        raise HTTPException(500)


@router.get("/{id}/parents")
async def get_parents(
    id: UUID4,
    user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        stmt = select(Post).filter_by(id=id)
        post = session.execute(stmt).scalar()

        # If current post is the root
        if post.parent_id is None:
            return {"posts": []}

        # Get initial parent
        hierarchy = (
            select(Post.id, Post.parent_id)
            .filter(Post.id == post.parent_id)
            .cte(name="hierarchy", recursive=True)
        )

        # Get initial parent's parent
        # and recurse using latest parent
        stmt = hierarchy.union_all(
            select(Post.id, Post.parent_id).filter(Post.id == hierarchy.c.parent_id)
        )

        results = session.execute(select(stmt)).all()
        parent_ids = [x[0] for x in results]

        # Get parent post chain
        subquery = ctrl_post.get_posts(
            user_id=user.id if user else None, ids=parent_ids, skip=skip, limit=limit
        )
        stmt = select(Post, subquery).join(subquery, subquery.c.id == Post.id)

        results = session.execute(stmt).all()
        posts = ctrl_post.parse_posts(results)

        return {"posts": posts}

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        error(e)
        raise HTTPException(500)


@router.get("/{id}/replies")
async def get_replies(
    id: UUID4,
    user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
):
    try:
        subquery = ctrl_post.get_posts(
            user_id=user.id if user else None, parent_id=id, skip=skip, limit=limit
        )

        stmt = (
            select(Post, subquery)
            .join(subquery, subquery.c.id == Post.id)
            .options(selectinload(Post.media))
        )

        results = session.execute(stmt).all()
        posts = ctrl_post.parse_posts(results)

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
        new_post = Post(
            id=post.id,
            text=post.text,
            media=[Media(file_name=file) for file in post.files],
        )
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
    id: UUID4,
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
async def interact(
    id: UUID4,
    type: schemas.InteractType,
    body: schemas.InInteract = Body(...),
    user: User = Depends(auth),
):
    """Note: user can like/share/save their own post"""

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
