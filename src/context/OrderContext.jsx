import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshOrders = async () => {
    const data = await api.get('/orders/my')
    setOrders(data.orders || [])
  }

  const refreshAddresses = async () => {
    const data = await api.get('/addresses/my')
    setAddresses(data.addresses || [])
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!user) {
        setOrders([])
        setAddresses([])
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const [o, a] = await Promise.all([api.get('/orders/my'), api.get('/addresses/my')])
        if (cancelled) return
        setOrders(o.orders || [])
        setAddresses(a.addresses || [])
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
  }, [user])

  const createAddress = async (address) => {
    setError(null)
    const data = await api.post('/addresses', address)
    await refreshAddresses()
    return data.address
  }

  const deleteAddress = async (id) => {
    setError(null)
    await api.delete(`/addresses/${id}`)
    await refreshAddresses()
  }

  const makeDefaultAddress = async (id) => {
    setError(null)
    await api.patch(`/addresses/${id}/default`, {})
    await refreshAddresses()
  }

  const placeOrder = async ({ addressId, requirements, items }) => {
    setError(null)
    const data = await api.post('/orders', { addressId, requirements, items })
    await refreshOrders()
    return data.order
  }

  const value = useMemo(
    () => ({
      orders,
      addresses,
      loading,
      error,
      setError,
      refreshOrders,
      refreshAddresses,
      createAddress,
      deleteAddress,
      makeDefaultAddress,
      placeOrder,
      setOrders,
    }),
    [orders, addresses, loading, error]
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}

