import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Edit, Save, X, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'

function Account() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const { user, updateProfile, logout } = useAuth()
  const { orders, addresses, addOrUpdateAddress, removeAddress, setDefaultAddress } = useOrders()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  })
  const [addressesList, setAddressesList] = useState([])
  const [ordersList, setOrdersList] = useState([])

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
      }))
    }
  }, [user])

  useEffect(() => {
    setAddressesList(addresses)
  }, [addresses])

  useEffect(() => {
    setOrdersList(orders)
  }, [orders])

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

  const handleAddAddress = () => {
    const newAddress = {
      name: 'New Address',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
    }
    addOrUpdateAddress(newAddress)
  }

  const handleDeleteAddress = (id) => {
    removeAddress(id)
  }

  const handleSetDefault = (id) => {
    setDefaultAddress(id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Account</h1>

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
                    {profileData.firstName} {profileData.lastName}
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
                      logout()
                      navigate('/login')
                    }}
                    className="flex items-center text-red-600 hover:text-red-700 font-semibold"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>
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
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
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
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2>
              {ordersList.length === 0 ? (
                <div className="text-gray-600">
                  You have no orders yet. Place an order to see it here.
                </div>
              ) : (
                <div className="space-y-4">
                  {ordersList.map(order => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order {order.id}</h3>
                          <p className="text-gray-600 text-sm">Placed on {order.date}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-700">
                          {order.items} item{order.items > 1 ? 's' : ''} • Total: ₹{order.total}
                        </p>
                        <button className="text-primary-600 hover:text-primary-700 font-semibold">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                <button
                  onClick={handleAddAddress}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-semibold"
                >
                  Add New Address
                </button>
              </div>
              {addressesList.length === 0 ? (
                <p className="text-gray-600">
                  No saved addresses yet. Add one here or during checkout for delivery.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addressesList.map(address => (
                    <div
                      key={address.id}
                      className="border rounded-lg p-4 relative hover:shadow-md transition"
                    >
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      <h3 className="font-semibold text-lg mb-2">{address.name}</h3>
                      <p className="text-gray-700 mb-1">{address.address}</p>
                      <p className="text-gray-700 mb-1">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                          disabled={address.isDefault}
                        >
                          Set as Default
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
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

