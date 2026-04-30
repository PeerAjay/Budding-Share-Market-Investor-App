import { createContext, useContext, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const identity = localStorage.getItem('identity')
    return token ? { token, identity } : null
  })

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, username } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('identity', username)

    setUser({ token, identity: username })
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('identity')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
