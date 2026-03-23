import { createContext, useContext, useState } from "react"

// Context equivalent a un "store" global — qualsevol component pot llegir-lo
const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Inicialitzem des de localStorage per persistir la sessió en recarregar
  const [token, setToken] = useState(localStorage.getItem("token"))

  function login(newToken) {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalitzat per accedir al context des de qualsevol component
export function useAuth() {
  return useContext(AuthContext)
}
