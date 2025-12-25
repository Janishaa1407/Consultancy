import { Link } from 'react-router-dom'

function Home() {
  const categories = [
    {
      name: 'Organic Fertilizers',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      link: '/products?category=organic',
      description: '100% natural and eco-friendly',
    },
    {
      name: 'Chemical Fertilizers',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      link: '/products?category=chemical',
      description: 'High efficiency and quick results',
    },
    {
      name: 'Organic-Chemical Mix',
      image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400',
      link: '/products?category=organic-chemical',
      description: 'Best of both worlds',
    },
  ]

  const gallery = [
    {
      title: 'Granular NPK',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600',
    },
    {
      title: 'Organic Compost',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    },
    {
      title: 'Liquid Nutrients',
      image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600',
    },
    {
      title: 'Farmland',
      image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section
        className="text-white py-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600')",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Premium Fertilizers for Better Yields
            </h1>
            <p className="text-xl mb-6 text-primary-50">
              Discover our wide range of organic, chemical, and blended fertilizers
              designed to maximize crop production and soil health.
            </p>
            <div className="inline-flex items-center bg-white text-primary-700 px-6 py-2 rounded-full font-semibold shadow-lg">
              Healthy Roots
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary-600 font-semibold mb-2">About Us</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your trusted partner for sustainable crop nutrition
            </h2>
            <p className="text-gray-700 mb-4">
              We bring farmers and growers a curated range of high-quality fertilizers
              backed by agronomy expertise. From soil-enhancing organics to precision
              chemical blends, we focus on boosting yield, quality, and soil life.
            </p>
            <p className="text-gray-700">
              Our team supports you with tailored recommendations, safe handling guidance,
              and timely deliveries-so every season is a success.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600"
              alt="Fertilizer application"
              className="rounded-lg shadow-lg h-40 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600"
              alt="Healthy crops"
              className="rounded-lg shadow-lg h-40 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600"
              alt="Farm landscape"
              className="rounded-lg shadow-lg h-40 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600"
              alt="Soil and growth"
              className="rounded-lg shadow-lg h-40 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Gallery & Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            See Our Products & Reach Us
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {gallery.map((item, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-lg shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                  <div className="absolute bottom-3 left-3 text-white font-semibold drop-shadow">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Visit Our Store</h3>
              <p className="text-gray-700 mb-4">
                123 Agriculture Street, Farm District, City 12345
              </p>
              <p className="text-gray-700 mb-2">Phone: +1 (234) 567-890</p>
              <p className="text-gray-700 mb-6">Email: info@fertilizershop.com</p>
              <div className="rounded-lg overflow-hidden h-56">
                <iframe
                  title="Store Location"
                  src="https://www.google.com/maps/embed?pb=!4v1734315657!6m8!1m7!1sMcZRL94hLtEX13yCK9KEdQ!2m2!1d11.2580988!2d78.4894743!3f53.17833331985444!4f4.6669279467136136!5f0.7820865974627469"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Premium quality fertilizers tested and certified
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery to your doorstep
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing with seasonal discounts
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🌾</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Agricultural experts to guide you
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

