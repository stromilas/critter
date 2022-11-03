from os import environ
from pydantic import BaseModel


class ApplicationConfiguration(BaseModel):
    environment: str
    auth_algorithm: str
    auth_secret_key: str
    auth_access_token_expires: int
    aws_access_key: str
    aws_secret_key: str
    aws_region: str
    database_user: str
    database_password: str
    database_name: str
    database_host: str
    database_port: str


config = ApplicationConfiguration(
    environment=environ.get("ENVIRONMENT"),
    auth_secret_key=environ.get("AUTH_SECRET_KEY"),
    auth_algorithm=environ.get("AUTH_ALGORITHM"),
    auth_access_token_expires=environ.get("AUTH_ACCESS_TOKEN_EXPIRES"),
    aws_access_key=environ.get("AWS_ACCESS_KEY"),
    aws_secret_key=environ.get("AWS_SECRET_KEY"),
    aws_region=environ.get("AWS_REGION"),
    database_user=environ.get("DB_USER"),
    database_password=environ.get("DB_PASSWORD"),
    database_name=environ.get("DB_NAME"),
    database_host=environ.get("DB_HOST"),
    database_port=environ.get("DB_PORT"),
)
