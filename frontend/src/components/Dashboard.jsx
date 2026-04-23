import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MotivationCard from './MotivationCard'
import { handleSessionExpiry, checkAuthError } from '../utils/auth'
import { API_BASE_URL } from '../config/api'

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isToggled, setIsToggled] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [recentActivities, setRecentActivities] = useState([])
  const [streak, setStreak] = useState(0)


  useEffect(() => {
    console.log('📊 Dashboard mounted, checking for OAuth token...')

    // Handle OAuth redirect with token
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userParam = urlParams.get('user')
    const isNewUserParam = urlParams.get('isNewUser')
    const error = urlParams.get('error')

    console.log('URL params:', { token: token ? 'present' : 'none', user: userParam ? 'present' : 'none', isNewUser: isNewUserParam, error })

    if (error) {
      console.error('❌ OAuth Error:', error)
      navigate('/login?error=oauth_failed')
      return
    }

    if (token && userParam) {
      console.log('✅ OAuth token and user data received, setting up user...')
      try {
        const userData = JSON.parse(decodeURIComponent(userParam))
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('isNewUser', isNewUserParam || 'false')
        setUser(userData)
        setIsNewUser(isNewUserParam === 'true')
        setIsAuthenticated(true)
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname)
        console.log('✅ OAuth login successful!')
      } catch (err) {
        console.error('❌ Error parsing user data:', err)
        navigate('/login?error=oauth_failed')
        return
      }
    } else {
      // Check existing localStorage data
      const userData = localStorage.getItem('user')
      const newUserFlag = localStorage.getItem('isNewUser')

      console.log('Local storage data:', {
        userData: userData ? 'present' : 'none',
        newUserFlag
      })

      if (userData) {
        setUser(JSON.parse(userData))
      }
      setIsNewUser(newUserFlag === 'true')
    }

    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchStreak()
  }, [setIsAuthenticated, navigate])

  useEffect(() => {
    // Clear the flag after component has rendered with the message
    if (isNewUser) {
      const timer = setTimeout(() => {
        localStorage.removeItem('isNewUser')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isNewUser])

  const toggleTheme = () => {
    const newTheme = !isToggled
    setIsToggled(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const fetchStreak = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get(`${API_BASE_URL}/api/activities/streak`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStreak(response.data.streak || 0)
    } catch (error) {
      console.error('Error fetching streak:', error)
      setStreak(0)
    }
  }

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setRecentActivities([])
        return
      }

      const response = await axios.get(`${API_BASE_URL}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecentActivities(response.data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
      setRecentActivities([])
    }
  }

  const adjustStreak = async (amount) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.post(`${API_BASE_URL}/api/activities/adjust-streak`, { adjustment: amount }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data && typeof response.data.streak === 'number') {
        setStreak(response.data.streak)
      }
    } catch (error) {
      console.error('Error adjusting streak:', error)
    }
  }

  const deleteActivity = async (activityId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await axios.delete(`${API_BASE_URL}/api/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchActivities()
    } catch (error) {
      console.error('Error deleting activity:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  const features = [
    {
      title: "Affectly",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "AI-powered mood tracking with personalized suggestions",
      color: "#4b5563",
      bgColor: "bg-gray-300"
    },
    {
      title: "Mentorship",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
        </svg>
      ),
      description: "Connect with verified mental health mentors",
      color: "#4b5563",
      bgColor: "bg-gray-300"
    },
    {
      title: "EatFit",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M12 9v6" />
        </svg>
      ),
      description: "Combination of fitness tracking and diet planning",
      color: "#4b5563",
      bgColor: "bg-gray-300"
    },
    {
      title: "Scheduler",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      description: "Organize tasks and manage your daily routine",
      color: "#4b5563",
      bgColor: "bg-gray-300"
    },
  ]

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isToggled ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'
    }`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        isToggled ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                    isToggled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <svg className={`w-5 h-5 transition-all duration-300 ${isToggled ? 'text-gray-300' : 'text-gray-700'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
                {/* <div className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 ${
                  isToggled ? 'bg-gray-800' : 'bg-gray-900'
                }`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div> */}
                <button
                  onClick={() => navigate('/')}
                  className={`text-3xl font-bold transition-all duration-300 hover:opacity-80 ${isToggled ? 'text-white' : 'text-gray-900'
                    }`}
                >
                  Mentify
                </button>
              </div>

            </div>

            {/* <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-semibold text-sm transition-all duration-300 ${
                isToggled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}>Features</a>
              <a href="#about" className={`font-semibold text-sm transition-all duration-300 ${
                isToggled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}>About</a>
              <a href="#contact" className={`font-semibold text-sm transition-all duration-300 ${
                isToggled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}>Contact</a>
            </div> */}

            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/profile')}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                        isToggled ? 'bg-gray-700' : 'bg-gray-900'
                      }`}
                    >
                      {/* Profile SVG Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-3.3137 2.6863-6 6-6h4c3.3137 0 6 2.6863 6 6" />
                      </svg>
                    </div>
                    <div className="hidden md:block text-left mr-2">
                      <p className={`font-bold text-sm leading-tight ${isToggled ? 'text-white' : 'text-gray-900'
                        }`}>{user.name || 'User'}</p>
                      {user.email && (
                        <p className={`text-[10px] font-medium ${isToggled ? 'text-gray-400' : 'text-gray-500'
                          }`}>{user.email}</p>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 bg-cyan-500 hover:bg-cyan-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
              alt="Students collaborating"
              className="w-full h-64 object-cover rounded-lg opacity-20"
            />
          </div>
          <div className="relative z-10 text-center py-16">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 text-2xl font-bold text-white ${
              isToggled ? 'bg-gray-800' : 'bg-gray-900'
            }`}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 ${isToggled ? 'text-white' : 'text-gray-900'
              }`}>
              {isNewUser ? 'Welcome' : 'Welcome back'}, {user?.name || 'Friend'}!
            </h2>
            {/* <p className={`text-lg max-w-2xl mx-auto mb-8 transition-all duration-300 ${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Ready to continue your success journey? Let's achieve greatness together!
            </p> */}
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-lg border transition-all duration-300 ${
            isToggled ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-900'
            }`}>7</div>
            <div className={`text-sm font-medium ${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>Days Active</div>
          </div>
          <div className={`p-6 rounded-lg border transition-all duration-300 ${
            isToggled ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-900'
            }`}>12</div>
            <div className={`text-sm font-medium ${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>AI Interactions</div>
          </div>
          <div className={`p-6 rounded-lg border transition-all duration-300 ${
            isToggled ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-900'
            }`}>3</div>
            <div className={`text-sm font-medium ${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>Goals Achieved</div>
          </div>
        </div> */}

        {/* Inspiration Section */}
        <MotivationCard isToggled={isToggled} />

        {/* Feature Cards */}
        <h3 className={`text-2xl font-bold mb-8 text-center ${isToggled ? 'text-white' : 'text-gray-900'
          }`}>Your Success Tools</h3>
        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
                isToggled ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/90 border-gray-200'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 text-white`} style={{ backgroundColor: '#374151' }}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isToggled ? 'text-white' : 'text-gray-900'
                }`}>{feature.title}</h3>
              <p className={`text-sm leading-relaxed mb-4 ${isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>{feature.description}</p>
              <button
                onClick={async () => {
                  const { logActivity } = await import('../utils/activityLogger')

                  if (feature.title === 'Affectly') {
                    await logActivity('affectly', 'Opened Affectly')
                    navigate('/affectly')
                  } else if (feature.title === 'Mentorship') {
                    await logActivity('mentorship', 'Opened Mentorship')
                    navigate('/mentorship')
                  } else if (feature.title === 'EatFit') {
                    await logActivity('eatfit', 'Opened EatFit')
                    navigate('/eat-fit')
                  } else if (feature.title === 'Scheduler') {
                    await logActivity('scheduler', 'Opened Scheduler')
                    navigate('/scheduler')
                  }
                }}
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                  isToggled ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-cyan-400 text-white hover:bg-cyan-300'
                }`}>
                Open Tool
              </button>
            </div>
          ))}
        </div>
             {/* Streak Counter Section */}
        <div className={`mt-8 sm:mt-12 p-8 rounded-2xl shadow-xl transition-all duration-500 overflow-hidden relative ${
          isToggled ? 'bg-gray-800/60' : 'bg-white/90'
        }`}>
          {/* Decorative Background Elements */}
          <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 ${
            isToggled ? 'bg-cyan-500' : 'bg-cyan-400'
          }`}></div>
          <div className={`absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 rounded-full blur-2xl opacity-10 ${
            isToggled ? 'bg-cyan-600' : 'bg-cyan-300'
          }`}></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className={`text-2xl font-bold mb-2 ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}>Active Days</h3>
              <p className={`text-sm max-w-xs ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>
                You've been consistently focusing on your wellness and routine. Keep the momentum going!
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-8 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => adjustStreak(-1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    isToggled 
                      ? 'bg-gray-700 border-gray-600 text-gray-300' 
                      : 'bg-gray-100 border-gray-200 text-gray-600'
                  }`}
                  title="Decrease Days"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                <div className="relative group">
                  <div className={`absolute inset-0 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300 ${
                    isToggled ? 'bg-gray-500' : 'bg-gray-600'
                  }`}></div>
                  <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 shadow-lg ${
                    isToggled ? 'border-cyan-500 bg-gray-900' : 'border-cyan-500 bg-white'
                  }`}>
                    <div className="text-center">
                      <span className={`text-4xl font-extrabold block leading-none ${
                        isToggled ? 'text-white' : 'text-gray-900'
                      }`}>{streak}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isToggled ? 'text-gray-400' : 'text-gray-600'
                      }`}>Days</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => adjustStreak(1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    isToggled 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white' 
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  title="Increase Days"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center mb-1">
                  <div className="flex -space-x-1 mr-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${
                        i <= (streak % 5 || 5) ? 'bg-cyan-500' : 'bg-gray-300'
                      }`}></div>
                    ))}
                  </div>
                  <span className={`text-xs font-bold ${
                    isToggled ? 'text-gray-400' : 'text-gray-500'
                  }`}>Current Batch</span>
                </div>
                <p className={`text-xs font-medium italic ${
                  isToggled ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {streak >= 7 ? '🔥 You are on fire!' : streak >= 3 ? '⚡ Building habits!' : '🌱 Just getting started!'}
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className={`p-4 rounded-xl border-l-4 ${
                isToggled ? 'bg-gray-700/40 border-cyan-500' : 'bg-cyan-50 border-cyan-500'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isToggled ? 'text-white' : 'text-gray-900'}`}>Consistency is Key</h4>
                    <p className={`text-[10px] ${isToggled ? 'text-gray-400' : 'text-gray-500'}`}>Log an activity tomorrow to grow your streak.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Gallery */}
        <div className={`mt-12 mb-8 ${isToggled ? 'text-white' : 'text-gray-900'
          }`}>
          <h3 className="text-2xl font-bold mb-6 text-center">Student Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400"
                alt="Students studying"
                className="w-full h-32 object-cover"
              />
              <div className={`absolute inset-0 ${isToggled ? 'bg-gray-900/60' : 'bg-gray-900/40'
                }`}></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Connection Building</div>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400"
                alt="Academic achievement"
                className="w-full h-32 object-cover"
              />
              <div className={`absolute inset-0 ${isToggled ? 'bg-gray-900/60' : 'bg-gray-900/40'
                }`}></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Academic Excellence</div>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
                alt="Graduation success"
                className="w-full h-32 object-cover"
              />
              <div className={`absolute inset-0 ${isToggled ? 'bg-gray-900/60' : 'bg-gray-900/40'
                }`}></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Career Success</div>
            </div>
          </div>
        </div>


      </div>

      {/* Contact Us Footer */}
      <footer className={`border-t transition-all duration-300 ${
        isToggled ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className={`text-lg font-semibold mb-4 ${isToggled ? 'text-white' : 'text-gray-900'
              }`}>Contact Us</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
              {/* <a 
                href="https://linkedin.com/in/dhruvkumar" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 transition-all duration-300 ${
                  isToggled ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a> */}
              <a
                href="mailto:support@mentify.com"
                className={`flex items-center space-x-2 transition-all duration-300 ${isToggled ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>drvkmr2006@gmail.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className={`flex items-center space-x-2 transition-all duration-300 ${isToggled ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>8708267033</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard