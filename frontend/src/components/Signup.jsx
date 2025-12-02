import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isToggled, setIsToggled] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    
    // Check for OAuth error in URL
    const urlParams = new URLSearchParams(window.location.search)
    const oauthError = urlParams.get('error')
    if (oauthError) {
      setError('Google authentication failed. Please try again.')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('isNewUser', 'true')
      setIsAuthenticated(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-700 ${
      isToggled 
        ? 'bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' 
        : 'bg-linear-to-br from-[#e8f4fd] via-[#d1ecf1] to-[#bee9e8]'
    }`}>
      <div className={`backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border transition-all duration-500 ${
        isToggled 
          ? 'bg-[#1a1a2e]/90 border-[#62dafb]/30' 
          : 'bg-[#e8f4fd]/90 border-[#0891b2]/20'
      }`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-500 ${
            isToggled 
              ? 'bg-linear-to-r from-[#00d4aa] to-[#62dafb]' 
              : 'bg-linear-to-r from-[#0891b2] to-[#06b6d4]'
          }`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className={`text-4xl font-bold tracking-tight bg-clip-text text-transparent mb-2 transition-all duration-500 ${
            isToggled 
              ? 'bg-linear-to-r from-[#62dafb] to-[#00d4aa]' 
              : 'bg-linear-to-r from-[#0891b2] to-[#06b6d4]'
          }`}>Mentify</h1>
          <p className={`font-medium tracking-wide transition-all duration-500 ${
            isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
          }`}>Start your success journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className={`block text-sm font-semibold transition-all duration-300 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Full Name</label>
            <input
              type="text"
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                isToggled 
                  ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#00d4aa]/20 text-[#62dafb] placeholder-[#62dafb]/60' 
                  : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
              }`}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-semibold transition-all duration-300 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Email Address</label>
            <input
              type="email"
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                isToggled 
                  ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#00d4aa]/20 text-[#62dafb] placeholder-[#62dafb]/60' 
                  : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
              }`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-semibold transition-all duration-300 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Password</label>
            <input
              type="password"
              required
              minLength="6"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                isToggled 
                  ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#00d4aa]/20 text-[#62dafb] placeholder-[#62dafb]/60' 
                  : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
              }`}
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-semibold transition-all duration-300 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Confirm Password</label>
            <input
              type="password"
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                isToggled 
                  ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#00d4aa]/20 text-[#62dafb] placeholder-[#62dafb]/60' 
                  : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
              }`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 px-4 rounded-xl font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
              isToggled 
                ? 'bg-linear-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb]' 
                : 'bg-linear-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2]'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${
                isToggled ? 'border-[#62dafb]/30' : 'border-[#0891b2]/30'
              }`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${
                isToggled ? 'bg-[#1a1a2e]/90 text-[#62dafb]' : 'bg-[#e8f4fd]/90 text-[#2c5282]'
              }`}>Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => {
              console.log('Initiating Google Auth from Signup, API URL:', API_BASE_URL)
              window.location.href = `${API_BASE_URL}/api/auth/google`
            }}
            type="button"
            disabled={loading}
            className={`mt-4 w-full flex items-center justify-center px-4 py-3 border rounded-xl font-semibold tracking-wide transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              isToggled 
                ? 'border-[#62dafb]/30 bg-[#00d4aa]/10 text-[#62dafb] hover:bg-[#00d4aa]/20' 
                : 'border-[#0891b2]/30 bg-white text-[#2c5282] hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className={`font-medium tracking-wide transition-all duration-300 ${
            isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
          }`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-semibold tracking-wide transition-colors ${
              isToggled 
                ? 'text-[#00d4aa] hover:text-[#00d4aa]/80' 
                : 'text-[#0891b2] hover:text-[#0891b2]/80'
            }`}>
              Sign in
            </Link>
          </p>
        </div>
      </div>


    </div>
  )
}

export default Signup