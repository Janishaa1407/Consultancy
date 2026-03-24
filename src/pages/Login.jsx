import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GoogleLoginButton from '../components/GoogleLoginButton'

function Login() {
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setError?.(null)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError?.(null)
      if (!form.email.trim()) {
        setError?.('Email is required')
        return
      }
      if ((form.password || '').length < 6) {
        setError?.('Password must be at least 6 characters')
        return
      }
      const loggedInUser = await login({ email: form.email, password: form.password })
      navigate(loggedInUser?.role === 'admin' ? '/admin' : '/account')
    } catch (err) {
      setError?.(err.message || 'Login failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Login</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Login
          </button>
        </form>

        <GoogleLoginButton />

        <p className="text-gray-600 text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

