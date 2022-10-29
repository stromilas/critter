from os import environ
from dotenv import load_dotenv

load_dotenv()


class ApplicationConfiguration:
    def __init__(self, algorithm: str, secret_key: str, aws_secret_key: str):
        self._algorithm = algorithm
        self._secret_key = secret_key
        self._aws_secret_key = aws_secret_key

    @property
    def secret_key(self) -> str:
        return self._secret_key

    @property
    def algorithm(self) -> str:
        return self._algorithm

    @property
    def aws_secret_key(self) -> str:
        return self._aws_secret_key


config = ApplicationConfiguration(
    secret_key=environ.get("SECRET_KEY"),
    algorithm=environ.get("ALGORITHM"),
    aws_secret_key=environ.get("AWS_SECRET_KEY"),
)
