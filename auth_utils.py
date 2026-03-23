from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = "HS256"
TOKEN_EXPIRE_MINUTES = 60

# OAuth2PasswordBearer llegeix el token de l'header: Authorization: Bearer <token>
# tokenUrl és només per a la documentació de Swagger
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(username: str) -> str:
    """
    Genera un token JWT amb el nom d'usuari i una data d'expiració.
    jwt.encode() firma el token amb SECRET_KEY → ningú pot modificar-lo sense invalidar-lo.
    """
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependency de FastAPI: s'executa automàticament abans dels endpoints protegits.
    Llegeix el token de l'header, el verifica i retorna el nom d'usuari.
    Si el token és invàlid o ha expirat, llença un 401.
    """
    try:
        payload  = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token invàlid")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invàlid o expirat")
