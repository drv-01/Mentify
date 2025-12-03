import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: email and password, 2: success
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isToggled, setIsToggled] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
  }, [])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Check if user exists first
      const userCheck = await axios.get(`${API_BASE_URL}/api/auth/user-exists?email=${email}`)
      if (!userCheck.data.exists) {
        setError('No account found with this email address')
        setLoading(false)
        return
      }

      // Reset password directly
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        newPassword
      })
      setSuccess('Password reset successfully! You can now login with your new password.')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
      isToggled 
        ? 'bg-gray-50' 
        : 'bg-gray-50'
    }`}>
      <div className={`backdrop-blur-none p-8 rounded-lg shadow-none w-full max-w-md border transition-all duration-300 ${
        isToggled 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 transition-all duration-300 ${
            isToggled 
              ? 'bg-gray-900' 
              : 'bg-gray-900'
          }`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold text-gray-700 mb-2 transition-all duration-300 ${
            isToggled 
              ? 'bg-gray-900' 
              : 'bg-gray-900'
          }`}>Reset Password</h1>
          <p className={`font-medium transition-all duration-300 ${
            isToggled ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {step === 1 && 'Enter your email and new password'}
            {step === 2 && 'Password reset successful!'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Email Address</label>
              <input
                type="email"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400 transition-all duration-200 ${
                  isToggled 
                    ? 'border-gray-600/30 focus:ring-gray-400 bg-gray-800/20 text-gray-300 placeholder-gray-400' 
                    : 'border-gray-300/30 focus:ring-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-semibold transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>New Password</label>
              <input
                type="password"
                required
                minLength="6"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400 transition-all duration-200 ${
                  isToggled 
                    ? 'border-gray-600/30 focus:ring-gray-400 bg-gray-800/20 text-gray-300 placeholder-gray-400' 
                    : 'border-gray-300/30 focus:ring-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-semibold transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Confirm New Password</label>
              <input
                type="password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-gray-400 transition-all duration-200 ${
                  isToggled 
                    ? 'border-gray-600/30 focus:ring-gray-400 bg-gray-800/20 text-gray-300 placeholder-gray-400' 
                    : 'border-gray-300/30 focus:ring-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50 transition-all duration-200 shadow-none ${
                isToggled 
                  ? 'bg-gray-900 hover:bg-gray-800' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
            <Link
              to="/login"
              className={`inline-block w-full text-center text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-none ${
                isToggled 
                  ? 'bg-gray-900 hover:bg-gray-800' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              Go to Login
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className={`font-semibold transition-colors ${
              isToggled 
                ? 'text-[#00d4aa] hover:text-white/80' 
                : 'text-[#0891b2] hover:text-gray-900/80'
            }`}
          >
            Back to Login
          </Link>
        </div>
      </div>


    </div>
  )
}

export default ForgotPassword