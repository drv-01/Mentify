import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { gsap } from 'gsap'
import { API_BASE_URL } from '../config/api'
import { checkAuthError } from '../utils/auth'

const Mentorship = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDomain, setFilterDomain] = useState('all')

  const [showConnectedPopup, setShowConnectedPopup] = useState(false)
  const [expandedBios, setExpandedBios] = useState({})
  const [expandedSpecs, setExpandedSpecs] = useState({})

  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)
  const gridRef = useRef(null)
  const headerRef = useRef(null)
  const contentRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    gsap.to(orb1Ref.current, { x: 60, y: -50, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(orb2Ref.current, { x: -55, y: 65, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
    gsap.to(orb3Ref.current, { x: 45, y: 55, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 })
    gsap.to(gridRef.current, { opacity: isToggled ? 0.06 : 0.04, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    const tl = gsap.timeline()
    tl.fromTo(headerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
      .fromTo(contentRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
  }, [])

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      )
    }
  }, [filterDomain, cardsRef.current])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    
    // Track mentorship page visit
    const activity = {
      id: Date.now(),
      type: 'mentorship',
      action: 'Visited Mentorship Hub',
      timestamp: new Date().toLocaleString(),
      icon: 'mentorship'
    }
    
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
  }, [])

  const mentors = [
    {
      id: 1,
      name: 'Dhruv Kumar',
      role: 'Senior Software Engineer',
      company: 'Google',
      domain: 'Computer Science',
      experience: '8 years',
      specialization: ['DSA', 'System Design', 'Career Guidance'],
      availability: 'Weekends',
      rating: 4.9,
      sessions: 127,
      image: '👨',
      bio: 'Graduated from IIT Delhi. Passionate about helping students navigate technical interviews and career decisions.',
      focus: ['Placements', 'Coding', 'Career'],
      contact: { email: 'dhruv.kumar@gmail.com', phone: '+91-9876543210', linkedin: 'linkedin.com/in/dhruvkumar' }
    },
    {
      id: 2,
      name: 'Khushi Mehta',
      role: 'Machine Learning Engineer',
      company: 'Microsoft',
      domain: 'AI/ML',
      experience: '6 years',
      specialization: ['Python', 'ML Projects', 'Research Guidance'],
      availability: 'Weekday Evenings',
      rating: 4.8,
      sessions: 95,
      image: '👩',
      bio: 'Specialized in helping students with ML projects and research papers. Published 10+ papers.',
      focus: ['Projects', 'Research', 'ML'],
      contact: { email: 'khushi.mehta@outlook.com', phone: '+91-9876543323', linkedin: 'linkedin.com/in/khushimehta' }
    },
    {
      id: 3,
      name: 'Rohit',
      role: 'Product Manager',
      company: 'Amazon',
      domain: 'Product Management',
      experience: '10 years',
      specialization: ['Product Strategy', 'Internships', 'Entrepreneurship'],
      availability: 'Flexible',
      rating: 4.7,
      sessions: 84,
      image: '👨',
      bio: 'From B.Tech to PM. Help students understand different career paths beyond coding.',
      focus: ['Career Switch', 'PM Role', 'Strategy'],
      contact: { email: 'rohit.patel@amazon.com', phone: '+91 94680 52731', linkedin: 'linkedin.com/in/rohitpatel' }
    },
    {
      id: 4,
      name: 'Naman',
      role: 'Assistant Professor',
      company: 'IIT Bombay',
      domain: 'Electronics',
      experience: '12 years',
      specialization: ['Core Subjects', 'GATE Prep', 'Higher Studies'],
      availability: 'Weekends',
      rating: 4.9,
      sessions: 156,
      image: '👨',
      bio: 'Helping students with academic struggles and guiding towards higher education paths.',
      focus: ['Academics', 'GATE', 'MS/PhD'],
      contact: { email: 'naman.reddy@iitb.ac.in', phone: '+918569971000', linkedin: 'linkedin.com/in/namanreddy' }
    },
    {
      id: 5,
      name: 'Harender',
      role: 'Startup Founder & CTO',
      company: 'TechVenture',
      domain: 'Entrepreneurship',
      experience: '7 years',
      specialization: ['Web Dev', 'Startup Building', 'Full Stack'],
      availability: 'Weekday Evenings',
      rating: 4.6,
      sessions: 72,
      image: '👨',
      bio: 'Built 3 startups. Mentor students interested in entrepreneurship and product development.',
      focus: ['Startup', 'Web Dev', 'Innovation'],
      contact: { email: 'harender.singh@techventure.com', phone: '+91 80596 86967', linkedin: 'linkedin.com/in/harendersingh' }
    },
    {
      id: 6,
      name: 'Karan',
      role: 'Counseling Psychologist',
      company: 'Wellness Center',
      domain: 'Mental Health',
      experience: '9 years',
      specialization: ['Stress Management', 'Academic Pressure', 'Work-Life Balance'],
      availability: 'Daily',
      rating: 5.0,
      sessions: 203,
      image: '👨',
      bio: 'Specialized in student mental health. Here to help you manage stress and build resilience.',
      focus: ['Mental Health', 'Stress', 'Balance'],
      contact: { email: 'karan.iyer@wellness.com', phone: '+91 87085 12069', linkedin: 'linkedin.com/in/karaniyer' }
    }
  ]

  const logMentorConnection = async (mentor) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/api/mentorship/connect`, {
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorType: 'default'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowConnectedPopup(true)
    } catch (error) {
      console.error('Error logging mentor connection:', error)
      if (!checkAuthError(error, navigate, setIsAuthenticated)) {
        setShowConnectedPopup(true) // Still show popup even if logging fails for other reasons
      }
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         mentor.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = filterDomain === 'all' || mentor.domain === filterDomain
    return matchesSearch && matchesDomain
  })

  const domains = ['all', ...new Set(mentors.map(m => m.domain))]

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${
      isToggled
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'
    }`}>
      {/* Background orbs */}
      <div ref={orb1Ref} className={`pointer-events-none fixed top-[-100px] left-[-100px] w-[380px] h-[380px] rounded-full blur-3xl ${
        isToggled ? 'bg-gray-700 opacity-20' : 'bg-gray-300 opacity-25'
      }`} />
      <div ref={orb2Ref} className={`pointer-events-none fixed bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full blur-3xl ${
        isToggled ? 'bg-gray-600 opacity-15' : 'bg-gray-400 opacity-20'
      }`} />
      <div ref={orb3Ref} className={`pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full blur-3xl ${
        isToggled ? 'bg-gray-800 opacity-25' : 'bg-white opacity-60'
      }`} />
      {/* Dot grid */}
      <div ref={gridRef} className="pointer-events-none fixed inset-0" style={{
        backgroundImage: `radial-gradient(circle, ${isToggled ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        opacity: isToggled ? 0.05 : 0.03
      }} />

      {/* Sticky Header */}
      <header ref={headerRef} className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        isToggled ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${
                isToggled ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className={`text-2xl font-black tracking-tight ${isToggled ? 'text-white' : 'text-gray-900'}`}>
                MENTOR <span className="text-cyan-500">HUB</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Find your perfect mentor</p>
            </div>
          </div>
        </div>
      </header>

      <main ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Search and Filter */}
        <div className={`rounded-2xl shadow-lg p-4 sm:p-6 mb-8 ${
          isToggled ? 'bg-gray-800/60' : 'bg-white/90'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search mentors by name, skill, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-all ${
                  isToggled
                    ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-cyan-500 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-400 placeholder-gray-500'
                }`}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all ${
                isToggled
                  ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-400'
              }`}
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>
                  {domain === 'all' ? 'All Domains' : domain}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mentors Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => {
            const bioLimit = 50
            const specLimit = 2
            const isExpandedBio = expandedBios[mentor.id]
            const isExpandedSpec = expandedSpecs[mentor.id]
            const truncatedBio = mentor.bio.length > bioLimit ? mentor.bio.substring(0, bioLimit) + '...' : mentor.bio
            const visibleSpecs = isExpandedSpec ? mentor.specialization : mentor.specialization.slice(0, specLimit)

            return (
            <div key={mentor.id} className={`rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden h-full flex flex-col ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <div className="p-6 text-white bg-gradient-to-br from-gray-700 to-gray-900">
                <div className="text-5xl mb-3 text-center">{mentor.image}</div>
                <h3 className="text-xl font-bold text-center">{mentor.name}</h3>
                <p className="text-cyan-300 text-center text-sm">{mentor.role}</p>
                <p className="text-gray-400 text-center text-sm">{mentor.company}</p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className={`font-semibold ${
                      isToggled ? 'text-gray-300' : 'text-gray-800'
                    }`}>{mentor.rating}</span>
                    <span className={`text-sm ${
                      isToggled ? 'text-gray-400' : 'text-gray-500'
                    }`}>({mentor.sessions} sessions)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`text-sm font-semibold mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Specialization:</div>
                  <div className="flex flex-wrap gap-2 min-h-10">
                    {visibleSpecs.map((spec, idx) => (
                      <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isToggled ? 'bg-cyan-900/40 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
                      }`}>
                        {spec}
                      </span>
                    ))}
                  </div>
                  {mentor.specialization.length > specLimit && (
                    <button
                      onClick={() => setExpandedSpecs(prev => ({...prev, [mentor.id]: !prev[mentor.id]}))}
                      className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full transition-all ${
                        isToggled 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isExpandedSpec ? 'Show less' : `+${mentor.specialization.length - specLimit} more`}
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <div className={`text-sm font-semibold mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Focus Areas:</div>
                  <div className="flex flex-wrap gap-2 min-h-8">
                    {mentor.focus.map((f, idx) => (
                      <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isToggled ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <p className={`text-sm ${
                    isToggled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {isExpandedBio ? mentor.bio : truncatedBio}
                  </p>
                  {mentor.bio.length > bioLimit && (
                    <button
                      onClick={() => setExpandedBios(prev => ({...prev, [mentor.id]: !prev[mentor.id]}))}
                      className={`mt-2 text-sm font-semibold px-3 py-1 rounded-full transition-all ${
                        isToggled 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isExpandedBio ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>

                <div className={`flex items-center gap-2 text-sm mb-4 ${
                  isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span>🕒</span>
                  <span>{mentor.availability}</span>
                </div>

                <div className={`mb-4 p-3 rounded-xl ${
                  isToggled ? 'bg-gray-700/40' : 'bg-gray-50'
                }`}>
                  <div className={`text-sm font-semibold mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Contact Information:</div>
                  <div className={`space-y-1 text-xs ${
                    isToggled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span className="truncate">{mentor.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>{mentor.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💼</span>
                      <span className="truncate">{mentor.contact.linkedin}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => logMentorConnection(mentor)}
                  className={`w-full font-bold py-3 rounded-xl transition-all mt-auto hover:scale-[1.02] ${
                    isToggled
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-white'
                  }`}
                >
                  Get Connected
                </button>
              </div>
            </div>
            )
          })}
        </div>

        {/* Connected Success Popup */}
        {showConnectedPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-2xl max-w-md w-full overflow-hidden ${
              isToggled ? 'bg-gray-800/90' : 'bg-white/90'
            }`}>
              <div className="p-6 text-white text-center bg-gradient-to-br from-gray-700 to-gray-900">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-black mb-1">Connected <span className="text-cyan-400">Successfully!</span></h2>
                <p className="text-gray-400 text-sm">Thanks for getting connected</p>
              </div>
              <div className="p-6 text-center">
                <p className={`mb-6 text-sm ${
                  isToggled ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  You will shortly get the Zoom link on your email ID and registered number.
                </p>
                <button
                  onClick={() => setShowConnectedPopup(false)}
                  className={`w-full font-bold py-3 rounded-xl transition-all text-white ${
                    isToggled
                      ? 'bg-cyan-600 hover:bg-cyan-500'
                      : 'bg-cyan-500 hover:bg-cyan-400'
                  }`}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Mentorship