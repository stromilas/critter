from sqlalchemy import create_engine
from models.models import Base

engine = create_engine('postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters')
Base.metadata.create_all(engine)

