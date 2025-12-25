import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Truck, MapPin, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { addOrder, addOrUpdateAddress } = useOrders()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
  })

  const shippingCost = cartTotal > 2000 ? 0 : 100
  const tax = Math.round(cartTotal * 0.18)
  const total = cartTotal + shippingCost + tax

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      const orderId = `ORD-${Date.now()}`
      const order = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        status: 'Processing',
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          name: formData.firstName + ' ' + formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          isDefault: true,
        },
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethod,
      }

      addOrUpdateAddress(order.shippingAddress)
      addOrder(order)
      clearCart()
      alert('Order placed successfully!')
      navigate('/account')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="text-primary-600 hover:text-primary-700"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > s ? <Check className="w-6 h-6" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-24 h-1 mx-2 ${
                    step > s ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-24">
          <span className="text-sm text-gray-600">Delivery</span>
          <span className="text-sm text-gray-600">Payment</span>
          <span className="text-sm text-gray-600">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2" />
                  Delivery Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Delivery Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        checked={formData.deliveryMethod === 'standard'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Truck className="w-5 h-5 mr-2" />
                      <div>
                        <div className="font-semibold">Standard Delivery</div>
                        <div className="text-sm text-gray-600">5-7 business days - ₹100</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={formData.deliveryMethod === 'express'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Truck className="w-5 h-5 mr-2" />
                      <div>
                        <div className="font-semibold">Express Delivery</div>
                        <div className="text-sm text-gray-600">2-3 business days - ₹250</div>
                      </div>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  Payment Information
                </h2>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-2" />
                      Credit/Debit Card
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                {formData.paymentMethod === 'card' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Review Order</h2>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-gray-700">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zipCode}<br />
                    Phone: {formData.phone}
                  </p>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-700">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹{shippingCost}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

