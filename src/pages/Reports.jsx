import { useTasks } from '../context/TasksContext'
import { useMessages } from '../context/MessagesContext'
import Navbar from '../components/Navbar'

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const BAR_H = 120

  return (
    <svg viewBox={`0 0 ${data.length * 80} ${BAR_H + 40}`} className="bar-chart">
      {data.map((d, i) => {
        const barH = Math.round((d.value / max) * BAR_H)
        const x = i * 80 + 16
        const y = BAR_H - barH
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={48} height={barH} fill={d.value === 0 ? '#e5e5e5' : '#000'} />
            <text x={x + 24} y={BAR_H + 16} textAnchor="middle" fontSize="11" fill="#555">{d.label}</text>
            <text x={x + 24} y={y - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#000">
              {d.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

export default function Reports({ onNavigate }) {
  const { tasks } = useTasks()
  const { inbox, sent } = useMessages()

  const pending = tasks.filter(t => t.status === 'pending').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const done = tasks.filter(t => t.status === 'done').length
  const total = tasks.length
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false
    return new Date(t.dueDate + 'T23:59:59') < new Date()
  }).length

  const last7 = (() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().slice(0, 10)
    })
    return days.map(day => ({
      label: new Date(day + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short' }),
      value: tasks.filter(t => t.createdAt?.slice(0, 10) === day).length,
    }))
  })()

  return (
    <div className="page">
      <Navbar active="reports" onNavigate={onNavigate} />

      <div className="content-area">
        <div className="page-header">
          <div>
            <h2 className="page-title">Reportes</h2>
            <p className="page-sub">Resumen de actividad</p>
          </div>
        </div>

        <section className="report-section">
          <h4 className="section-title">Tareas</h4>
          <div className="stats-grid">
            <StatCard label="Total" value={total} />
            <StatCard label="Pendientes" value={pending} />
            <StatCard label="En progreso" value={inProgress} />
            <StatCard label="Completadas" value={done} />
            <StatCard label="Completación" value={`${completionRate}%`} />
            <StatCard label="Vencidas" value={overdue} sub={overdue > 0 ? 'Requieren atención' : 'Al día'} />
          </div>
        </section>

        <section className="report-section">
          <h4 className="section-title">Tareas creadas — últimos 7 días</h4>
          {total === 0 ? (
            <p className="empty-chart">Sin datos. Crea tareas para ver la gráfica.</p>
          ) : (
            <div className="chart-wrap">
              <BarChart data={last7} />
            </div>
          )}
        </section>

        <section className="report-section">
          <h4 className="section-title">Distribución por estado</h4>
          {total === 0 ? (
            <p className="empty-chart">Sin tareas registradas.</p>
          ) : (
            <div className="chart-wrap">
              <BarChart data={[
                { label: 'Pendiente', value: pending },
                { label: 'En progreso', value: inProgress },
                { label: 'Completada', value: done },
              ]} />
            </div>
          )}
        </section>

        <section className="report-section">
          <h4 className="section-title">Mensajes</h4>
          <div className="stats-grid">
            <StatCard label="Recibidos" value={inbox.length} />
            <StatCard label="Sin leer" value={inbox.filter(m => !m.read).length} />
            <StatCard label="Enviados" value={sent.length} />
          </div>
        </section>
      </div>
    </div>
  )
}
