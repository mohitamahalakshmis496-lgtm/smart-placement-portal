import { Navigate } from 'react-router-dom'
import { getToken, getUser, roleHomePath } from '../api/auth'

/**
 * Wrap any route element with this to enforce:
 * - no token           -> redirect to "/"
 * - wrong role         -> redirect to that user's own dashboard (with a message)
 * - correct token+role -> render the children
 *
 * Usage:
 *   <Route path="/student" element={
 *     <ProtectedRoute allowedRoles={['student']}>
 *       <StudentDashboard />
 *     </ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const token = getToken()
  const user = getUser()

  if (!token || !user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but this route belongs to a different role.
    // Send them back to their own dashboard rather than showing a dead end.
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  return children
}
