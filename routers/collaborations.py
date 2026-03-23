from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from db_models import CollaborationDB, MusicianDB, VenueDB
from models import Collaboration, CollaborationResponse
from auth_utils import verify_token

router = APIRouter(prefix="/collaborations", tags=["Collaborations"])


@router.get("/", response_model=list[CollaborationResponse])
def list_collaborations(db: Session = Depends(get_db)):
    return db.query(CollaborationDB).all()


@router.post("/", response_model=CollaborationResponse)
def create_collaboration(collaboration: Collaboration, db: Session = Depends(get_db), _=Depends(verify_token)):
    musician = db.get(MusicianDB, collaboration.musician_id)
    if musician is None:
        raise HTTPException(status_code=404, detail=f"Músic amb id {collaboration.musician_id} no trobat")

    venue = db.get(VenueDB, collaboration.venue_id)
    if venue is None:
        raise HTTPException(status_code=404, detail=f"Venue amb id {collaboration.venue_id} no trobat")

    db_collaboration = CollaborationDB(
        musician_id=collaboration.musician_id,
        venue_id=collaboration.venue_id,
        price=collaboration.price,
        date=collaboration.date,
    )
    db.add(db_collaboration)
    db.commit()
    db.refresh(db_collaboration)
    return db_collaboration


@router.put("/{collaboration_id}", response_model=CollaborationResponse)
def update_collaboration(collaboration_id: int, data: Collaboration, db: Session = Depends(get_db), _=Depends(verify_token)):
    collaboration = db.get(CollaborationDB, collaboration_id)
    if collaboration is None:
        raise HTTPException(status_code=404, detail=f"Collaboration amb id {collaboration_id} no trobada")

    musician = db.get(MusicianDB, data.musician_id)
    if musician is None:
        raise HTTPException(status_code=404, detail=f"Músic amb id {data.musician_id} no trobat")

    venue = db.get(VenueDB, data.venue_id)
    if venue is None:
        raise HTTPException(status_code=404, detail=f"Venue amb id {data.venue_id} no trobat")

    collaboration.musician_id = data.musician_id
    collaboration.venue_id    = data.venue_id
    collaboration.price       = data.price
    collaboration.date        = data.date
    db.commit()
    db.refresh(collaboration)
    return collaboration


@router.delete("/{collaboration_id}")
def delete_collaboration(collaboration_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    collaboration = db.get(CollaborationDB, collaboration_id)
    if collaboration is None:
        raise HTTPException(status_code=404, detail=f"Collaboration amb id {collaboration_id} no trobada")
    db.delete(collaboration)
    db.commit()
    return {"message": f"Collaboration amb id {collaboration_id} eliminada correctament"}
