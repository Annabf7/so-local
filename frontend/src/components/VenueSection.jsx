import { useState, useEffect } from "react"
import { fetchVenues, createVenue, updateVenue, deleteVenue } from "../api"

export default function VenueSection() {
  const [venues, setVenues]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [form, setForm]               = useState({ name: "", location: "" })
  const [formError, setFormError]     = useState(null)
  const [locationFilter, setLocationFilter] = useState("")
  const [editingId, setEditingId]     = useState(null)
  const [editForm, setEditForm]       = useState({})

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      setVenues(await fetchVenues())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const locations = [...new Set(venues.map((v) => v.location))]
  const filtered  = venues.filter((v) => (locationFilter ? v.location === locationFilter : true))

  function startEdit(v) {
    setEditingId(v.id)
    setEditForm({ name: v.name, location: v.location })
  }

  function cancelEdit() { setEditingId(null); setEditForm({}) }

  async function handleUpdate(id) {
    try {
      await updateVenue(id, editForm)
      setEditingId(null)
      await load()
    } catch (e) { setError(e.message) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    try {
      await createVenue(form)
      setForm({ name: "", location: "" })
      await load()
    } catch (e) { setFormError(e.message) }
  }

  async function handleDelete(id) {
    try { await deleteVenue(id); await load() }
    catch (e) { setError(e.message) }
  }

  return (
    <>
      <section className="card">
        <h2>Afegir venue</h2>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Nom del local"  value={form.name}     onChange={(e) => setForm({ ...form, name: e.target.value })}     required />
          <input placeholder="Localització"   value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <button type="submit">Crear</button>
        </form>
        {formError && <p className="error">{formError}</p>}
      </section>

      <section className="card">
        <h2>Venues <span className="count">{filtered.length}</span></h2>
        <div className="filters">
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="">Totes les localitzacions</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {loading && <p>Carregant...</p>}
        {error   && <p className="error">{error}</p>}

        {!loading && !error && (
          filtered.length === 0 ? <p className="empty">Cap venue trobat.</p> : (
            <div className="table-wrap"><table>
              <thead><tr><th>Nom</th><th>Localització</th><th></th></tr></thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    {editingId === v.id ? (
                      <>
                        <td><input className="inline-input" value={editForm.name}     onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                        <td><input className="inline-input" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} /></td>
                        <td className="row-actions">
                          <button className="btn-save"   onClick={() => handleUpdate(v.id)}>Guardar</button>
                          <button className="btn-cancel" onClick={cancelEdit}>Cancel·lar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{v.name}</td>
                        <td><span className="badge">{v.location}</span></td>
                        <td className="row-actions">
                          <button className="btn-edit"   onClick={() => startEdit(v)}>Editar</button>
                          <button className="btn-delete" onClick={() => handleDelete(v.id)}>Eliminar</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table></div>
          )
        )}
      </section>
    </>
  )
}
