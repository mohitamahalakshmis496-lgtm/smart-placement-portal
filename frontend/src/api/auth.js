// Small helpers around the localStorage-based auth state.
// Kept framework-free so any component can import them directly.

export function getToken() {
  return localStorage.getItem('token')
}

export function getUser() {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setSession(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function roleHomePath(role) {
  switch (role) {
    case 'student':
      return '/student'
    case 'faculty':
      return '/faculty'
    case 'company':
      return '/company'
    case 'admin':
      return '/admin'
    default:
      return '/'
  }
}
