import { useState } from 'react'
import { useMessages } from '../context/MessagesContext'
import Navbar from '../components/Navbar'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Messages({ onNavigate }) {
  const { inbox, sent, unreadCount, send, markRead, deleteMessage } = useMessages()
  const [tab, setTab] = useState('inbox')        // 'inbox' | 'sent' | 'compose'
  const [selected, setSelected] = useState(null) // message object
  const [form, setForm] = useState({ toEmail: '', subject: '', body: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const list = tab === 'inbox' ? inbox : sent

  function openMessage(msg) {
    if (!msg.read && tab === 'inbox') markRead(msg.id)
    setSelected(msg)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function handleSend(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      send(form)
      setSuccess('Mensaje enviado correctamente')
      setForm({ toEmail: '', subject: '', body: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <Navbar active="messages" onNavigate={onNavigate} />

      <div className="content-area">
        <div className="page-header">
          <div>
            <h2 className="page-title">Mensajes</h2>
            {unreadCount > 0 && <p className="page-sub">{unreadCount} sin leer</p>}
          </div>
          <button className="btn-primary btn-sm" onClick={() => { setTab('compose'); setSelected(null) }}>
            + Redactar
          </button>
        </div>

        <div className="msg-layout">
          {/* Panel izquierdo */}
          <div className="msg-sidebar">
            <div className="tab-bar">
              <button className={`tab-btn ${tab === 'inbox' ? 'active' : ''}`} onClick={() => { setTab('inbox'); setSelected(null) }}>
                Bandeja {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
              <button className={`tab-btn ${tab === 'sent' ? 'active' : ''}`} onClick={() => { setTab('sent'); setSelected(null) }}>
                Enviados
              </button>
            </div>

            {tab !== 'compose' && (
              list.length === 0 ? (
                <div className="empty-state" style={{ padding: '32px 16px' }}>
                  <p>Sin mensajes</p>
                </div>
              ) : (
                <div className="msg-list">
                  {list.map(msg => (
                    <div
                      key={msg.id}
                      className={`msg-row ${selected?.id === msg.id ? 'active' : ''} ${!msg.read && tab === 'inbox' ? 'unread' : ''}`}
                      onClick={() => openMessage(msg)}
                    >
                      <div className="msg-row-top">
                        <span className="msg-from">{tab === 'inbox' ? msg.fromName : msg.toName}</span>
                        <span className="msg-time">{new Date(msg.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <span className="msg-subject">{msg.subject}</span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Panel derecho */}
          <div className="msg-body">
            {tab === 'compose' ? (
              <div className="compose-panel">
                <h3 className="modal-title">Nuevo mensaje</h3>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSend}>
                  <label>Para (correo del destinatario)</label>
                  <input name="toEmail" type="email" value={form.toEmail} onChange={handleChange} placeholder="correo@ejemplo.com" required />
                  <label>Asunto</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="Asunto del mensaje" required />
                  <label>Mensaje</label>
                  <textarea name="body" value={form.body} onChange={handleChange} rows={8} placeholder="Escribe tu mensaje..." required />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button type="button" className="btn-ghost" onClick={() => setTab('inbox')}>Cancelar</button>
                    <button type="submit" className="btn-primary btn-sm">Enviar</button>
                  </div>
                </form>
              </div>
            ) : selected ? (
              <div className="msg-detail">
                <div className="msg-detail-header">
                  <div>
                    <h3 className="msg-detail-subject">{selected.subject}</h3>
                    <p className="msg-detail-meta">
                      {tab === 'inbox' ? `De: ${selected.fromName} (${selected.fromEmail})` : `Para: ${selected.toName} (${selected.toEmail})`}
                    </p>
                    <p className="msg-detail-meta">{formatDate(selected.createdAt)}</p>
                  </div>
                  <button className="btn-icon btn-icon-danger" onClick={() => { deleteMessage(selected.id); setSelected(null) }} title="Eliminar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
                <div className="msg-detail-body">{selected.body}</div>
              </div>
            ) : (
              <div className="empty-state" style={{ flex: 1 }}>
                <p>Selecciona un mensaje para leerlo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
