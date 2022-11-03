from .connector import Connector
from critter.core import config

connector = Connector(
    username=config.database_user,
    password=config.database_password,
    database=config.database_name,
    host=config.database_host,
    port=config.database_port,
)

session = connector.session()
