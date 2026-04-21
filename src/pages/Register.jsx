import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Register({ onNavigate }) {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    try {
      register({ name: form.name, email: form.email, password: form.password })
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
          <h2>Empieza hoy, sin complicaciones.</h2>
          <p>Crea tu cuenta gratis y accede a todas las funciones al instante.</p>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          <h1>Crear cuenta</h1>
          <p className="auth-sub">Completa los datos para registrarte</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
            />
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
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
            <label>Confirmar contraseña</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <button type="submit" className="btn-primary">Registrarse</button>
          </form>

          <p className="link-text">
            ¿Ya tienes cuenta?{' '}
            <button className="btn-link" onClick={() => onNavigate('login')}>Inicia sesión</button>
          </p>
        </div>
      </div>
    </div>
  )
}
