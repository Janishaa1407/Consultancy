import { useEffect, useState } from 'react'
import { api } from '../../api/client'

const statuses = ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = async () => {
    const data = await api.get('/orders/admin')
    setOrders(data.orders || [])
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load orders')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const updateStatus = async (id, payload) => {
    setError(null)
    try {
      await api.patch(`/orders/admin/${id}/status`, payload)
      await refresh()
    } catch (e) {
      setError(e.message || 'Update failed')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
      <p className="text-gray-600 mt-1">View and update order status and delivery timelines.</p>

      {error && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 inline-block">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">All orders</h2>
          <button
            onClick={() => refresh().catch((e) => setError(e.message || 'Refresh failed'))}
            className="px-3 py-2 rounded bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-4 text-gray-600">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="mt-4 text-gray-600">No orders yet.</div>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-gray-900">Order #{String(o._id).slice(-6)}</div>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {o.status}
                      </span>
                      {o.expectedDeliveryAt && (
                        <span className="text-xs text-gray-600">
                          Expected: {new Date(o.expectedDeliveryAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                      <div className="font-semibold text-gray-900">Customer</div>
                      <div>{o.user?.name || '-'}</div>
                      <div className="text-gray-600">{o.user?.email}</div>
                      {o.user?.phone && <div className="text-gray-600">{o.user.phone}</div>}
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                      <div className="font-semibold text-gray-900">Address</div>
                      <div>{o.address?.contactName}</div>
                      <div className="text-gray-600">
                        {o.address?.fullAddress}, {o.address?.city} - {o.address?.pincode}
                      </div>
                      {o.address?.contactPhone && <div className="text-gray-600">{o.address.contactPhone}</div>}
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                      <div className="font-semibold text-gray-900">Items</div>
                      <div className="space-y-1 mt-1">
                        {(o.items || []).map((it, idx) => (
                          <div key={idx} className="flex justify-between gap-3">
                            <span>
                              {it.name} × {it.quantity}
                            </span>
                            <span className="text-gray-600">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 font-bold text-gray-900">Total: ₹{o.totalPrice}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-72">
                    <div className="bg-gray-50 border rounded-lg p-3">
                      <div className="font-semibold text-gray-900 mb-2">Update status</div>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, { status: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <div className="mt-3">
                        <div className="text-sm font-semibold text-gray-700 mb-1">Delivery timeline (days)</div>
                        <div className="flex gap-2">
                          {[2, 3, 5].map((d) => (
                            <button
                              key={d}
                              onClick={() => updateStatus(o._id, { status: o.status, deliveryTimelineDays: d, note: `Delivery within ${d} days` })}
                              className="flex-1 px-3 py-2 rounded bg-white border border-gray-200 text-gray-800 font-semibold hover:bg-gray-100"
                              type="button"
                            >
                              {d}d
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-semibold text-gray-700 mb-1">Add note</div>
                        <NoteBox onSubmit={(note) => updateStatus(o._id, { status: o.status, note })} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NoteBox({ onSubmit }) {
  const [note, setNote] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!note.trim()) return
        onSubmit(note.trim())
        setNote('')
      }}
      className="flex gap-2"
    >
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g., Packed and ready"
        className="flex-1 px-3 py-2 border rounded-lg"
      />
      <button className="px-3 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700">
        Send
      </button>
    </form>
  )
}

