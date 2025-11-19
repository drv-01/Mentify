import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

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
      const response = await axios.post('https://mentify.onrender.com/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })
      // const response = await axios.post('http://localhost:8000/api/auth/signup', {
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      //   confirmPassword: formData.confirmPassword
      // })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify({ name: formData.name }))
      localStorage.setItem('isNewUser', 'true')
      setIsAuthenticated(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-700 ${
      isToggled 
        ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' 
        : 'bg-gradient-to-br from-[#e8f4fd] via-[#d1ecf1] to-[#bee9e8]'
    }`}>
      <div className={`backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border transition-all duration-500 ${
        isToggled 
          ? 'bg-[#1a1a2e]/90 border-[#62dafb]/30' 
          : 'bg-[#e8f4fd]/90 border-[#0891b2]/20'
      }`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-500 ${
            isToggled 
              ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' 
              : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
          }`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className={`text-4xl font-bold tracking-tight bg-clip-text text-transparent mb-2 transition-all duration-500 ${
            isToggled 
              ? 'bg-gradient-to-r from-[#62dafb] to-[#00d4aa]' 
              : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
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
                ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb]' 
                : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2]'
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