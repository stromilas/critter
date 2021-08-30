from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Create engine
engine = create_engine('postgresql+psycopg2://postgres:rootcritter@localhost:5432/critters')

# Configure session 
Session = sessionmaker(bind=engine)

# Instantiate session
session = Session()