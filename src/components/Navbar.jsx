import { useAuth } from '../context/AuthContext'
import { useMessages } from '../context/MessagesContext'

const LINKS = [
  { key: 'dashboard', label: 'Inicio' },
  { key: 'tasks',     label: 'Tareas' },
  { key: 'reports',   label: 'Reportes' },
  { key: 'messages',  label: 'Mensajes' },
  { key: 'profile',   label: 'Perfil' },
]

export default function Navbar({ active, onNavigate }) {
  const { logout } = useAuth()
  const { unreadCount } = useMessages()

  function handleLogout() {
    logout()
    onNavigate('login')
  }

  return (
    <nav className="navbar">
      <span className="nav-brand">Mi App</span>
      <div className="nav-links">
        {LINKS.map(({ key, label }) => (
          <button
            key={key}
            className={`btn-nav ${active === key ? 'active' : ''}`}
            onClick={() => onNavigate(key)}
          >
            {label}
            {key === 'messages' && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </button>
        ))}
        <button className="btn-nav btn-logout" onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  )
}
