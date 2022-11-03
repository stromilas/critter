import os
import json
import uvicorn

if __name__ == "__main__":
    data = os.getenv("CREDENTIALS")
    if not data:
        raise ValueError('No "CREDENTIALS" environment variable found')
    creds = json.loads(data)

    with open(".env", "w") as file:
        for key, val in creds.items():
            file.write(f"{key}={str(val)}\n")

    uvicorn.run(
        "main:app", env_file=".env", host="0.0.0.0", port=8000, log_level="info"
    )
