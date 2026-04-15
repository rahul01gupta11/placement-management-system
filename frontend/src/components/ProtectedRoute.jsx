import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

function ProtectedRoute({ allowedRole, redirectTo, children }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const fallback = redirectTo || (allowedRole === 'admin' ? '/admin/login' : '/auth')
    return <Navigate to={fallback} replace state={{ from: location.pathname }} />
  }

  if (allowedRole && role !== allowedRole) {
    const fallback = role === 'student' ? '/student' : '/admin/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute
