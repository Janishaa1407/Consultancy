import { useEffect, useState } from 'react'
import { api } from '../../api/client'

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mt-2">{value}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.get('/admin/metrics')
        if (!cancelled) setMetrics(data)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load metrics')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-1">Overview of users, products, and orders.</p>

      {loading ? (
        <div className="mt-6 text-gray-600">Loading...</div>
      ) : error ? (
        <div className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 inline-block">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <StatCard label="Total users" value={metrics.totalUsers} />
            <StatCard label="Total products" value={metrics.totalProducts} />
            <StatCard label="Total orders" value={metrics.totalOrders} />
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
            <h2 className="text-xl font-bold text-gray-900">Recent orders</h2>
            <div className="mt-4 overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-3 pr-4 font-semibold">Time</th>
                    <th className="py-3 pr-4 font-semibold">Customer</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(metrics.recentOrders || []).map((o) => (
                    <tr key={o._id} className="border-b last:border-b-0">
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                      </td>
                      <td className="py-3 pr-4">{o.user?.name || o.user?.email}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-semibold">₹{o.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

