import { useState } from "react"
import { useAuth } from "./AuthContext"
import LoginForm           from "./components/LoginForm"
import DashboardSection    from "./components/DashboardSection"
import MusicianSection     from "./components/MusicianSection"
import VenueSection        from "./components/VenueSection"
import CollaborationSection from "./components/CollaborationSection"
import "./App.css"

const TABS = [
  { id: "dashboard",      label: "Inici" },
  { id: "musicians",      label: "Músics" },
  { id: "venues",         label: "Venues" },
  { id: "collaborations", label: "Collaborations" },
]

export default function App() {
  const { isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab]   = useState("dashboard")

  // Si no hi ha sessió activa, mostrem el formulari de login
  if (!isAuthenticated) return <LoginForm />

  return (
    <div className="container">
      <header className="header">
        <h1>SÓ-LOCAL</h1>
        <p>Plataforma de músics locals de Catalunya</p>
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        {/* Botó de logout a la dreta */}
        <button className="tab tab--logout" onClick={logout}>
          Tancar sessió
        </button>
      </nav>

      {activeTab === "dashboard"      && <DashboardSection />}
      {activeTab === "musicians"      && <MusicianSection />}
      {activeTab === "venues"         && <VenueSection />}
      {activeTab === "collaborations" && <CollaborationSection />}
    </div>
  )
}
