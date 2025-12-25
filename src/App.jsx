import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { OrderProvider } from './context/OrderContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <Products />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <ProtectedRoute>
                        <ProductDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  )
}

export default App

