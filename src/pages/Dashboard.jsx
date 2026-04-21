import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TasksContext'
import { useMessages } from '../context/MessagesContext'
import Navbar from '../components/Navbar'

const NAV_ITEMS = [
  {
    key: 'tasks',
    label: 'Mis Tareas',
    desc: 'Administra tus actividades pendientes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="menu-icon">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M7 8h10M7 12h10M7 16h6" />
      </svg>
    ),
  },
  {
    key: 'reports',
    label: 'Reportes',
    desc: 'Consulta estadísticas y gráficas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="menu-icon">
        <path d="M3 20h18M7 20V10M12 20V4M17 20v-7" />
      </svg>
    ),
  },
  {
    key: 'messages',
    label: 'Mensajes',
    desc: 'Revisa tu bandeja de entrada',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="menu-icon">
        <rect x="2" y="4" width="20" height="16" rx="1" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Mi Perfil',
    desc: 'Actualiza tus datos personales',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="menu-icon">
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

export default function Dashboard({ onNavigate }) {
  const { currentUser } = useAuth()
  const { tasks } = useTasks()
  const { unreadCount } = useMessages()

  const pending = tasks.filter(t => t.status === 'pending').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const done = tasks.filter(t => t.status === 'done').length

  return (
    <div className="page">
      <Navbar active="dashboard" onNavigate={onNavigate} />

      <div className="dashboard-content">
        <div className="welcome-card" data-initial={currentUser.name.charAt(0).toUpperCase()}>
          <div className="avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
          <div>
            <h1>Bienvenido, {currentUser.name}</h1>
            <p>{currentUser.email}</p>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="summary-strip">
            <div className="summary-item">
              <span className="summary-num">{pending}</span>
              <span className="summary-lbl">Pendientes</span>
            </div>
            <div className="summary-sep" />
            <div className="summary-item">
              <span className="summary-num">{inProgress}</span>
              <span className="summary-lbl">En progreso</span>
            </div>
            <div className="summary-sep" />
            <div className="summary-item">
              <span className="summary-num">{done}</span>
              <span className="summary-lbl">Completadas</span>
            </div>
            {unreadCount > 0 && (
              <>
                <div className="summary-sep" />
                <div className="summary-item">
                  <span className="summary-num">{unreadCount}</span>
                  <span className="summary-lbl">Sin leer</span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="menu-grid">
          {NAV_ITEMS.map(item => (
            <div key={item.key} className="menu-item" onClick={() => onNavigate(item.key)} style={{ cursor: 'pointer' }}>
              {item.icon}
              <h3>{item.label}</h3>
              <p>{item.desc}</p>
              {item.key === 'messages' && unreadCount > 0 && (
                <span className="menu-badge">{unreadCount} nuevo{unreadCount > 1 ? 's' : ''}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
