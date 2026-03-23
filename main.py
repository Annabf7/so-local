from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import musicians, venues, collaborations, auth
from database import engine, Base
import db_models  # noqa: F401 — necessari perquè SQLAlchemy registri els models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SÓ-LOCAL API",
    description="Plataforma para conectar músicos y espacios en Cataluña",
    version="0.1.0",
)

# Permet peticions des del frontend React (localhost:5173 és el port per defecte de Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(musicians.router)
app.include_router(venues.router)
app.include_router(collaborations.router)


@app.get("/")
def root():
    return {"message": "Benvinguts a SÓ-LOCAL 🎵"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
