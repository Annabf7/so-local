import { useState, useEffect } from "react"
import { fetchMusicians, createMusician, updateMusician, deleteMusician } from "../api"

const ITEMS_PER_PAGE = 5

export default function MusicianSection() {
  const [musicians, setMusicians]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [genreFilter, setGenreFilter] = useState("")
  const [minPrice, setMinPrice]       = useState("")
  const [maxPrice, setMaxPrice]       = useState("")
  const [sortBy, setSortBy]           = useState("name-asc")
  const [page, setPage]               = useState(1)
  const [form, setForm]               = useState({ name: "", genre: "", price: "" })
  const [formError, setFormError]     = useState(null)
  // editingId indica quina fila està en mode edició (null = cap)
  const [editingId, setEditingId]     = useState(null)
  const [editForm, setEditForm]       = useState({})

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      setMusicians(await fetchMusicians())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const genres    = [...new Set(musicians.map((m) => m.genre))]
  const filtered  = musicians
    .filter((m) => (genreFilter ? m.genre === genreFilter : true))
    .filter((m) => (minPrice !== "" ? m.price >= Number(minPrice) : true))
    .filter((m) => (maxPrice !== "" ? m.price <= Number(maxPrice) : true))
  const sorted    = [...filtered].sort((a, b) => {
    if (sortBy === "name-asc")   return a.name.localeCompare(b.name)
    if (sortBy === "name-desc")  return b.name.localeCompare(a.name)
    if (sortBy === "price-asc")  return a.price - b.price
    if (sortBy === "price-desc") return b.price - a.price
    return 0
  })
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated  = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function onFilter(setter) {
    return (e) => { setter(e.target.value); setPage(1) }
  }

  // Obre el mode edició per a una fila: omple editForm amb els valors actuals
  function startEdit(m) {
    setEditingId(m.id)
    setEditForm({ name: m.name, genre: m.genre, price: m.price })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  async function handleUpdate(id) {
    try {
      await updateMusician(id, { ...editForm, price: Number(editForm.price) })
      setEditingId(null)
      await load()
    } catch (e) { setError(e.message) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    try {
      await createMusician({ ...form, price: Number(form.price) })
      setForm({ name: "", genre: "", price: "" })
      await load()
    } catch (e) { setFormError(e.message) }
  }

  async function handleDelete(id) {
    try { await deleteMusician(id); await load() }
    catch (e) { setError(e.message) }
  }

  return (
    <>
      <section className="card">
        <h2>Afegir músic</h2>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Nom"      value={form.name}  onChange={(e) => setForm({ ...form, name: e.target.value })}  required />
          <input placeholder="Gènere"   value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required />
          <input placeholder="Preu (€)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <button type="submit">Crear</button>
        </form>
        {formError && <p className="error">{formError}</p>}
      </section>

      <section className="card">
        <h2>Músics <span className="count">{filtered.length}</span></h2>
        <div className="filters">
          <select value={genreFilter} onChange={onFilter(setGenreFilter)}>
            <option value="">Tots els gèneres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <input type="number" placeholder="Preu mínim €" value={minPrice} onChange={onFilter(setMinPrice)} />
          <input type="number" placeholder="Preu màxim €" value={maxPrice} onChange={onFilter(setMaxPrice)} />
          <select value={sortBy} onChange={onFilter(setSortBy)}>
            <option value="name-asc">Nom A→Z</option>
            <option value="name-desc">Nom Z→A</option>
            <option value="price-asc">Preu menor</option>
            <option value="price-desc">Preu major</option>
          </select>
        </div>

        {loading && <p>Carregant...</p>}
        {error   && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            {paginated.length === 0 ? <p className="empty">Cap músic trobat.</p> : (
              <div className="table-wrap"><table>
                <thead><tr><th>Nom</th><th>Gènere</th><th>Preu</th><th></th></tr></thead>
                <tbody>
                  {paginated.map((m) => (
                    <tr key={m.id}>
                      {editingId === m.id ? (
                        // ── Fila en mode edició ──────────────────────────────
                        <>
                          <td><input className="inline-input" value={editForm.name}  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                          <td><input className="inline-input" value={editForm.genre} onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })} /></td>
                          <td><input className="inline-input" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} /></td>
                          <td className="row-actions">
                            <button className="btn-save"   onClick={() => handleUpdate(m.id)}>Guardar</button>
                            <button className="btn-cancel" onClick={cancelEdit}>Cancel·lar</button>
                          </td>
                        </>
                      ) : (
                        // ── Fila normal ──────────────────────────────────────
                        <>
                          <td>{m.name}</td>
                          <td><span className="badge">{m.genre}</span></td>
                          <td>{m.price} €</td>
                          <td className="row-actions">
                            <button className="btn-edit"   onClick={() => startEdit(m)}>Editar</button>
                            <button className="btn-delete" onClick={() => handleDelete(m.id)}>Eliminar</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table></div>
            )}
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>←</button>
                <span>{page} / {totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>→</button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
