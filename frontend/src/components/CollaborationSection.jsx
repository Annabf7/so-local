import { useState, useEffect } from "react"
import { fetchCollaborations, fetchMusicians, fetchVenues, createCollaboration, updateCollaboration, deleteCollaboration } from "../api"

export default function CollaborationSection() {
  const [collaborations, setCollaborations] = useState([])
  const [musicians, setMusicians]           = useState([])
  const [venues, setVenues]                 = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [form, setForm]                     = useState({ musician_id: "", venue_id: "", price: "", date: "" })
  const [formError, setFormError]           = useState(null)
  const [editingId, setEditingId]           = useState(null)
  const [editForm, setEditForm]             = useState({})

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const [collabs, mus, ven] = await Promise.all([
        fetchCollaborations(), fetchMusicians(), fetchVenues(),
      ])
      setCollaborations(collabs)
      setMusicians(mus)
      setVenues(ven)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(c) {
    setEditingId(c.id)
    setEditForm({ musician_id: c.musician.id, venue_id: c.venue.id, price: c.price, date: c.date })
  }

  function cancelEdit() { setEditingId(null); setEditForm({}) }

  async function handleUpdate(id) {
    try {
      await updateCollaboration(id, {
        musician_id: Number(editForm.musician_id),
        venue_id:    Number(editForm.venue_id),
        price:       Number(editForm.price),
        date:        editForm.date,
      })
      setEditingId(null)
      await load()
    } catch (e) { setError(e.message) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    try {
      await createCollaboration({
        musician_id: Number(form.musician_id),
        venue_id:    Number(form.venue_id),
        price:       Number(form.price),
        date:        form.date,
      })
      setForm({ musician_id: "", venue_id: "", price: "", date: "" })
      await load()
    } catch (e) { setFormError(e.message) }
  }

  async function handleDelete(id) {
    try { await deleteCollaboration(id); await load() }
    catch (e) { setError(e.message) }
  }

  return (
    <>
      <section className="card">
        <h2>Afegir collaboration</h2>
        <form onSubmit={handleSubmit} className="form">
          <select value={form.musician_id} onChange={(e) => setForm({ ...form, musician_id: e.target.value })} required>
            <option value="">Selecciona músic</option>
            {musicians.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={form.venue_id} onChange={(e) => setForm({ ...form, venue_id: e.target.value })} required>
            <option value="">Selecciona venue</option>
            {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <input type="number" placeholder="Preu (€)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input type="date"   value={form.date}       onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <button type="submit">Crear</button>
        </form>
        {formError && <p className="error">{formError}</p>}
      </section>

      <section className="card">
        <h2>Collaborations <span className="count">{collaborations.length}</span></h2>

        {loading && <p>Carregant...</p>}
        {error   && <p className="error">{error}</p>}

        {!loading && !error && (
          collaborations.length === 0 ? <p className="empty">Cap collaboration trobada.</p> : (
            <div className="table-wrap"><table>
              <thead>
                <tr><th>Músic</th><th>Venue</th><th>Data</th><th>Preu</th><th></th></tr>
              </thead>
              <tbody>
                {collaborations.map((c) => (
                  <tr key={c.id}>
                    {editingId === c.id ? (
                      <>
                        <td>
                          <select className="inline-input" value={editForm.musician_id} onChange={(e) => setEditForm({ ...editForm, musician_id: e.target.value })}>
                            {musicians.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        </td>
                        <td>
                          <select className="inline-input" value={editForm.venue_id} onChange={(e) => setEditForm({ ...editForm, venue_id: e.target.value })}>
                            {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                          </select>
                        </td>
                        <td><input className="inline-input" type="date"   value={editForm.date}  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} /></td>
                        <td><input className="inline-input" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} /></td>
                        <td className="row-actions">
                          <button className="btn-save"   onClick={() => handleUpdate(c.id)}>Guardar</button>
                          <button className="btn-cancel" onClick={cancelEdit}>Cancel·lar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{c.musician.name}</td>
                        <td><span className="badge">{c.venue.name}</span></td>
                        <td>{c.date}</td>
                        <td>{c.price} €</td>
                        <td className="row-actions">
                          <button className="btn-edit"   onClick={() => startEdit(c)}>Editar</button>
                          <button className="btn-delete" onClick={() => handleDelete(c.id)}>Eliminar</button>
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
