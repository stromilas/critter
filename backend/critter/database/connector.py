import os, boto3, json
from typing import Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import session, sessionmaker
from sqlalchemy.orm.session import Session
from sqlalchemy.connectors import Connector as _Connector


class Connector:
    def __init__(
        self,
        username: str,
        password: str,
        host: str,
        port: int,
        database: str,
        echo: bool = False,
    ) -> None:
        URI = f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{database}"
        engine = create_engine(URI, echo=echo)
        self.engine = engine
        self._Session = sessionmaker(bind=engine, future=True)

    def session(self) -> session.Session:
        session = self._Session()
        return session

    def connect(self) -> _Connector:
        connection = self.engine.connect()
        return connection


def get_session(
    secret_env: Optional[str] = None,
    secret_arn: Optional[str] = None,
) -> Session:
    """Either environment variable name containing the secret ARN or the secret ARN should be provided
    param: secret_env - Name of environment variable containing secret ARN
    param: secret_arn - Secret ARN

    returns: Session object
    """

    if not secret_arn and not secret_env:
        raise Exception("Provided no parameters where at least one is required")

    if secret_arn:
        secret = secret_arn
    else:
        secret = os.environ.get(secret_env)

    # Load credentials
    secrets_manager = boto3.client("secretsmanager")
    secret = secrets_manager.get_secret_value(SecretId=secret)
    credentials = json.loads(secret["SecretString"])

    # Setup database connection
    connector = Connector(
        username=credentials["username"],
        password=credentials["password"],
        host=credentials["host"],
        port=credentials["port"],
        database=credentials["dbname"],
    )

    return connector.session()
