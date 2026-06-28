import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingStatus(false))
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.user)
    return res.data.user
  }

  async function register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password })
    setUser(res.data.user)
    return res.data.user
  }

  async function logout() {
    await api.post('/auth/logout')
    setUser(null)
  }

  async function updateProfile(data) {
    const res = await api.put('/auth/me', data)
    setUser(res.data.user)
    return res.data.user
  }

  async function googleLogin(credential) {
    const res = await api.post('/auth/google', { credential })
    setUser(res.data.user)
    return res.data.user
  }

  async function updatePassword(currentPassword, newPassword) {
    await api.put('/auth/me/password', { currentPassword, newPassword })
  }

  return (
    <AuthContext.Provider value={{ user, checkingStatus, login, register, logout, googleLogin, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
