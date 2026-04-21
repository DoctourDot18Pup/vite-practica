import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const MessagesContext = createContext(null)

const STORAGE_KEY = 'vite_messages'
const USERS_KEY = 'vite_users'

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAll(msgs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
}

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function MessagesProvider({ children }) {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState(() => loadAll())

  const inbox = messages.filter(m => m.to === currentUser.id)
  const sent = messages.filter(m => m.from === currentUser.id)
  const unreadCount = inbox.filter(m => !m.read).length

  function send({ toEmail, subject, body }) {
    const users = getUsers()
    const recipient = users.find(u => u.email === toEmail)
    if (!recipient) throw new Error('Usuario destinatario no encontrado')

    const msg = {
      id: Date.now(),
      from: currentUser.id,
      fromName: currentUser.name,
      fromEmail: currentUser.email,
      to: recipient.id,
      toName: recipient.name,
      toEmail: recipient.email,
      subject,
      body,
      read: false,
      createdAt: new Date().toISOString(),
    }
    const next = [msg, ...loadAll()]
    saveAll(next)
    setMessages(next)
  }

  function markRead(id) {
    const next = loadAll().map(m => m.id === id ? { ...m, read: true } : m)
    saveAll(next)
    setMessages(next)
  }

  function deleteMessage(id) {
    const next = loadAll().filter(m => m.id !== id)
    saveAll(next)
    setMessages(next)
  }

  return (
    <MessagesContext.Provider value={{ inbox, sent, unreadCount, send, markRead, deleteMessage }}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  return useContext(MessagesContext)
}
