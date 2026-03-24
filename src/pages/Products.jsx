import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, Filter, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { api } from '../api/client'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categoryFilter = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''
  const cropFilter = searchParams.get('crop') || 'all'
  const priceFilter = searchParams.get('price') || 'all'
  const sortBy = searchParams.get('sort') || 'default'

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.get('/products')
        if (!cancelled) setProducts(data.products || [])
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

  const categories = useMemo(() => [{ id: 'all', name: 'All Products' }], [])
  const cropTypes = useMemo(() => [], [])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter
    // (category field not in DB yet; reserved for future)

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Crop filter
    // (cropTypes not in DB yet; reserved for future)

    // Price filter
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number)
      if (max) {
        filtered = filtered.filter(p => p.price >= min && p.price <= max)
      } else {
        filtered = filtered.filter(p => p.price >= min)
      }
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [categoryFilter, searchQuery, cropFilter, priceFilter, sortBy])

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    setSearchParams(params)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`${
            showFilters ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              className="md:hidden text-gray-600 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label
                  key={cat.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={categoryFilter === cat.id}
                    onChange={e => handleFilterChange('category', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Crop Type Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Crop Type</h3>
            <select
              value={cropFilter}
              onChange={e => handleFilterChange('crop', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Crops</option>
              {cropTypes.map(crop => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
            <select
              value={priceFilter}
              onChange={e => handleFilterChange('price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Prices</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="500-1000">₹500 - ₹1,000</option>
              <option value="1000-1500">₹1,000 - ₹1,500</option>
              <option value="1500-">Above ₹1,500</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchParams({})
              setShowFilters(false)
            }}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {filteredProducts.length} Products Found
              </h1>
            </div>
            <select
              value={sortBy}
              onChange={e => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading products...</div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-700 bg-red-50 border border-red-200 inline-block px-4 py-2 rounded">
                {error}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                        In stock: {product.stock ?? 0}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-primary-600 transition">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products

