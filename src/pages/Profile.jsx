import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Profile({ onNavigate }) {
  const { currentUser, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password && form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    const newPassword = form.password || currentUser.password
    try {
      updateProfile({ name: form.name, email: form.email, password: newPassword })
      setSuccess('Perfil actualizado correctamente')
      setForm(f => ({ ...f, password: '', confirm: '' }))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <Navbar active="profile" onNavigate={onNavigate} />

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-top">
            <div className="avatar large">{currentUser.name.charAt(0).toUpperCase()}</div>
            <h1>Editar perfil</h1>
            <p>{currentUser.email}</p>
          </div>

          <div className="profile-form">
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit}>
              <label>Nombre completo</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label>Nueva contraseña <span className="optional">(opcional)</span></label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Dejar vacío para no cambiar"
                minLength={form.password ? 6 : undefined}
              />
              <label>Confirmar nueva contraseña</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Dejar vacío para no cambiar"
              />
              <button type="submit" className="btn-primary">Guardar cambios</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
