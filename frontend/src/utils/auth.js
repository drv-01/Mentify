export const handleSessionExpiry = (navigate, setIsAuthenticated) => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('isNewUser')
  if (setIsAuthenticated) setIsAuthenticated(false)
  navigate('/')
}

export const checkAuthError = (error, navigate, setIsAuthenticated) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    handleSessionExpiry(navigate, setIsAuthenticated)
    return true
  }
  return false
}