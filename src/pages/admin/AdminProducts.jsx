import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'

const emptyForm = { name: '', price: '', description: '', stock: '', image: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = async () => {
    const data = await api.get('/products')
    setProducts(data.products || [])
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const onChange = (e) => {
    setError(null)
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (!form.name.trim()) {
        setError('Product name is required')
        return
      }
      const priceNum = Number(form.price)
      const stockNum = Number(form.stock || 0)
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        setError('Price must be a valid non-negative number')
        return
      }
      if (!Number.isFinite(stockNum) || stockNum < 0) {
        setError('Stock must be a valid non-negative number')
        return
      }
      const payload = {
        name: form.name.trim(),
        price: priceNum,
        description: form.description || '',
        stock: stockNum,
        image: form.image || '',
      }
      if (editingId) {
        await api.put(`/products/admin/${editingId}`, payload)
      } else {
        await api.post('/products/admin', payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      await refresh()
    } catch (e2) {
      setError(e2.message || 'Save failed')
    }
  }

  const startEdit = (p) => {
    setEditingId(p._id)
    setForm({
      name: p.name || '',
      price: String(p.price ?? ''),
      description: p.description || '',
      stock: String(p.stock ?? 0),
      image: p.image || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setError(null)
    try {
      await api.delete(`/products/admin/${id}`)
      await refresh()
    } catch (e) {
      setError(e.message || 'Delete failed')
    }
  }

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
    return { totalStock }
  }, [products])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      <p className="text-gray-600 mt-1">Add, edit, or delete fertilizers.</p>

      {error && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 inline-block">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? 'Edit product' : 'Add product'}
          </h2>
          <div className="text-sm text-gray-600">Total stock: {stats.totalStock}</div>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              type="number"
              min="0"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
            <input
              name="stock"
              value={form.stock}
              onChange={onChange}
              type="number"
              min="0"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyForm)
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">All products</h2>
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
                  <th className="py-3 pr-4 font-semibold">Price</th>
                  <th className="py-3 pr-4 font-semibold">Stock</th>
                  <th className="py-3 pr-4 font-semibold">Updated</th>
                  <th className="py-3 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 font-semibold text-gray-900">{p.name}</td>
                    <td className="py-3 pr-4">₹{p.price}</td>
                    <td className="py-3 pr-4">{p.stock ?? 0}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : ''}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="px-3 py-2 rounded bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(p._id)}
                          className="px-3 py-2 rounded bg-white border border-red-200 text-red-700 font-semibold hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

