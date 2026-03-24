import { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = async () => {
    const [u, c] = await Promise.all([api.get('/admin/users'), api.get('/admin/customers')])
    setUsers(u.users || [])
    setCustomers(c.customers || [])
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load users')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const setBlocked = async (id, blocked) => {
    setError(null)
    try {
      await api.patch(`/admin/users/${id}/block`, { blocked })
      await refresh()
    } catch (e) {
      setError(e.message || 'Update failed')
    }
  }

  const customerStatsById = new Map(customers.map((c) => [String(c._id), c]))

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>
      <p className="text-gray-600 mt-1">View registered users and block/unblock if needed.</p>

      {error && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 inline-block">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">All users</h2>
          <button
            onClick={() => refresh().catch((e) => setError(e.message || 'Refresh failed'))}
            className="px-3 py-2 rounded bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-4 text-gray-600">Loading...</div>
        ) : (
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Email</th>
                  <th className="py-3 pr-4 font-semibold">Phone</th>
                  <th className="py-3 pr-4 font-semibold">Role</th>
                  <th className="py-3 pr-4 font-semibold">Orders</th>
                  <th className="py-3 pr-4 font-semibold">Last order</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const stats = customerStatsById.get(String(u._id))
                  return (
                    <tr key={u._id} className="border-b last:border-b-0">
                      <td className="py-3 pr-4 font-semibold text-gray-900">{u.name}</td>
                      <td className="py-3 pr-4">{u.email}</td>
                      <td className="py-3 pr-4">{u.phone || '-'}</td>
                      <td className="py-3 pr-4">{u.role}</td>
                      <td className="py-3 pr-4">{stats?.orderCount ?? 0}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {stats?.lastOrderAt ? new Date(stats.lastOrderAt).toLocaleString() : '-'}
                      </td>
                      <td className="py-3 pr-4">
                        {u.blocked ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {u.role === 'admin' ? (
                          <span className="text-xs text-gray-600">—</span>
                        ) : u.blocked ? (
                          <button
                            onClick={() => setBlocked(u._id, false)}
                            className="px-3 py-2 rounded bg-white border border-gray-200 text-gray-800 font-semibold hover:bg-gray-100"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => setBlocked(u._id, true)}
                            className="px-3 py-2 rounded bg-white border border-red-200 text-red-700 font-semibold hover:bg-red-50"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

