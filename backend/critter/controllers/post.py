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

def get_posts(
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
                                (Interaction.user_id == user_id) if user_id else False,
                            ),
                            1,
                        ),
                    ],
                    else_=0,
                ),
            ).label("liked"),
            func.max(
                case(
                    [
                        (
                            and_(
                                Interaction.type == "share",
                                (Interaction.user_id == user_id) if user_id else False,
                            ),
                            1,
                        ),
                    ],
                    else_=0,
                ),
            ).label("shared"),
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
