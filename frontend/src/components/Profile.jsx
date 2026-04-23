import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import Footer from './Footer'
import { checkAuthError } from '../utils/auth'

const Profile = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [user, setUser] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    
    const initializeProfile = async () => {
      // First load from local storage for immediate UI
      const localUserData = JSON.parse(localStorage.getItem('user') || '{}')
      setUser(localUserData)
      setFormData({
        name: localUserData.name || '',
        email: localUserData.email || '',
        bio: localUserData.bio || '',
        phone: localUserData.phone || '',
        location: localUserData.location || ''
      })
      
      // Then fetch fresh data from server
      await fetchUserProfile()
    }
    
    initializeProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      setFetchLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        const userData = response.data
        setUser(userData)
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          phone: userData.phone || '',
          location: userData.location || ''
        })
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error.response?.data || error.message)
      checkAuthError(error, navigate, setIsAuthenticated)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.put(`${API_BASE_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('✅ Profile saved to database:', response.data)
      const updatedUser = response.data
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error('❌ Error updating profile:', error.response?.data || error.message)
      if (!checkAuthError(error, navigate, setIsAuthenticated)) {
        // Save to localStorage as fallback
        const updatedUser = { ...user, ...formData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setIsEditing(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isToggled ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Navigation */}
      <nav className={`shadow-sm border-b transition-all duration-300 ${
        isToggled ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/')}
              className={`text-3xl font-bold transition-all duration-300 hover:opacity-80 ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}
            >
              Mentify
            </button>
          </div>
          <div className="flex items-center space-x-4">
             <button
              onClick={() => navigate('/dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isToggled ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-4xl font-bold ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}>Profile Settings</h1>
              <p className={`mt-2 ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your personal information and preferences
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isToggled 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl border transition-all duration-300 ${
            isToggled 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-12 pb-8 border-b border-dashed border-gray-200 dark:border-gray-700">
              <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl transform rotate-3 ${
                isToggled ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white' : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white'
              }`}>
                {formData.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className={`text-3xl font-black tracking-tight ${
                  isToggled ? 'text-white' : 'text-gray-900'
                }`}>{formData.name || 'User'}</h2>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-4">
                  <span className={`flex items-center text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    {formData.email}
                  </span>
                  {formData.location && (
                    <span className={`flex items-center text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {formData.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className={`text-sm font-bold uppercase tracking-wider ${
                  isToggled ? 'text-gray-400' : 'text-gray-500'
                }`}>Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 font-medium ${
                    isToggled 
                      ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-600' 
                      : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                  } ${!isEditing ? 'cursor-not-allowed opacity-75' : 'hover:border-blue-400'}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className={`text-sm font-bold uppercase tracking-wider ${
                  isToggled ? 'text-gray-400' : 'text-gray-500'
                }`}>Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 font-medium ${
                    isToggled 
                      ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-600' 
                      : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                  } ${!isEditing ? 'cursor-not-allowed opacity-75' : 'hover:border-blue-400'}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className={`text-sm font-bold uppercase tracking-wider ${
                  isToggled ? 'text-gray-400' : 'text-gray-500'
                }`}>Phone Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 font-medium ${
                    isToggled 
                      ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-600' 
                      : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                  } ${!isEditing ? 'cursor-not-allowed opacity-75' : 'hover:border-blue-400'}`}
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className={`text-sm font-bold uppercase tracking-wider ${
                  isToggled ? 'text-gray-400' : 'text-gray-500'
                }`}>Location</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 font-medium ${
                    isToggled 
                      ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-600' 
                      : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                  } ${!isEditing ? 'cursor-not-allowed opacity-75' : 'hover:border-blue-400'}`}
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className={`text-sm font-bold uppercase tracking-wider ${
                  isToggled ? 'text-gray-400' : 'text-gray-500'
                }`}>Biographical Info</label>
                <textarea
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 resize-none font-medium ${
                    isToggled 
                      ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-600' 
                      : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                  } ${!isEditing ? 'cursor-not-allowed opacity-75' : 'hover:border-blue-400'}`}
                  placeholder="Share a little about yourself, your goals, or your academic journey..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-12 flex justify-center sm:justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                    isToggled 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                >
                  {loading ? 'Processing...' : 'Update Profile'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer isToggled={isToggled} />
    </div>
  )
}

export default Profile