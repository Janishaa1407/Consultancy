import { useEffect, useMemo, useState } from 'react'
import { clearActivityEvents, getActivityEvents } from '../utils/activityLog'

function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')

  const refresh = () => setEvents(getActivityEvents())

  useEffect(() => {
    refresh()
    const onStorage = (e) => {
      if (e.key === 'activityLog_v1') refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events.filter((ev) => {
      if (type !== 'all' && ev.type !== type) return false
      if (!q) return true
      const email = ev?.user?.email || ''
      const name = ev?.user?.name || ''
      return `${email} ${name} ${ev.type}`.toLowerCase().includes(q)
    })
  }, [events, query, type])

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCsv = () => {
    const rows = [
      ['time', 'type', 'email', 'name', 'isAdmin'],
      ...filtered.map((ev) => [
        ev.at || '',
        ev.type || '',
        ev?.user?.email || '',
        ev?.user?.name || '',
        ev?.user?.isAdmin ? 'true' : 'false',
      ]),
    ]
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">User activity: login / logout / signup</p>
          <p className="text-xs text-gray-500 mt-2">
            Note: currently “admin” users are detected if the email contains the word <span className="font-semibold">admin</span>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={exportJson}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50"
          >
            Export JSON
          </button>
          <button
            onClick={exportCsv}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => {
              if (window.confirm('Clear all activity events?')) {
                clearActivityEvents()
                refresh()
              }
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            Clear log
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email, name, type..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="all">All</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="signup">Signup</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{events.length}</span>
          </div>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 pr-4 font-semibold">Time</th>
                <th className="py-3 pr-4 font-semibold">Type</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold">Admin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={5}>
                    No activity events found.
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr key={ev.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 text-gray-800 whitespace-nowrap">
                      {ev.at ? new Date(ev.at).toLocaleString() : ''}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          ev.type === 'login'
                            ? 'bg-green-50 text-green-700'
                            : ev.type === 'logout'
                              ? 'bg-red-50 text-red-700'
                              : ev.type === 'signup'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {ev.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-800">{ev?.user?.email || '-'}</td>
                    <td className="py-3 pr-4 text-gray-800">{ev?.user?.name || '-'}</td>
                    <td className="py-3 pr-4 text-gray-800">{ev?.user?.isAdmin ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard