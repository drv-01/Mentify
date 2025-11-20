import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const authParam = urlParams.get('auth')
        const error = urlParams.get('error')

        if (error) {
          console.error('OAuth Error:', error)
          navigate(`/login?error=${error}`)
          return
        }

        if (authParam) {
          const authData = JSON.parse(atob(authParam))
          const { token, user, isNewUser } = authData

          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('isNewUser', isNewUser.toString())
          
          setIsAuthenticated(true)
          navigate('/dashboard')
        } else {
          navigate('/login?error=oauth_no_data')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=oauth_parse_error')
      }
    }

    handleOAuthCallback()
  }, [navigate, setIsAuthenticated])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f4fd] via-[#d1ecf1] to-[#bee9e8]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0891b2] mx-auto mb-4"></div>
        <p className="text-[#2c5282] font-medium">Completing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback