from operator import and_
from typing import Optional
import boto3
from botocore.config import Config
from critter.core import error, config
from critter.models import User, Post
from critter.database import session
from critter.common import auth, auth_optional
from critter import schemas
from critter.models.models import Follow, Interaction
from critter.schemas.base import CoreModel
from critter.schemas.users import PublicUser, UserIn
from critter.controllers import post as ctrl_post
from fastapi.param_functions import Body, Depends, Query
from sqlalchemy import select, delete
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.sql.expression import case, desc
from sqlalchemy.sql.functions import func
from enum import Enum

# Configuration
boto3.setup_default_session(
    aws_access_key_id=config.aws_access_key,
    aws_secret_access_key=config.aws_secret_key,
)

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


@router.put("/me", status_code=201)
async def update_self(
    me: User = Depends(auth),
    user: UserIn = Body(...),
):
    try:
        print(user.__dict__)
        for field in user.__fields__:
            value = getattr(user, field)
            if value is not None:
                setattr(me, field, value)
        session.commit()

    except Exception as e:
        session.rollback()
        error(e)


@router.get("/popular")
async def get_popular(me: User = Depends(auth_optional)):
    try:
        stmt = (
            select(
                User,
                func.count(User.followers).label("followers_num"),
                func.max(case([(Follow.follower_id == me.id, 1)], else_=0)).label(
                    "is_following"
                ),
                func.max(case([(Follow.followee_id == me.id, 1)], else_=0)).label(
                    "is_followed_by"
                ),
            )
            .join(User.followers, isouter=True)
            .group_by(User.id)
            .order_by(desc("followers_num"))
        )

        results = session.execute(stmt).mappings().all()

        # transform = lambda user, stat: user.__dict__ |  {"followers_num": stat, "is_following": }
        users = [
            PublicUser(
                **{
                    **item.User.__dict__,
                    "followers_num": item.followers_num,
                    "is_following": item.is_following,
                    "is_followed_by": item.is_followed_by,
                }
            )
            for item in results
        ]

        return {"users": users}

    except Exception as e:
        print(e)
        raise HTTPException(500)


class UserMedia(Enum):
    PROFILE = "profile"
    BANNER = "banner"


@router.get("/media-endpoint")
async def get_profile_endpoint(
    me: User = Depends(auth),
    media: UserMedia = Query(...),
    file: str = Query(...),
):
    s3 = boto3.client("s3", config=Config(signature_version="s3v4"))
    try:
        signed_url = s3.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": "critter-public",
                "Key": f"users/{media.value}/{me.username}/{file}",
            },
            ExpiresIn=10,
        )
        return signed_url

    except Exception as e:
        error(e)
        session.rollback()
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
            is_following=following,
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
    _user: Optional[User] = Depends(auth_optional),
    skip: Optional[int] = Query(0),
    limit: Optional[int] = Query(10),
    likes: Optional[bool] = Query(False),
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
        stmt = stmt.options(selectinload(Post.media))
        stmt = stmt.join(subquery, subquery.c.id == Post.id)
        if likes:
            stmt = stmt.join(Post.interactions)
            stmt = stmt.filter(
                and_(Interaction.user_id == user.id, Interaction.type == "like")
            )
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


class FollowModel(CoreModel):
    follow: bool


@router.post("/{username}/follow", status_code=201)
async def follow_user(
    username: str,
    _user: Optional[User] = Depends(auth),
    follow: bool = Body(FollowModel, embed=True),
):
    try:
        stmt = select(User).filter_by(username=username)
        user = session.execute(stmt).scalar_one()

        if follow:
            stmt = select(Follow).where(
                Follow.followee == user, Follow.follower == _user
            )
            res = session.execute(stmt).scalar()
            if res is not None:
                return {"detail": "Already following"}
            follow_instance = Follow(follower=_user, followee=user)
            session.add(follow_instance)
        else:
            stmt = delete(Follow).where(
                Follow.followee == user, Follow.follower == _user
            )
            session.execute(stmt)
        session.commit()

        return

    except NoResultFound:
        session.rollback()
        raise HTTPException(404)

    except HTTPException as exception:
        session.rollback()
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        session.rollback()
        raise HTTPException(500)
