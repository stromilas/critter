from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models.models import User

engine = create_engine('postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters')
session = Session(engine)

session.add_all([
  User(username='poop13', user='Poop')
])