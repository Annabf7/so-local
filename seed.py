"""
seed.py — Pobla la base de dades amb dades de prova realistes.

Execució:
    python seed.py

Cada vegada que s'executa, esborra les dades existents i les torna a crear.
Útil per tenir sempre un estat net i consistent per a demos.
"""

from datetime import date
from database import SessionLocal, engine, Base
import db_models  # noqa: F401 — necessari perquè SQLAlchemy registri els models
from db_models import MusicianDB, VenueDB, CollaborationDB

# Crea les taules si no existeixen
Base.metadata.create_all(bind=engine)


# ── Dades de prova ─────────────────────────────────────────────────────────────

MUSICIANS = [
    {"name": "Maria Arnal",       "genre": "Folk",        "price": 600},
    {"name": "Pau Vallvé",        "genre": "Indie Pop",   "price": 450},
    {"name": "Sílvia Pérez Cruz", "genre": "Jazz",        "price": 900},
    {"name": "Doctor Prats",      "genre": "Folk Rock",   "price": 700},
    {"name": "Oques Grasses",     "genre": "Pop",         "price": 1200},
    {"name": "Roger Mas",         "genre": "Folk",        "price": 500},
    {"name": "Clara Peya",        "genre": "Clàssica",    "price": 750},
    {"name": "Mazoni",            "genre": "Indie Pop",   "price": 400},
]

VENUES = [
    {"name": "Sala Apolo",          "location": "Barcelona"},
    {"name": "Jamboree Jazz Club",  "location": "Barcelona"},
    {"name": "L'Auditori",          "location": "Barcelona"},
    {"name": "Sala Upload",         "location": "Barcelona"},
    {"name": "La Mirona",           "location": "Salt, Girona"},
    {"name": "Teatre Principal",    "location": "Palma"},
]

COLLABORATIONS = [
    {"musician_id": 1, "venue_id": 2, "price": 550,  "date": date(2025, 6, 14)},
    {"musician_id": 2, "venue_id": 1, "price": 400,  "date": date(2025, 7,  5)},
    {"musician_id": 3, "venue_id": 2, "price": 850,  "date": date(2025, 7, 19)},
    {"musician_id": 4, "venue_id": 5, "price": 650,  "date": date(2025, 8,  2)},
    {"musician_id": 5, "venue_id": 1, "price": 1100, "date": date(2025, 8, 23)},
    {"musician_id": 6, "venue_id": 6, "price": 480,  "date": date(2025, 9, 12)},
    {"musician_id": 7, "venue_id": 3, "price": 700,  "date": date(2025, 9, 27)},
    {"musician_id": 8, "venue_id": 4, "price": 380,  "date": date(2025, 10, 11)},
]


# ── Lògica d'inserció ──────────────────────────────────────────────────────────

def seed():
    db = SessionLocal()
    try:
        # Esborrem les dades existents (en ordre invers per respectar les foreign keys)
        print("Esborrant dades existents...")
        db.query(CollaborationDB).delete()
        db.query(MusicianDB).delete()
        db.query(VenueDB).delete()
        db.commit()

        # Inserim músics
        print("Inserint músics...")
        for data in MUSICIANS:
            db.add(MusicianDB(**data))
        db.commit()

        # Inserim venues
        print("Inserint venues...")
        for data in VENUES:
            db.add(VenueDB(**data))
        db.commit()

        # Inserim collaborations
        print("Inserint collaborations...")
        for data in COLLABORATIONS:
            db.add(CollaborationDB(**data))
        db.commit()

        print(f"\nFet! S'han inserit:")
        print(f"  {len(MUSICIANS)} músics")
        print(f"  {len(VENUES)} venues")
        print(f"  {len(COLLABORATIONS)} collaborations")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
