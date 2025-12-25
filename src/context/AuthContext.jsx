import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('authUser')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('authUser', JSON.stringify(user))
  }, [user])

  const login = (credentials) => {
    // In a real app, you'd authenticate with a backend
    setUser({
      firstName: credentials.firstName || 'Guest',
      lastName: credentials.lastName || '',
      email: credentials.email,
      phone: credentials.phone || '',
    })
  }

  const signup = (data) => {
    // Simulate account creation
    setUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth || '',
    })
  }

  const logout = () => setUser(null)

  const updateProfile = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

