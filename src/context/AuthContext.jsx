import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await api.get('/auth/me')
        if (!cancelled) {
          setUser(data.user || null)
        }
      } catch {
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const login = async ({ email, password }) => {
    setError(null)
    const data = await api.post('/auth/login', { email, password })
    setUser(data.user)
    return data.user
  }

  const signup = async ({ firstName, lastName, email, phone, password }) => {
    setError(null)
    const data = await api.post('/auth/register', {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      password,
    })
    setUser(data.user)
    return data.user
  }

  const loginWithGoogle = async (idToken) => {
    setError(null)
    const data = await api.post('/auth/google', { idToken })
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore
    }
    setUser(null)
  }

  const updateProfile = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates, name: updates.name || prev.name } : prev)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        loading,
        error,
        setError,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
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

