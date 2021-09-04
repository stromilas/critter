from datetime import datetime
from typing import Optional
from critter.database import session
from critter.models.models import User
from critter.core.security import token_scheme
from fastapi.exceptions import HTTPException
from fastapi.param_functions import Depends
from jose import jwt
from sqlalchemy import select
from critter.core.security import jwt_context

def auth(token: str = Depends(token_scheme)) -> User:
    try:
        payload = jwt.decode(token, jwt_context.secret_key, algorithms=[jwt_context.algorithm])
        
        current_date = datetime.utcnow().timestamp()
        expires_date = payload['exp']
        
        if current_date > expires_date:
            raise HTTPException(401, detail='Expired token')

        stmt = select(User).filter_by(username=payload['username'])
        user = session.execute(stmt).scalar()

        if not user:
            raise HTTPException(401, detail='User not found')

        return user

    except HTTPException as e:
        raise HTTPException(**e.__dict__)

    except Exception as e:
        print(e)
        raise HTTPException(500)

def auth_optional(token: Optional[str] = Depends(token_scheme)) -> Optional[User]:
    try: 
        if token is None:
            return None

        payload = jwt.decode(token, jwt_context.secret_key, algorithms=[jwt_context.algorithm])

        current_date = datetime.utcnow().timestamp()
        expires_date = payload['exp']

        if current_date > expires_date:
            raise HTTPException(401, detail='Expired token')

        stmt = select(User).filter_by(username=payload['username'])
        user = session.execute(stmt).scalar()

        if user is None:
            return None

        return user

    except HTTPException as e:
        raise HTTPException(**e.__dict__)
        
    except Exception as e:
        print(e)
        raise HTTPException(500)