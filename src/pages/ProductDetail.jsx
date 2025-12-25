import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Check, AlertTriangle } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('overview')

  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Products
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    alert('Product added to cart!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded">
              {product.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            {product.name}
          </h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500 mr-4">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-gray-600">(4.8 rating)</span>
          </div>
          <p className="text-3xl font-bold text-primary-600 mb-6">
            ₹{product.price}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center mb-4"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>

          {/* Quick Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Recommended Crops:</h3>
            <div className="flex flex-wrap gap-2">
              {product.recommendedCrops.map((crop, index) => (
                <span
                  key={index}
                  className="bg-white px-3 py-1 rounded-full text-sm"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-4 border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'benefits', label: 'Benefits & Uses' },
            { id: 'composition', label: 'Nutrient Composition' },
            { id: 'usage', label: 'Usage Instructions' },
            { id: 'safety', label: 'Safety & Storage' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Product Overview</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Advantages
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.advantages.map((adv, index) => (
                    <li key={index}>{adv}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  Disadvantages
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.disadvantages.map((dis, index) => (
                    <li key={index}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Benefits</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Uses</h3>
              <p className="text-gray-700">{product.uses}</p>
            </div>
          </div>
        )}

        {activeTab === 'composition' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Nutrient Composition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.nutrientComposition).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 p-4 rounded-lg flex justify-between"
                >
                  <span className="font-semibold capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Usage Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Dosage</h4>
                  <p className="text-gray-700">{product.dosage}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Method of Use</h4>
                  <p className="text-gray-700">{product.methodOfUse}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Direction</h4>
                  <p className="text-gray-700">{product.direction}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Application Frequency</h4>
                  <p className="text-gray-700">{product.applicationFrequency}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommended Crops</h4>
              <div className="flex flex-wrap gap-2">
                {product.recommendedCrops.map((crop, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Safety Precautions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {product.safetyPrecautions.map((precaution, index) => (
                  <li key={index}>{precaution}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                Warnings
              </h3>
              <p className="text-gray-700 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                {product.warnings}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Storage Instructions</h3>
              <p className="text-gray-700">{product.storageInstructions}</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Expiry Details</h3>
              <p className="text-gray-700">{product.expiryDetails}</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Environmental Impact</h3>
              <p className="text-gray-700">{product.environmentalImpact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail

