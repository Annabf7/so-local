# SÓ-LOCAL

Plataforma per connectar músics locals i espais de Catalunya.

Permet gestionar perfils de músics, venues i les seves col·laboracions, amb un dashboard de estadístiques en temps real.

---

## Captures de pantalla

> Dashboard principal amb KPIs i properes actuacions

![Dashboard](docs/screenshot-dashboard.png)

> Gestió de músics amb filtres, ordenació i paginació

![Músics](docs/screenshot-musicians.png)

---

## Stack tecnològic

| Capa | Tecnologia |
|---|---|
| Backend | Python · FastAPI |
| Base de dades | PostgreSQL · SQLAlchemy |
| Frontend | React 18 · Vite |
| Estils | CSS (sense llibreries UI) |

---

## Estructura del projecte

```
so-local/
├── main.py              # Punt d'entrada FastAPI
├── database.py          # Connexió SQLAlchemy i sessions
├── db_models.py         # Models SQLAlchemy (taules PostgreSQL)
├── models.py            # Schemas Pydantic (validació i resposta)
├── seed.py              # Script per poblar la BD amb dades de prova
├── requirements.txt
├── routers/
│   ├── musicians.py     # CRUD músics
│   ├── venues.py        # CRUD venues
│   └── collaborations.py # CRUD col·laboracions
└── frontend/
    └── src/
        ├── App.jsx      # Navegació per tabs
        ├── api.js       # Crides a l'API
        └── components/
            ├── DashboardSection.jsx
            ├── MusicianSection.jsx
            ├── VenueSection.jsx
            └── CollaborationSection.jsx
```

---

## API — Endpoints

### Musicians
| Mètode | Ruta | Descripció |
|---|---|---|
| GET | `/musicians/` | Llista tots els músics |
| POST | `/musicians/` | Crea un músic |
| DELETE | `/musicians/{id}` | Elimina un músic |

### Venues
| Mètode | Ruta | Descripció |
|---|---|---|
| GET | `/venues/` | Llista totes les venues |
| POST | `/venues/` | Crea una venue |
| DELETE | `/venues/{id}` | Elimina una venue |

### Collaborations
| Mètode | Ruta | Descripció |
|---|---|---|
| GET | `/collaborations/` | Llista totes les col·laboracions (amb músic i venue inclosos) |
| POST | `/collaborations/` | Crea una col·laboració |
| DELETE | `/collaborations/{id}` | Elimina una col·laboració |

Documentació interactiva disponible a: `http://localhost:8000/docs`

---

## Instal·lació i posada en marxa

### Requisits previs
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+

### 1. Clonar el repositori

```bash
git clone https://github.com/el-teu-usuari/so-local.git
cd so-local
```

### 2. Configurar el backend

```bash
# Crear i activar l'entorn virtual
python -m venv venv
source venv/bin/activate        # Linux / Mac
venv\Scripts\Activate.ps1      # Windows PowerShell

# Instal·lar dependències
pip install -r requirements.txt
```

### 3. Configurar la base de dades

Crea una base de dades PostgreSQL anomenada `solocal` i copia el fitxer d'exemple:

```bash
cp .env.example .env
```

Edita `.env` amb les teves credencials:

```
DATABASE_URL=postgresql://postgres:la_teva_contrasenya@localhost:5432/solocal
```

### 4. Poblar la base de dades amb dades de prova

```bash
python seed.py
```

### 5. Arrencar el backend

```bash
uvicorn main:app --reload
```

El backend estarà disponible a `http://localhost:8000`

### 6. Arrencar el frontend

En una terminal nova:

```bash
cd frontend
npm install
npm run dev
```

El frontend estarà disponible a `http://localhost:5173`

---

## Models de dades

```
Musician          Venue             Collaboration
─────────         ──────            ─────────────
id                id                id
name              name              musician_id → Musician
genre             location          venue_id    → Venue
price                               price
                                    date
```

---

## Desenvolupament

Aquest projecte ha estat construït com a exercici pràctic per aprendre:

- Arquitectura REST amb FastAPI
- ORM amb SQLAlchemy i PostgreSQL
- Separació entre schemas Pydantic i models SQLAlchemy
- Consum d'API REST des de React
- Disseny de components reutilitzables sense llibreries UI externes
