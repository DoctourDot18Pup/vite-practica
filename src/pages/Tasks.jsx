import { useState } from 'react'
import { useTasks } from '../context/TasksContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const STATUS_LABELS = {
  pending: 'Pendiente',
  'in-progress': 'En progreso',
  done: 'Completada',
}

const EMPTY_FORM = { title: '', description: '', status: 'pending', dueDate: '' }

export default function Tasks({ onNavigate }) {
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(null)   // null | 'new' | task-object
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirm, setConfirm] = useState(null)

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  function openNew() {
    setForm(EMPTY_FORM)
    setModal('new')
  }

  function openEdit(task) {
    setForm({ title: task.title, description: task.description, status: task.status, dueDate: task.dueDate || '' })
    setModal(task)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (modal === 'new') {
      addTask(form)
    } else {
      updateTask(modal.id, form)
    }
    setModal(null)
  }

  function handleDelete(id) {
    deleteTask(id)
    setConfirm(null)
  }

  function cycleStatus(task) {
    const order = ['pending', 'in-progress', 'done']
    const next = order[(order.indexOf(task.status) + 1) % order.length]
    updateTask(task.id, { status: next })
  }

  return (
    <div className="page">
      <Navbar active="tasks" onNavigate={onNavigate} />

      <div className="content-area">
        <div className="page-header">
          <div>
            <h2 className="page-title">Mis Tareas</h2>
            <p className="page-sub">{tasks.length} tarea{tasks.length !== 1 ? 's' : ''} en total</p>
          </div>
          <button className="btn-primary btn-sm" onClick={openNew}>+ Nueva tarea</button>
        </div>

        <div className="filter-bar">
          {['all', 'pending', 'in-progress', 'done'].map(s => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'Todas' : STATUS_LABELS[s]}
              <span className="filter-count">
                {s === 'all' ? tasks.length : tasks.filter(t => t.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No hay tareas{filter !== 'all' ? ' en esta categoría' : ''}.</p>
            {filter === 'all' && <button className="btn-link" onClick={openNew}>Crear primera tarea</button>}
          </div>
        ) : (
          <div className="task-list">
            {filtered.map(task => (
              <div key={task.id} className={`task-card status-${task.status}`}>
                <div className="task-main">
                  <div className="task-info">
                    <span className="task-title">{task.title}</span>
                    {task.description && <span className="task-desc">{task.description}</span>}
                    {task.dueDate && (
                      <span className="task-due">
                        Vence: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <div className="task-actions">
                    <button
                      className={`status-badge status-${task.status}`}
                      onClick={() => cycleStatus(task)}
                      title="Cambiar estado"
                    >
                      {STATUS_LABELS[task.status]}
                    </button>
                    <button className="btn-icon" onClick={() => openEdit(task)} title="Editar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button className="btn-icon btn-icon-danger" onClick={() => setConfirm(task.id)} title="Eliminar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal nueva/editar tarea */}
      {modal !== null && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{modal === 'new' ? 'Nueva tarea' : 'Editar tarea'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Título</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Nombre de la tarea" />
              <label>Descripción <span className="optional">(opcional)</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Detalle de la tarea" />
              <label>Estado</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En progreso</option>
                <option value="done">Completada</option>
              </select>
              <label>Fecha límite <span className="optional">(opcional)</span></label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn-primary btn-sm">
                  {modal === 'new' ? 'Crear' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación eliminar */}
      {confirm !== null && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Eliminar tarea</h3>
            <p style={{ marginBottom: '20px', color: '#555' }}>Esta acción no se puede deshacer.</p>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setConfirm(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => handleDelete(confirm)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
