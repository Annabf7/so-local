from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from db_models import MusicianDB
from models import Musician, MusicianResponse
from auth_utils import verify_token

router = APIRouter(prefix="/musicians", tags=["Musicians"])


@router.get("/", response_model=list[MusicianResponse])
def list_musicians(db: Session = Depends(get_db)):
    return db.query(MusicianDB).all()


@router.post("/", response_model=MusicianResponse)
def create_musician(musician: Musician, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_musician = MusicianDB(
        name=musician.name,
        genre=musician.genre,
        price=musician.price,
    )
    db.add(db_musician)
    db.commit()
    db.refresh(db_musician)
    return db_musician


@router.put("/{musician_id}", response_model=MusicianResponse)
def update_musician(musician_id: int, data: Musician, db: Session = Depends(get_db), _=Depends(verify_token)):
    """
    Actualitza un músic existent.
    Busquem el registre, modifiquem els camps i fem commit.
    Equivalent a un UPDATE ... SET ... WHERE id = ?
    """
    musician = db.get(MusicianDB, musician_id)
    if musician is None:
        raise HTTPException(status_code=404, detail=f"Músic amb id {musician_id} no trobat")
    musician.name  = data.name
    musician.genre = data.genre
    musician.price = data.price
    db.commit()
    db.refresh(musician)
    return musician


@router.delete("/{musician_id}")
def delete_musician(musician_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    # db.get() busca per primary key
    musician = db.get(MusicianDB, musician_id)
    if musician is None:
        raise HTTPException(status_code=404, detail=f"Músic amb id {musician_id} no trobat")
    db.delete(musician)
    db.commit()
    return {"message": f"Músic '{musician.name}' eliminat correctament"}
