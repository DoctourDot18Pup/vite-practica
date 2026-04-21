import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TasksProvider } from './context/TasksContext'
import { MessagesProvider } from './context/MessagesContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'
import Messages from './pages/Messages'
import './App.css'

const PRIVATE_PAGES = {
  dashboard: Dashboard,
  tasks:     Tasks,
  reports:   Reports,
  messages:  Messages,
  profile:   Profile,
}

function AppRoutes() {
  const { currentUser } = useAuth()
  const [page, setPage] = useState('login')

  function navigate(target) {
    setPage(target)
  }

  if (currentUser) {
    const Page = PRIVATE_PAGES[page] ?? Dashboard
    return (
      <TasksProvider>
        <MessagesProvider>
          <Page onNavigate={navigate} />
        </MessagesProvider>
      </TasksProvider>
    )
  }

  if (page === 'register') return <Register onNavigate={navigate} />
  return <Login onNavigate={navigate} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
