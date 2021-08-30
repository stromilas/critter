from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from critter.models import User, Post, Interaction

engine = create_engine(
    "postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters"
)
session = Session(engine)

userA = User(
    username="aaa",
    name="AAA",
    password="$2b$12$Ej5ko/wKXQ9XYKP9R2D7gePSb96LY15aR9yhWc3jgUSh4d14kkV3.",
)
userB = User(
    username="bbb",
    name="BBB",
    password="$2b$12$Ej5ko/wKXQ9XYKP9R2D7gePSb96LY15aR9yhWc3jgUSh4d14kkV3.",
)
userC = User(
    username="ccc",
    name="CCC",
    password="$2b$12$Ej5ko/wKXQ9XYKP9R2D7gePSb96LY15aR9yhWc3jgUSh4d14kkV3.",
)

userA.followers.append(userB)
userA.followers.append(userC)
userA.posts.append(
    Post(text="My first post :)", interactions=[Interaction(user=userB, type="like")])
)

session.add_all([userA, userC, userB])
session.commit()
