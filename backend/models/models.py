from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy import Enum
from sqlalchemy import Table
from sqlalchemy.orm import relationship
from sqlalchemy.orm import backref
from sqlalchemy.sql import func
from .base import Base

# Two-table adjacency list
follower = Table(
    "follower",
    Base.metadata,
    Column("left_id", Integer, ForeignKey("user.id"), primary_key=True),
    Column("right_id", Integer, ForeignKey("user.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(Text)
    name = Column(Text)
    website = Column(Text, nullable=True)
    location = Column(Text, nullable=True)
    password = Column(Text)
    posts = relationship("Post", backref="user")
    interactions = relationship("Interaction", backref="user")
    followers = relationship(
        "User",
        secondary=follower,
        primaryjoin=(id == follower.c.left_id),
        secondaryjoin=(id == follower.c.right_id),
        backref="followees",
    )


class Interaction(Base):
    __tablename__ = "interaction"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    post_id = Column(Integer, ForeignKey("post.id"))
    type = Column(Enum("like", "retweet", "mention", name="interaction_type"))


class Post(Base):
    __tablename__ = "post"

    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey("post.id"), nullable=True)
    replies = relationship("Post", backref=backref("parent", remote_side=[id]))
    text = Column(String(280))
    user_id = Column(Integer, ForeignKey("user.id"))
    interactions = relationship("Interaction", backref="post")
    media = relationship("Media")
    hashtags = relationship("Hashtag")


class Hashtag(Base):
    __tablename__ = "hashtag"

    id = Column(Integer, primary_key=True)
    tag = Column(String(100))
    created_at = Column(DateTime, default=func.now())
    post_id = Column(Integer, ForeignKey("post.id"))
    post = relationship("Post", back_populates="hashtags")


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("post.id"))
    post = relationship("Post", back_populates="media")
    url = Column(Text)
