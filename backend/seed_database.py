from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models.models import User, Post, Interaction

engine = create_engine('postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters')
session = Session(engine)

userA = User(username='aaa', name='AAA', password='test')
userB = User(username='bbb', name='BBB', password="test")
userC = User(username='ccc', name='CCC', password="test")

userA.followers.append(userB)
userA.followers.append(userC)
userA.posts.append(Post(text='My first post :)', interactions=[Interaction(user=userB, type='like')]))

session.add_all([userA, userC, userB])
session.commit()