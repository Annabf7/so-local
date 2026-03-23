from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


# ── Models d'INPUT (validació de dades que arriben per HTTP) ──────────────────

class Musician(BaseModel):
    id: Optional[int] = None
    name: str
    genre: str
    price: float


class Venue(BaseModel):
    id: Optional[int] = None
    name: str
    location: str


class Collaboration(BaseModel):
    id: Optional[int] = None
    musician_id: int
    venue_id: int
    price: float
    date: date


# ── Models de RESPOSTA (serialització de dades que surten de la BD) ───────────
#
# from_attributes=True permet que Pydantic llegeixi dades
# d'objectes SQLAlchemy (no només de diccionaris).
# Equivalent a activar "orm_mode" en versions anteriors de Pydantic.

class MusicianResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    genre: str
    price: float


class VenueResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    location: str


class CollaborationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    price: float
    date: date
    # En lloc de retornar només els ids, retornem els objectes complets
    musician: MusicianResponse
    venue: VenueResponse
