from critter.models import User
from critter.database import session
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from fastapi import APIRouter, Depends, HTTPException

# Configuration
router = APIRouter(
    prefix="/chirps", tags=["chirps"], responses={404: {"detail": "Not found"}}
)


@router.get("")
async def get_chirps(user: User = Depends(authenticated)):
    try:
        print(user.username)
        print(user.name)
        return {"chirps": ":) :)"}

    except NoResultFound:
        raise HTTPException(404)

    except HTTPException as exception:
        raise HTTPException(**exception.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)