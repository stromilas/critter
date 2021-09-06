from datetime import datetime
from logging import error
from typing import Optional
from critter.database import session
from critter.models.models import User
from critter.core.security import token_scheme
from fastapi.exceptions import HTTPException
from fastapi.param_functions import Depends
from jose import jwt, JWTError
from sqlalchemy import select
from critter.core.security import jwt_context


def authenticate(required: bool = True) -> User:
    def _auth(token: str = Depends(token_scheme)):
        try:
            if token is None:
                if required:
                    raise HTTPException(401, detail="No token found")
                else:
                    return None

            payload = jwt.decode(
                token, jwt_context.secret_key, algorithms=[jwt_context.algorithm]
            )

            current_date = datetime.utcnow().timestamp()
            expires_date = payload["exp"]

            if current_date > expires_date:
                raise HTTPException(401, detail="Expired token")

            stmt = select(User).filter_by(username=payload["username"])
            user = session.execute(stmt).scalar()

            if user is None:
                if required:
                    raise HTTPException(401, detail="User not found")
                else:
                    return None

            return user

        except HTTPException as e:
            raise HTTPException(**e.__dict__)

        except JWTError as e:
            error(e)
            raise HTTPException(401, detail='Malformed authentication token')

        except Exception as e:
            error(e)
            raise HTTPException(500)

    return _auth
