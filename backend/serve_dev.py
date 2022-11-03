import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app", reload=True, env_file="./.env_dev", port=8000, log_level="debug"
    )
