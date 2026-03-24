import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount } = useCart()
  const { user, isAdmin } = useAuth()
  const userInitials = (user?.name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to products page with search query
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <span className="text-2xl font-bold">🌱</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Fertilizer Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Products
            </Link>
            <Link
              to="/products?price=0-1000"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Seasonal Offers
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fertilizers..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/account"
                className="flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-2 rounded-lg font-semibold"
                title="Account"
              >
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold uppercase">
                  {userInitials || 'U'}
                </div>
                <span>{user?.name || user?.email || 'Account'}</span>
              </Link>
            )}
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-primary-600 transition relative"
              title="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fertilizers..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t mt-4 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/products?price=0-1000"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Seasonal Offers
              </Link>
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-700 hover:text-primary-600 font-medium transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/account"
                    className="text-gray-700 hover:text-primary-600 font-medium transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-primary-600 font-medium transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

