import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Edit, Save, X, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'

function Account() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const { user, updateProfile, logout } = useAuth()
  const {
    orders,
    addresses,
    loading,
    refreshOrders,
    refreshAddresses,
    deleteAddress,
    makeDefaultAddress,
  } = useOrders()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [addressesList, setAddressesList] = useState([])
  const [ordersList, setOrdersList] = useState([])
  const [trackingOrderId, setTrackingOrderId] = useState(null)
  const [trackingOrder, setTrackingOrder] = useState(null)
  const [trackingError, setTrackingError] = useState(null)
  const trackingSteps = ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered']
  const currentTrackingIndex = trackingOrder?.status ? trackingSteps.indexOf(trackingOrder.status) : -1

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
  }, [user])

  useEffect(() => {
    setAddressesList(addresses)
  }, [addresses])

  useEffect(() => {
    setOrdersList(orders)
  }, [orders])

  useEffect(() => {
    if (user) {
      refreshOrders?.()
      refreshAddresses?.()
    }
  }, [user])

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    updateProfile(profileData)
    alert('Profile updated successfully!')
  }

  const handleDeleteAddress = (id) => {
    deleteAddress?.(id)
  }

  const handleSetDefault = (id) => {
    makeDefaultAddress?.(id)
  }

  useEffect(() => {
    if (!trackingOrderId) return
    setTrackingError(null)
    setTrackingOrder(null)

    const url = `http://localhost:5174/api/orders/my/${trackingOrderId}/stream`
    const es = new EventSource(url, { withCredentials: true })
    es.addEventListener('order', (ev) => {
      try {
        const data = JSON.parse(ev.data)
        setTrackingOrder(data.order)
      } catch {
        // ignore
      }
    })
    es.addEventListener('error', () => {
      setTrackingError('Live tracking connection failed. Retrying...')
    })
    return () => es.close()
  }, [trackingOrderId])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Account</h1>

      {trackingOrderId && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Live Order Tracking</h2>
              <p className="text-sm text-gray-600 mt-1">
                Order #{String(trackingOrderId).slice(-6)}
              </p>
              {trackingError && <p className="text-sm text-yellow-700 mt-2">{trackingError}</p>}
            </div>
            <button
              onClick={() => {
                setTrackingOrderId(null)
                setTrackingOrder(null)
                setTrackingError(null)
              }}
              className="px-3 py-2 rounded bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
            >
              Close
            </button>
          </div>

          {!trackingOrder ? (
            <div className="mt-4 text-gray-600">Connecting...</div>
          ) : (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                  {trackingOrder.status}
                </span>
                {trackingOrder.expectedDeliveryAt && (
                  <span className="text-xs text-gray-600">
                    Expected: {new Date(trackingOrder.expectedDeliveryAt).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  {trackingSteps.map((s, idx) => {
                    const state = idx < currentTrackingIndex ? 'done' : idx === currentTrackingIndex ? 'active' : 'todo'
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                            state === 'done'
                              ? 'bg-primary-600 text-white border-primary-600'
                              : state === 'active'
                                ? 'bg-primary-100 text-primary-700 border-primary-200'
                                : 'bg-white text-gray-500 border-gray-200'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        {idx < trackingSteps.length - 1 && (
                          <div className={`h-1 w-10 ${idx < currentTrackingIndex ? 'bg-primary-600' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs text-gray-600">
                  {trackingSteps.map((s) => (
                    <div key={s} className="text-center">
                      {s.replaceAll('_', ' ')}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Tracking updates</h3>
                <div className="space-y-2">
                  {(trackingOrder.shipping?.trackingUpdates || []).slice(0, 10).map((u, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 border rounded p-3">
                      <div>
                        <div className="font-semibold text-gray-900">{u.status}</div>
                        {u.note && <div className="text-sm text-gray-700 mt-1">{u.note}</div>}
                      </div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">
                        {u.at ? new Date(u.at).toLocaleString() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 mb-8 flex items-start space-x-3">
          <LogIn className="w-6 h-6 mt-1" />
          <div>
            <p className="font-semibold mb-1">You are not logged in.</p>
            <p className="text-sm text-yellow-700 mb-3">
              Please login or sign up to view and update your profile.
            </p>
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-primary-700 border border-primary-200 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  activeTab === 'profile'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  activeTab === 'orders'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5 mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  activeTab === 'addresses'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profileData.name}
                  </h2>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>
                <div className="flex space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center text-gray-600 hover:text-gray-700 font-semibold"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-semibold"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Save
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      logout().finally(() => navigate('/login'))
                    }}
                    className="flex items-center text-red-600 hover:text-red-700 font-semibold"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                <button
                  onClick={() => refreshOrders?.()}
                  className="px-3 py-2 rounded bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
                >
                  Refresh
                </button>
              </div>
              {loading ? (
                <div className="text-gray-600">Loading...</div>
              ) : ordersList.length === 0 ? (
                <div className="text-gray-600">No orders yet.</div>
              ) : (
                <div className="space-y-4">
                  {ordersList.map((o) => (
                    <div key={o._id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="font-semibold text-gray-900">Order #{String(o._id).slice(-6)}</div>
                          <div className="text-sm text-gray-600">
                            {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            {o.status}
                          </span>
                          {o.expectedDeliveryAt && (
                            <span className="text-xs text-gray-600">
                              Expected: {new Date(o.expectedDeliveryAt).toLocaleDateString()}
                            </span>
                          )}
                          <button
                            onClick={() => setTrackingOrderId(o._id)}
                            className="px-3 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700"
                          >
                            Track
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        {o.items?.slice(0, 3)?.map((it, idx) => (
                          <div key={idx}>
                            {it.name} × {it.quantity}
                          </div>
                        ))}
                        {o.items?.length > 3 && <div className="text-gray-500">+ {o.items.length - 3} more</div>}
                      </div>
                      <div className="mt-3 font-bold text-gray-900">Total: ₹{o.totalPrice}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
                <button
                  onClick={() => refreshAddresses?.()}
                  className="px-3 py-2 rounded bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
                >
                  Refresh
                </button>
              </div>
              {loading ? (
                <div className="text-gray-600">Loading...</div>
              ) : addressesList.length === 0 ? (
                <div className="text-gray-600">No addresses saved yet (add one during checkout).</div>
              ) : (
                <div className="space-y-3">
                  {addressesList.map((a) => (
                    <div key={a._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {a.contactName || 'Address'}
                            {a.isDefault && (
                              <span className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {a.fullAddress}, {a.city} - {a.pincode}
                          </div>
                          {a.contactPhone && (
                            <div className="text-sm text-gray-600 mt-1">Phone: {a.contactPhone}</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {!a.isDefault && (
                            <button
                              onClick={() => handleSetDefault(a._id)}
                              className="px-3 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700"
                            >
                              Set default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(a._id)}
                            className="px-3 py-2 rounded bg-white border border-red-200 text-red-700 font-semibold hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Account

