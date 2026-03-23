import { useState, useEffect } from "react"
import { fetchMusicians, fetchVenues, fetchCollaborations } from "../api"
import "./DashboardSection.css"

export default function DashboardSection() {
  const [stats, setStats]           = useState(null)
  const [upcoming, setUpcoming]     = useState([])
  const [genres, setGenres]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const [musicians, venues, collaborations] = await Promise.all([
        fetchMusicians(),
        fetchVenues(),
        fetchCollaborations(),
      ])

      const avgPrice = musicians.length
        ? Math.round(musicians.reduce((sum, m) => sum + m.price, 0) / musicians.length)
        : 0

      setStats({
        musicians:     musicians.length,
        venues:        venues.length,
        collaborations: collaborations.length,
        avgPrice,
      })

      const sorted = [...collaborations].sort((a, b) => new Date(a.date) - new Date(b.date))
      setUpcoming(sorted.slice(0, 5))

      const counts = {}
      musicians.forEach((m) => { counts[m.genre] = (counts[m.genre] || 0) + 1 })
      const breakdown = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([genre, count]) => ({ genre, count, pct: Math.round((count / musicians.length) * 100) }))
      setGenres(breakdown)

    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="dash-loading">Carregant...</p>
  if (error)   return <p className="error" style={{ padding: "1rem" }}>{error}</p>

  return (
    <div className="dash">

      {/* KPIs */}
      <div className="dash-kpis">
        <KPI value={stats.musicians}      label="Músics registrats" />
        <div className="kpi-divider" />
        <KPI value={stats.venues}         label="Venues actives" />
        <div className="kpi-divider" />
        <KPI value={stats.collaborations} label="Collaborations" />
        <div className="kpi-divider" />
        <KPI value={`${stats.avgPrice} €`} label="Preu mitjà" accent />
      </div>

      {/* Contingut */}
      <div className="dash-grid">

        {/* Properes actuacions */}
        <section className="dash-card">
          <h2 className="dash-section-title">Properes actuacions</h2>
          {upcoming.length === 0 ? (
            <p className="empty">Cap actuació programada.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Músic</th>
                    <th>Venue</th>
                    <th>Data</th>
                    <th>Preu</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((c) => (
                    <tr key={c.id}>
                      <td className="td-name">{c.musician.name}</td>
                      <td><span className="badge">{c.venue.name}</span></td>
                      <td className="td-date">{c.date}</td>
                      <td className="td-price">{c.price} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Gèneres */}
        <section className="dash-card">
          <h2 className="dash-section-title">Gèneres musicals</h2>
          <div className="genre-list">
            {genres.map(({ genre, count, pct }) => (
              <div key={genre} className="genre-row">
                <span className="genre-name">{genre}</span>
                <div className="genre-track">
                  <div className="genre-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="genre-pct">{count}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

function KPI({ value, label, accent }) {
  return (
    <div className={`kpi ${accent ? "kpi--accent" : ""}`}>
      <span className="kpi-value">{value}</span>
      <span className="kpi-label">{label}</span>
    </div>
  )
}
