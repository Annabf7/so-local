const API_URL = "http://localhost:8000"

// Helper: llegeix el token del localStorage i el posa a l'header Authorization
function authHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error("Usuari o contrasenya incorrectes")
  return res.json()
}

// ── Musicians ──────────────────────────────────────────────────────────────────
export async function fetchMusicians() {
  const res = await fetch(`${API_URL}/musicians/`)
  if (!res.ok) throw new Error("Error carregant músics")
  return res.json()
}

export async function createMusician(data) {
  const res = await fetch(`${API_URL}/musicians/`, {
    method: "POST",
    headers: authHeaders(),    // ← inclou el token
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error creant músic")
  return res.json()
}

export async function updateMusician(id, data) {
  const res = await fetch(`${API_URL}/musicians/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error actualitzant músic")
  return res.json()
}

export async function deleteMusician(id) {
  const res = await fetch(`${API_URL}/musicians/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Error eliminant músic")
  return res.json()
}

// ── Venues ─────────────────────────────────────────────────────────────────────
export async function fetchVenues() {
  const res = await fetch(`${API_URL}/venues/`)
  if (!res.ok) throw new Error("Error carregant venues")
  return res.json()
}

export async function createVenue(data) {
  const res = await fetch(`${API_URL}/venues/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error creant venue")
  return res.json()
}

export async function updateVenue(id, data) {
  const res = await fetch(`${API_URL}/venues/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error actualitzant venue")
  return res.json()
}

export async function deleteVenue(id) {
  const res = await fetch(`${API_URL}/venues/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Error eliminant venue")
  return res.json()
}

// ── Collaborations ─────────────────────────────────────────────────────────────
export async function fetchCollaborations() {
  const res = await fetch(`${API_URL}/collaborations/`)
  if (!res.ok) throw new Error("Error carregant collaborations")
  return res.json()
}

export async function createCollaboration(data) {
  const res = await fetch(`${API_URL}/collaborations/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error creant collaboration")
  return res.json()
}

export async function updateCollaboration(id, data) {
  const res = await fetch(`${API_URL}/collaborations/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error actualitzant collaboration")
  return res.json()
}

export async function deleteCollaboration(id) {
  const res = await fetch(`${API_URL}/collaborations/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Error eliminant collaboration")
  return res.json()
}
