from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from critter.models import User, Post, Interaction, Follow, Media
from sqlalchemy.sql.expression import select

engine = create_engine(
    "postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters"
)
session = Session(engine)


stmt = select(Media)
results = session.execute(stmt).scalars().all()
for result in results:
    print(result.__dict__)