from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth_utils import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# Usuari admin per a la demo.
# En producció, estaria a la base de dades amb la contrasenya encriptada amb bcrypt.
ADMIN = {"username": "admin", "password": "solocal2025"}


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(credentials: LoginRequest):
    """
    Verifica les credencials i retorna un token JWT.
    El frontend guardarà aquest token i l'enviarà a cada petició protegida.
    """
    if credentials.username != ADMIN["username"] or credentials.password != ADMIN["password"]:
        raise HTTPException(status_code=401, detail="Usuari o contrasenya incorrectes")

    token = create_access_token(credentials.username)
    return {"access_token": token, "token_type": "bearer"}
