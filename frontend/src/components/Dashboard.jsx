import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isToggled, setIsToggled] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    // Handle OAuth redirect with token
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('isNewUser', 'true')
      setIsAuthenticated(true)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    const userData = localStorage.getItem('user')
    const theme = localStorage.getItem('theme')
    const newUserFlag = localStorage.getItem('isNewUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsToggled(theme === 'dark')
    setIsNewUser(newUserFlag === 'true')
  }, [setIsAuthenticated])

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  const features = [
    {
      title: "Mood Tracker",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      description: "Track your daily emotions and mental state",
      color: "#FCD8CD",
      bgColor: "bg-pink-50"
    },
    {
      title: "Mentorship",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      description: "Connect with verified mental health mentors",
      color: "#FEEBF6",
      bgColor: "bg-blue-50"
    },
    {
      title: "Fitness Tracker",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: "Monitor your physical wellness and activities",
      color: "#EBD6FB",
      bgColor: "bg-green-50"
    },
    {
      title: "Diet Planner",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      ),
      description: "Personalized nutrition for better mental health",
      color: "#687FE5",
      bgColor: "bg-orange-50"
    },
    {
      title: "Scheduler",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: "Organize tasks and manage your daily routine",
      color: "#FCD8CD",
      bgColor: "bg-violet-50"
    },
    {
      title: "AI Chatbot",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: "24/7 AI support for mental wellness guidance",
      color: "#FEEBF6",
      bgColor: "bg-teal-50"
    }
  ]

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isToggled 
        ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' 
        : 'bg-gradient-to-br from-[#e8f4fd] via-[#d1ecf1] to-[#bee9e8]'
    }`}>
      {/* Navigation */}
      <nav className={`backdrop-blur-md shadow-sm border-b transition-all duration-500 ${
        isToggled 
          ? 'bg-[#1a1a2e]/90 border-[#62dafb]/30' 
          : 'bg-[#e8f4fd]/80 border-[#0891b2]/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br rounded-2xl shadow-lg transition-all duration-500 ${
                  isToggled 
                    ? 'from-[#00d4aa] to-[#62dafb]' 
                    : 'from-[#0891b2] to-[#06b6d4]'
                }`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className={`text-3xl font-semibold bg-clip-text text-transparent tracking-wider transition-all duration-500 hover:opacity-80 ${
                    isToggled 
                      ? 'bg-gradient-to-r from-[#62dafb] via-[#00d4aa] to-[#62dafb]' 
                      : 'bg-gradient-to-r from-[#0891b2] via-[#06b6d4] to-[#0891b2]'
                  }`}
                >
                  Mentify
                </button>
              </div>
              <button 
                onClick={toggleTheme}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                  isToggled 
                    ? 'bg-[#62dafb]/20 hover:bg-[#62dafb]/30' 
                    : 'bg-[#0891b2]/20 hover:bg-[#0891b2]/30'
                }`}
              >
                <svg className={`w-5 h-5 transition-all duration-500 ${
                  isToggled ? 'text-[#62dafb] rotate-180' : 'text-[#0891b2] rotate-0'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 ${
                isToggled 
                  ? 'text-[#62dafb] hover:text-[#00d4aa]' 
                  : 'text-[#2c5282] hover:text-[#0891b2]'
              }`}>Features</a>
              <a href="#about" className={`font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 ${
                isToggled 
                  ? 'text-[#62dafb] hover:text-[#00d4aa]' 
                  : 'text-[#2c5282] hover:text-[#0891b2]'
              }`}>About</a>
              <a href="#contact" className={`font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 ${
                isToggled 
                  ? 'text-[#62dafb] hover:text-[#00d4aa]' 
                  : 'text-[#2c5282] hover:text-[#0891b2]'
              }`}>Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/profile')}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                      isToggled ? 'bg-[#62dafb]/20 hover:bg-[#62dafb]/30' : 'bg-[#0891b2]/10 hover:bg-[#0891b2]/20'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                      isToggled ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block">
                      <p className={`font-semibold text-sm ${
                        isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                      }`}>{user.name}</p>
                      <p className={`text-xs ${
                        isToggled ? 'text-[#62dafb]/70' : 'text-[#2c5282]/70'
                      }`}>{user.email}</p>
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      isToggled 
                        ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb]' 
                        : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2]'
                    }`}
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
              className="w-full h-64 object-cover rounded-3xl opacity-20"
            />
          </div>
          <div className="relative z-10 text-center py-16">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 text-2xl font-bold text-white shadow-lg ${
              isToggled ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
            }`}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>
              {isNewUser ? 'Welcome' : 'Welcome back'}, {user?.name || 'Friend'}!
            </h2>
            <p className={`text-lg max-w-2xl mx-auto mb-8 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>
              Ready to continue your success journey? Let's achieve greatness together!
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
            isToggled ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' : 'bg-white/80 border-[#0891b2]/10'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
            }`}>7</div>
            <div className={`text-sm font-medium ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>Days Active</div>
          </div>
          <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
            isToggled ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' : 'bg-white/80 border-[#0891b2]/10'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
            }`}>12</div>
            <div className={`text-sm font-medium ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>AI Interactions</div>
          </div>
          <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
            isToggled ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' : 'bg-white/80 border-[#0891b2]/10'
          }`}>
            <div className={`text-3xl font-bold mb-2 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
            }`}>3</div>
            <div className={`text-sm font-medium ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>Goals Achieved</div>
          </div>
        </div>

        {/* Inspiration Section */}
        <div className={`mb-12 p-6 rounded-3xl shadow-lg border relative overflow-hidden ${
          isToggled ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' : 'bg-white/80 border-[#0891b2]/10'
        }`}>
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200" 
              alt="AI Technology" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="relative z-10">
            <h3 className={`text-xl font-bold mb-3 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>💡 Daily Inspiration</h3>
            <p className={`text-sm ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
            }`}>"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill</p>
          </div>
        </div>

        {/* Feature Cards */}
        <h3 className={`text-2xl font-bold mb-8 text-center ${
          isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
        }`}>Your Success Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                isToggled 
                  ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' 
                  : 'bg-white/90 border-[#0891b2]/10'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 ${feature.color === '#687FE5' ? 'text-white' : 'text-gray-700'}`} style={{backgroundColor: feature.color}}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold tracking-tight mb-3 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>{feature.title}</h3>
              <p className={`text-sm leading-relaxed mb-4 ${
                isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
              }`}>{feature.description}</p>
              <button className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                isToggled 
                  ? 'bg-[#62dafb]/20 text-[#62dafb] hover:bg-[#62dafb]/30' 
                  : 'bg-[#0891b2]/10 text-[#0891b2] hover:bg-[#0891b2]/20'
              }`}>
                Open Tool
              </button>
            </div>
          ))}
        </div>

        {/* Achievement Gallery */}
        <div className={`mt-12 mb-8 ${
          isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
        }`}>
          <h3 className="text-2xl font-bold mb-6 text-center">Student Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400" 
                alt="Students studying" 
                className="w-full h-32 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isToggled ? 'from-[#1a1a2e]/80 to-transparent' : 'from-[#2c5282]/80 to-transparent'
              }`}></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Study Groups</div>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400" 
                alt="Academic achievement" 
                className="w-full h-32 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isToggled ? 'from-[#1a1a2e]/80 to-transparent' : 'from-[#2c5282]/80 to-transparent'
              }`}></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Academic Excellence</div>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" 
                alt="Graduation success" 
                className="w-full h-32 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isToggled ? 'from-[#1a1a2e]/80 to-transparent' : 'from-[#2c5282]/80 to-transparent'
              }`}></div>
              <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Career Success</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`mt-12 p-6 rounded-2xl shadow-lg border ${
          isToggled ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' : 'bg-white/90 border-[#0891b2]/10'
        }`}>
          <h3 className={`text-xl font-bold mb-6 ${
            isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
          }`}>Recent Activity</h3>
          <div className="space-y-4">
            <div className={`flex items-center p-4 rounded-lg ${
              isToggled ? 'bg-[#62dafb]/10' : 'bg-[#0891b2]/5'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                isToggled ? 'bg-[#62dafb]' : 'bg-[#0891b2]'
              }`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className={`font-semibold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>AI Mentor Session: Completed</p>
                <p className={`text-sm ${
                  isToggled ? 'text-[#62dafb]/70' : 'text-[#2c5282]/70'
                }`}>2 hours ago</p>
              </div>
            </div>
            <div className={`flex items-center p-4 rounded-lg ${
              isToggled ? 'bg-[#62dafb]/10' : 'bg-[#0891b2]/5'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                isToggled ? 'bg-[#62dafb]' : 'bg-[#0891b2]'
              }`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className={`font-semibold ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                }`}>Smart Study Plan: Generated</p>
                <p className={`text-sm ${
                  isToggled ? 'text-[#62dafb]/70' : 'text-[#2c5282]/70'
                }`}>Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard