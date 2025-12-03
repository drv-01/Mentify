import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const authParam = urlParams.get('auth')
        const errorParam = urlParams.get('error')

        console.log('Auth callback params:', { auth: !!authParam, error: errorParam })

        if (errorParam) {
          console.error('OAuth Error:', errorParam)
          setError(`Authentication failed: ${errorParam}`)
          setTimeout(() => navigate(`/login?error=${errorParam}`), 2000)
          return
        }

        if (authParam) {
          try {
            const authData = JSON.parse(atob(authParam))
            const { token, user, isNewUser } = authData

            console.log('Auth data received:', { token: !!token, user: !!user, isNewUser })

            if (!token || !user) {
              throw new Error('Invalid auth data')
            }

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('isNewUser', isNewUser.toString())
            
            setIsAuthenticated(true)
            navigate('/dashboard')
          } catch (parseError) {
            console.error('Parse error:', parseError)
            setError('Failed to process authentication data')
            setTimeout(() => navigate('/login?error=oauth_parse_error'), 2000)
          }
        } else {
          console.error('No auth data received')
          setError('No authentication data received')
          setTimeout(() => navigate('/login?error=oauth_no_data'), 2000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setError('Authentication callback failed')
        setTimeout(() => navigate('/login?error=oauth_parse_error'), 2000)
      }
    }

    handleOAuthCallback()
  }, [navigate, setIsAuthenticated])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-2">{error}</p>
            <p className="text-gray-700 text-sm">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallback