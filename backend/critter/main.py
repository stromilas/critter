from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from critter.routers import auth

app = FastAPI()

# Add Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods="*",
    allow_headers="*",
)

# Add Routers
app.include_router(auth.router)
