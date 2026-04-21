import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

const TasksContext = createContext(null)

function storageKey(userId) {
  return `vite_tasks_${userId}`
}

function load(userId) {
  const raw = localStorage.getItem(storageKey(userId))
  return raw ? JSON.parse(raw) : []
}

function persist(userId, tasks) {
  localStorage.setItem(storageKey(userId), JSON.stringify(tasks))
}

export function TasksProvider({ children }) {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState(() => (currentUser ? load(currentUser.id) : []))

  const refresh = useCallback(() => {
    if (currentUser) setTasks(load(currentUser.id))
  }, [currentUser])

  function addTask({ title, description, status, dueDate }) {
    const next = [...load(currentUser.id), {
      id: Date.now(),
      title,
      description,
      status,   // 'pending' | 'in-progress' | 'done'
      dueDate,
      createdAt: new Date().toISOString(),
    }]
    persist(currentUser.id, next)
    setTasks(next)
  }

  function updateTask(id, fields) {
    const next = load(currentUser.id).map(t => t.id === id ? { ...t, ...fields } : t)
    persist(currentUser.id, next)
    setTasks(next)
  }

  function deleteTask(id) {
    const next = load(currentUser.id).filter(t => t.id !== id)
    persist(currentUser.id, next)
    setTasks(next)
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, refresh }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  return useContext(TasksContext)
}
