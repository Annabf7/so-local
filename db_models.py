from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class MusicianDB(Base):
    __tablename__ = "musicians"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    price = Column(Float, nullable=False)


class VenueDB(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)


class CollaborationDB(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    # ForeignKey("musicians.id") vol dir:
    # "aquest valor ha d'existir a la columna id de la taula musicians"
    musician_id = Column(Integer, ForeignKey("musicians.id"), nullable=False)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)
    price = Column(Float, nullable=False)
    date = Column(Date, nullable=False)

    # relationship() indica a SQLAlchemy que carregui l'objecte relacionat
    # automàticament quan consultem una collaboration.
    # Equivalent a fer un JOIN a SQL.
    musician = relationship("MusicianDB")
    venue = relationship("VenueDB")
