import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.jsx'

function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  if (allowedRole && role !== allowedRole) {
    const fallback = role === 'student' ? '/student' : '/admin'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute
