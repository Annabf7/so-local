# SÓ-LOCAL — Backend Context

## Com arrencar el projecte

### Cada vegada que obres una sessió nova:

**Terminal 1 — Backend:**
```bash
cd C:\Users\annab\so-local
& C:\Users\annab\so-local\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd C:\Users\annab\so-local\frontend
npm run dev
```

**URLs:**
- Frontend → http://localhost:5173
- Backend API → http://localhost:8000
- Documentació API → http://localhost:8000/docs

**Credencials de la demo:**
- Usuari: `admin`
- Contrasenya: `solocal2025`

**Si vols repoblar la base de dades amb dades de prova:**
```bash
# Amb el venv activat, des de so-local/
python seed.py
```

---

## Stack tecnològic

- Python + FastAPI
- PostgreSQL (base de dades real)
- SQLAlchemy (ORM per persistència)
- Pydantic v2 (validació i serialització)
- python-jose (JWT per autenticació)
- python-dotenv (gestió de variables d'entorn)
- uvicorn (servidor ASGI)
- React 18 + Vite (frontend)

## Arquitectura del projecte

```
so-local/
├── main.py           # Punt d'entrada, registre de routers, creació de taules
├── database.py       # Configuració de SQLAlchemy: engine, SessionLocal, Base, get_db
├── db_models.py      # Models SQLAlchemy (representen taules a PostgreSQL)
├── models.py         # Schemas Pydantic (validació d'input i serialització de resposta)
├── auth_utils.py     # Funcions JWT: create_access_token, verify_token
├── seed.py           # Script per poblar la BD amb dades de prova
├── routers/
│   ├── auth.py       # POST /auth/login
│   ├── musicians.py  # CRUD músics
│   ├── venues.py     # CRUD venues
│   └── collaborations.py
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── AuthContext.jsx   # Context global d'autenticació
│       ├── api.js            # Totes les crides a l'API
│       └── components/
│           ├── DashboardSection.jsx
│           ├── MusicianSection.jsx
│           ├── VenueSection.jsx
│           ├── CollaborationSection.jsx
│           └── LoginForm.jsx
├── .env              # Variables d'entorn — no pujar a git
└── requirements.txt
```

## Separació de responsabilitats

| Fitxer | Responsabilitat |
|---|---|
| `db_models.py` | Defineix les taules de PostgreSQL (hereten de `Base`) |
| `models.py` | Valida dades HTTP (input) i serialitza respostes (output) |
| `database.py` | Gestiona la connexió i les sessions amb PostgreSQL |
| `auth_utils.py` | Genera i verifica tokens JWT |
| `routers/` | Lògica dels endpoints, un fitxer per recurs |

## Models de dades

### SQLAlchemy (db_models.py)

- `MusicianDB` → taula `musicians` (id, name, genre, price)
- `VenueDB` → taula `venues` (id, name, location)
- `CollaborationDB` → taula `collaborations` (id, musician_id, venue_id, price, date)
  - Foreign keys cap a `musicians.id` i `venues.id`
  - Relationships: `musician` i `venue` (càrrega automàtica via JOIN)

### Pydantic (models.py)

Models d'input (validació de peticions HTTP):
- `Musician`, `Venue`, `Collaboration`

Models de resposta (serialització de dades de la BD):
- `MusicianResponse`, `VenueResponse`, `CollaborationResponse`
- Tots amb `model_config = ConfigDict(from_attributes=True)`
- `CollaborationResponse` inclou objectes `MusicianResponse` i `VenueResponse` imbricats

## Endpoints disponibles

### Auth
| Mètode | Ruta | Protegit | Descripció |
|---|---|---|---|
| POST | `/auth/login` | No | Retorna token JWT |

### Musicians
| Mètode | Ruta | Protegit | Descripció |
|---|---|---|---|
| GET | `/musicians` | No | Llista tots els músics |
| POST | `/musicians` | Sí | Crea un músic |
| PUT | `/musicians/{id}` | Sí | Actualitza un músic |
| DELETE | `/musicians/{id}` | Sí | Elimina un músic |

### Venues
| Mètode | Ruta | Protegit | Descripció |
|---|---|---|---|
| GET | `/venues` | No | Llista totes les venues |
| POST | `/venues` | Sí | Crea una venue |
| PUT | `/venues/{id}` | Sí | Actualitza una venue |
| DELETE | `/venues/{id}` | Sí | Elimina una venue |

### Collaborations
| Mètode | Ruta | Protegit | Descripció |
|---|---|---|---|
| GET | `/collaborations` | No | Llista totes (amb músic i venue inclosos) |
| POST | `/collaborations` | Sí | Crea una collaboration |
| PUT | `/collaborations/{id}` | Sí | Actualitza una collaboration |
| DELETE | `/collaborations/{id}` | Sí | Elimina una collaboration |

## Autenticació JWT

- Els endpoints GET són públics
- Els endpoints POST, PUT i DELETE requereixen token JWT a l'header: `Authorization: Bearer <token>`
- El token s'obté fent `POST /auth/login` amb `{ username, password }`
- El token expira al cap de 60 minuts
- El frontend guarda el token a `localStorage` i l'afegeix automàticament a cada petició protegida

## Estat actual

- CRUD complet (GET, POST, PUT, DELETE) per als tres recursos
- Autenticació JWT implementada
- Persistència real a PostgreSQL
- Respostes enriquides: collaborations inclou objectes musician i venue complets
- Frontend React amb dashboard, filtres, ordenació, paginació i edició inline
- Disseny responsiu (mòbil, tauleta, escriptori)
- Repositori a GitHub: https://github.com/Annabf7/so-local

## Convencions

- Cada router gestiona el seu recurs de forma independent
- Els schemas Pydantic d'input no inclouen `id` (el genera la BD)
- Els schemas de resposta sempre usen `from_attributes=True`
- `_=Depends(verify_token)` protegeix els endpoints que modifiquen dades
- Codi simple i pedagògic, sense over-engineering

## Pròxims passos possibles

- Desplegament: Vercel (frontend) + Railway (backend + PostgreSQL)
- Alembic per gestionar migracions de BD
- Registre d'usuaris real (ara hi ha un sol usuari admin hardcoded)
- Paginació server-side als endpoints GET
