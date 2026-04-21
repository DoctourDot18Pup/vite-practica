import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login({ onNavigate }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      login(form)
      onNavigate('dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <span className="auth-brand">Mi App</span>
        <div className="auth-tagline">
          <h2>Organiza tu trabajo, simplifica tu día.</h2>
          <p>Tareas, mensajes y reportes en un solo lugar.</p>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <h1>Bienvenido</h1>
          <p className="auth-sub">Ingresa tus credenciales para continuar</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <button type="submit" className="btn-primary">Iniciar sesión</button>
          </form>

          <p className="link-text">
            ¿No tienes cuenta?{' '}
            <button className="btn-link" onClick={() => onNavigate('register')}>Regístrate</button>
          </p>
        </div>
      </div>
    </div>
  )
}
