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
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import {
  AboutUsPage,
  CareersPage,
  ContactSupportPage,
  FaqPage,
  PrivacyPolicyPage,
  ReturnPolicyPage,
  ShippingPolicyPage,
  TermsOfServicePage,
} from './pages/InfoPages'

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
  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
  <Route path="/return-policy" element={<ReturnPolicyPage />} />
  <Route path="/faq" element={<FaqPage />} />
  <Route path="/contact" element={<ContactSupportPage />} />
  <Route path="/about" element={<AboutUsPage />} />
  <Route path="/careers" element={<CareersPage />} />

  {/* ADMIN PANEL */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="users" element={<AdminUsers />} />
  </Route>

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

