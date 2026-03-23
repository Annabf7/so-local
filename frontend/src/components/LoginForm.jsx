import { useState } from "react"
import { loginUser } from "../api"
import { useAuth } from "../AuthContext"
import "./LoginForm.css"

export default function LoginForm() {
  const { login }   = useAuth()
  const [form, setForm]   = useState({ username: "", password: "" })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await loginUser(form.username, form.password)
      login(data.access_token)   // guarda el token i actualitza el context
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-header">
          <div className="login-rule" />
          <h1 className="login-title">SÓ-LOCAL</h1>
          <p className="login-sub">Àrea d'administració</p>
          <div className="login-rule" />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Usuari</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="login-field">
            <label>Contrasenya</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Verificant..." : "Entrar"}
          </button>
        </form>

        <p className="login-hint">usuari: admin · contrasenya: solocal2025</p>
      </div>
    </div>
  )
}
