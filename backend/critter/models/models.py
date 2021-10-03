
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy import Enum
from sqlalchemy.orm import relationship
from sqlalchemy.orm import backref
from sqlalchemy.sql import func
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.sql.sqltypes import VARCHAR
from .base import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(Text, unique=True)
    name = Column(Text)
    profile = Column(Text, default="defaults/profile.jpg")
    banner = Column(Text, default="defaults/banner.jpg")
    website = Column(Text, nullable=True)
    location = Column(Text, nullable=True)
    password = Column(Text)
    posts = relationship("Post", lazy="noload", back_populates="user")
    interactions = relationship("Interaction", lazy="noload", back_populates="user")


    # Temp. experimental usage
    following = association_proxy('followees', 'followee')
    followed_by = association_proxy('followers', 'follower')

# Association object
class Follow(Base):
    __tablename__ = "follow"
    follower_id = Column(ForeignKey("user.id"), primary_key=True)
    followee_id = Column(ForeignKey("user.id"), primary_key=True)
    created_at = Column(DateTime, default=func.now())

    follower = relationship(
        User,
        primaryjoin=(follower_id == User.id),
        backref=backref("followees", lazy="noload"),
        lazy="noload",
    )
    followee = relationship(
        User,
        primaryjoin=(followee_id == User.id),
        backref=backref("followers", lazy="noload"),
        lazy="noload",
    )


class Interaction(Base):
    __tablename__ = "interaction"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=func.now())
    user_id = Column(ForeignKey("user.id"))
    user = relationship("User", back_populates="interactions", lazy="noload")
    post_id = Column(ForeignKey("post.id"))
    post = relationship("Post", back_populates="interactions", lazy="noload")
    type = Column(Enum("like", "share", "mention", name="interaction_type"))


class Post(Base):
    __tablename__ = "post"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    parent_id = Column(ForeignKey("post.id"), nullable=True)
    user_id = Column(ForeignKey("user.id"))
    user = relationship("User", back_populates="posts", lazy="joined")
    replies = relationship(
        "Post", backref=backref("parent", remote_side=[id], lazy="noload")
    )
    text = Column(String(280))
    created_at = Column(DateTime, default=func.now())
    interactions = relationship("Interaction", back_populates="post")
    media = relationship("Media")
    hashtags = relationship("Hashtag")


class Hashtag(Base):
    __tablename__ = "hashtag"

    id = Column(Integer, primary_key=True)
    tag = Column(String(100))
    created_at = Column(DateTime, default=func.now())
    post_id = Column(ForeignKey("post.id"))
    post = relationship("Post", back_populates="hashtags")


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True)
    post_id = Column(ForeignKey("post.id"))
    post = relationship("Post", back_populates="media")
    file_name = Column(VARCHAR(150))
