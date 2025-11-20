import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'

const Profile = () => {
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

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setIsToggled(theme === 'dark')
    setUser(userData)
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      bio: userData.bio || '',
      phone: userData.phone || '',
      location: userData.location || ''
    })
  }, [])

  const toggleTheme = () => {
    const newTheme = !isToggled
    setIsToggled(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const handleSave = async () => {
    setLoading(true)
    setTimeout(() => {
      const updatedUser = { ...user, ...formData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isToggled 
        ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' 
        : 'bg-gradient-to-br from-[#e8f4fd] via-[#d1ecf1] to-[#bee9e8]'
    }`}>
      <div className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center space-x-2 mb-4 transition-colors ${
                isToggled ? 'text-[#62dafb] hover:text-[#00d4aa]' : 'text-[#0891b2] hover:text-[#06b6d4]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <h1 className={`text-3xl font-bold ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Profile Settings</h1>
          </div>

          <div className={`backdrop-blur-sm p-8 rounded-3xl shadow-2xl border ${
            isToggled 
              ? 'bg-[#1a1a2e]/90 border-[#62dafb]/30' 
              : 'bg-[#e8f4fd]/90 border-[#0891b2]/20'
          }`}>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                isToggled ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
              }`}>
                {formData.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-center sm:text-left">
                <h2 className={`text-2xl font-bold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>{formData.name || 'User'}</h2>
                <p className={`${
                  isToggled ? 'text-[#62dafb]/70' : 'text-[#2c5282]/70'
                }`}>{formData.email}</p>
              </div>
              <div className="sm:ml-auto">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    isToggled 
                      ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb] text-white' 
                      : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2] text-white'
                  }`}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    isToggled 
                      ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#1a1a2e] text-[#62dafb] placeholder-[#62dafb]/60' 
                      : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
                  } ${!isEditing ? 'opacity-60' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    isToggled 
                      ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#1a1a2e] text-[#62dafb] placeholder-[#62dafb]/60' 
                      : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
                  } ${!isEditing ? 'opacity-60' : ''}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>Phone Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    isToggled 
                      ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#1a1a2e] text-[#62dafb] placeholder-[#62dafb]/60' 
                      : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
                  } ${!isEditing ? 'opacity-60' : ''}`}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>Location</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    isToggled 
                      ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#1a1a2e] text-[#62dafb] placeholder-[#62dafb]/60' 
                      : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
                  } ${!isEditing ? 'opacity-60' : ''}`}
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className={`block text-sm font-semibold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>Bio</label>
                <textarea
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                    isToggled 
                      ? 'border-[#62dafb]/30 focus:ring-[#62dafb] bg-[#1a1a2e] text-[#62dafb] placeholder-[#62dafb]/60' 
                      : 'border-[#0891b2]/30 focus:ring-[#0891b2] bg-[#bee9e8]/30 text-[#2c5282] placeholder-[#2c5282]/70'
                  } ${!isEditing ? 'opacity-60' : ''}`}
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isToggled 
                      ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb] text-white' 
                      : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2] text-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
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