import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const getProductKey = (product) => product?._id || product?.id

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const key = getProductKey(product)
      if (!key) return prev
      const existing = prev.find(item => item.id === key)
      if (existing) {
        return prev.map(item =>
          item.id === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [
        ...prev,
        {
          id: key,
          name: product.name,
          price: product.price,
          description: product.description || '',
          image: product.image || product.image_url || product.imageUrl || '',
          quantity,
        },
      ]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

