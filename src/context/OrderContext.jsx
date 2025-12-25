import { createContext, useContext, useEffect, useState } from 'react'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders')
    return saved ? JSON.parse(saved) : []
  })

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('addresses')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses))
  }, [addresses])

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev])
  }

  const addOrUpdateAddress = (address) => {
    // Deduplicate by full address string
    const key = `${address.address}|${address.city}|${address.state}|${address.zipCode}`
    setAddresses(prev => {
      const exists = prev.find(
        a =>
          `${a.address}|${a.city}|${a.state}|${a.zipCode}`.toLowerCase() ===
          key.toLowerCase()
      )
      if (exists) return prev
      return [
        {
          ...address,
          id: Date.now(),
          isDefault: prev.length === 0,
        },
        ...prev,
      ]
    })
  }

  const removeAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const setDefaultAddress = (id) => {
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addresses,
        addOrder,
        addOrUpdateAddress,
        removeAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}

