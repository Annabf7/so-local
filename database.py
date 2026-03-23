from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Carrega les variables del fitxer .env
# Equivalent a llegir process.env en Node.js
load_dotenv()

# Llegim la URL de connexió des del .env
DATABASE_URL = os.getenv("DATABASE_URL")

# create_engine és el "connector" amb la base de dades.
# Gestiona el pool de connexions automàticament.
engine = create_engine(DATABASE_URL)

# SessionLocal és la "fàbrica" de sessions.
# Cada petició HTTP obrirà una sessió i la tancarà al acabar.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base és la classe pare de tots els models SQLAlchemy.
# Quan un model en hereti, SQLAlchemy sabrà que ha de mapejar-lo a una taula.
Base = declarative_base()


def get_db():
    """
    Dependency de FastAPI: obre una sessió de BD per a cada petició
    i la tanca automàticament quan la petició acaba.
    Equivalent al patró try/finally en gestió de recursos.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
