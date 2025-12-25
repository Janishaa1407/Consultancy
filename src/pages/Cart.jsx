import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to get started
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full md:w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Link to={`/product/${item.id}`}>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-primary-600 transition">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-primary-600">
                      ₹{item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹{cartTotal > 2000 ? 0 : 100}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹{Math.round(cartTotal * 0.18)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ₹{cartTotal + (cartTotal > 2000 ? 0 : 100) + Math.round(cartTotal * 0.18)}
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-primary-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition mb-4"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/products"
              className="block w-full bg-gray-200 text-gray-700 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

