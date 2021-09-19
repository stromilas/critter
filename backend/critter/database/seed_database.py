from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from critter.models import User, Post, Interaction, Follow

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

replyC = Post(text="OK :)")
userC.posts.append(replyC)

replyB = Post(text="Wooooo :o", replies=[replyC])
userB.posts.append(replyB)


userA.followers.append(Follow(follower=userB))
userA.followers.append(Follow(follower=userC))
userA.followees.append(Follow(followee=userC))

userA.posts.append(
    Post(text="My first post :)", replies=[replyB], interactions=[
        Interaction(user=userB, type="like"),
        Interaction(user=userB, type="share"),
        Interaction(user=userB, type="like"),
        Interaction(user=userC, type="like"),
        Interaction(user=userC, type="share"),
        Interaction(user=userA, type="like"),
    ])
)



session.add_all([userA, userC, userB])
session.commit()
