from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from db_models import VenueDB
from models import Venue, VenueResponse
from auth_utils import verify_token

router = APIRouter(prefix="/venues", tags=["Venues"])


@router.get("/", response_model=list[VenueResponse])
def list_venues(db: Session = Depends(get_db)):
    return db.query(VenueDB).all()


@router.post("/", response_model=VenueResponse)
def create_venue(venue: Venue, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_venue = VenueDB(
        name=venue.name,
        location=venue.location,
    )
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue


@router.put("/{venue_id}", response_model=VenueResponse)
def update_venue(venue_id: int, data: Venue, db: Session = Depends(get_db), _=Depends(verify_token)):
    venue = db.get(VenueDB, venue_id)
    if venue is None:
        raise HTTPException(status_code=404, detail=f"Venue amb id {venue_id} no trobat")
    venue.name     = data.name
    venue.location = data.location
    db.commit()
    db.refresh(venue)
    return venue


@router.delete("/{venue_id}")
def delete_venue(venue_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    venue = db.get(VenueDB, venue_id)
    if venue is None:
        raise HTTPException(status_code=404, detail=f"Venue amb id {venue_id} no trobat")
    db.delete(venue)
    db.commit()
    return {"message": f"Venue '{venue.name}' eliminat correctament"}
