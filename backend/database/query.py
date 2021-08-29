from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from models.models import User, Post

engine = create_engine('postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters')
session = Session(engine)