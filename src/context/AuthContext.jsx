import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'vite_users'

function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  function register({ name, email, password }) {
    const users = getUsers()
    if (users.find(u => u.email === email)) {
      throw new Error('El correo ya está registrado')
    }
    const newUser = { id: Date.now(), name, email, password }
    saveUsers([...users, newUser])
    setCurrentUser(newUser)
  }

  function login({ email, password }) {
    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Credenciales incorrectas')
    setCurrentUser(user)
  }

  function logout() {
    setCurrentUser(null)
  }

  function updateProfile({ name, email, password }) {
    const users = getUsers()
    const updated = users.map(u =>
      u.id === currentUser.id ? { ...u, name, email, password } : u
    )
    saveUsers(updated)
    setCurrentUser({ ...currentUser, name, email, password })
  }

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
