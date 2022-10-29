FROM python:3.9.15
WORKDIR /app

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.2.0 python3 -
ENV PATH="/root/.local/bin:$PATH"
RUN poetry config virtualenvs.in-project true


# Install dependencies
COPY pyproject.toml /app
COPY poetry.lock /app
RUN poetry install

# Copy source code
COPY . /app

# Run application
CMD ["poetry", "run", "uvicorn", "main:app", "--port", "8000"]