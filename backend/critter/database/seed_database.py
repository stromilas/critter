from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from critter.models import User, Post, Interaction

engine = create_engine(
    "postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters"
)
session = Session(engine)

userA = User(
    username="aaa",
    name="Local Rat",
    password="$2b$12$SNx3lApAQlhhOBdqiYaTAObOUdL/pOtU9YdlWGWUPwxIaMm7jHPxa",
)
userB = User(
    username="bbb",
    name="Stray Dog",
    password="$2b$12$SNx3lApAQlhhOBdqiYaTAObOUdL/pOtU9YdlWGWUPwxIaMm7jHPxa",
)
userC = User(
    username="ccc",
    name="A tree",
    password="$2b$12$SNx3lApAQlhhOBdqiYaTAObOUdL/pOtU9YdlWGWUPwxIaMm7jHPxa",
)

userA.followers.append(userB)
userA.followers.append(userC)
userA.posts.append(
    Post(text="My first post :)", interactions=[
        Interaction(user=userB, type="like"),
        Interaction(user=userB, type="share"),
        Interaction(user=userB, type="like"),
        Interaction(user=userC, type="like"),
        Interaction(user=userC, type="share"),
        Interaction(user=userA, type="like"),
    ])
)
userC.posts.append(
    Post(text="Wooooo :o")
)


session.add_all([userA, userC, userB])
session.commit()
