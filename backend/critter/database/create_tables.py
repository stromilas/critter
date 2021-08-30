from sqlalchemy import create_engine
from critter.models import Base

engine = create_engine('postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters')
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

