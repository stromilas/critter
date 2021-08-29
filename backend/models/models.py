from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class User(Base):
  __tablename__ = 'user'
  
  id = Column(Integer, primary_key=True)
  username = Column(Text)
  name = Column(Text)
  website = Column(Text, nullable=True)
  location = Column(Text, nullable=True)
  password = Column(Text)
  posts = relationship('Post', back_populates='user_id')
  interactions = relationship('Interaction', back_populates='user_id')
  followers = relationship('Follower', back_populates='followee_id')
  followees = relationship('Follower', back_populates='follower_id')

class Follower(Base):
  __tablename__ = 'follower'
  
  id = Column(Integer, primary_key=True)
  follower_id = Column(Integer, ForeignKey('user.id'))
  follower = relationship('User', back_populates='followers')
  followee_id = Column(Integer, ForeignKey('user.id'))
  followee = relationship('User', back_populates='followees')

class Interaction(Base):
  __tablename__ = 'interaction'

  id = Column(Integer, primary_key=True)
  user_id = Column(Integer, ForeignKey('user.id'))
  user = relationship('User', back_populates='interactions')
  post_id = Column(Integer, ForeignKey('post.id'))
  post = relationship('Post', back_populates='interactions')
  type_id = Column(Integer, ForeignKey('interaction_type.id'))
  type = relationship('InteractionType', back_populates='interactions')


class InteractionType(Base):
  __tablename__ = 'interaction_type'

  id = Column(Integer, primary_key=True)
  name = Column(String(50), unique=True)
  interactions = relationship('Interaction', back_populates='type_id')


class Post(Base):
  __tablename__ = 'post'

  id = Column(Integer, primary_key=True)
  reply_id = Column(Integer, ForeignKey('id'), nullable=True)
  replies = relationship('Post', back_populates='replies')
  text = Column(String(280))
  user_id = Column(Integer, ForeignKey('user.id'))
  user = relationship('User', back_populates='posts')
  interactions = relationship('Interaction', back_populates='post_id')
  media = relationship('Media', back_populates='post_id')
  hashtags = relationship('Hashtag', back_populates='post_id')

class Hashtag(Base):
  __tablename__ = 'hashtag'

  id = Column(Integer, primary_key=True)
  tag = Column(String(100))
  created_at = Column(DateTime, default=func.now())
  post_id = Column(Integer, ForeignKey('post.id'))
  post = relationship('Post', back_populates='hashtags')

class Media(Base):
  __tablename__ = 'media'

  id = Column(Integer, primary_key=True)
  post_id = Column(Integer, ForeignKey('post.id'))
  post = relationship('Post', back_populates='media')
  url = Column(Text)


