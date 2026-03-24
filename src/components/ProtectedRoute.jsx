import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-full py-12 text-center text-gray-600">
        Checking authentication...
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/account" replace />
  }
  return children
}

export default ProtectedRoute

