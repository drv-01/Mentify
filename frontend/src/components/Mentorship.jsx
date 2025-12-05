import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Mentorship = () => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [activeTab, setActiveTab] = useState('mentors')
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDomain, setFilterDomain] = useState('all')

  const [showAddMentorForm, setShowAddMentorForm] = useState(false)
  const [customMentors, setCustomMentors] = useState([])
  const [showConnectedPopup, setShowConnectedPopup] = useState(false)
  const [expandedBios, setExpandedBios] = useState({})
  const [expandedSpecs, setExpandedSpecs] = useState({})

  const [newMentorData, setNewMentorData] = useState({
    name: '',
    role: '',
    company: '',
    domain: '',
    experience: '',
    specialization: '',
    availability: '',
    bio: '',
    email: '',
    phone: '',
    linkedin: ''
  })

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchCustomMentors()
    
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

  const fetchCustomMentors = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`https://mentify.onrender.com/api/mentorship/custom`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCustomMentors(response.data)
    } catch (error) {
      console.error('Error fetching custom mentors:', error)
    }
  }

  const addCustomMentor = async () => {
    if (!newMentorData.name || !newMentorData.role || !newMentorData.email) {
      alert('Please fill required fields (Name, Role, Email)')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(`https://mentify.onrender.com/api/mentorship/custom`, newMentorData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setNewMentorData({
        name: '', role: '', company: '', domain: '', experience: '', specialization: '',
        availability: '', bio: '', email: '', phone: '', linkedin: ''
      })
      setShowAddMentorForm(false)
      fetchCustomMentors()
    } catch (error) {
      console.error('Error adding custom mentor:', error)
      alert('Failed to add mentor. Please try again.')
    }
  }

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
      await axios.post(`https://mentify.onrender.com/api/mentorship/connect`, {
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorType: mentor.isCustom ? 'custom' : 'default'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowConnectedPopup(true)
    } catch (error) {
      console.error('Error logging mentor connection:', error)
      setShowConnectedPopup(true) // Still show popup even if logging fails
    }
  }

  const allMentors = [...mentors, ...customMentors.map(mentor => ({
    ...mentor,
    rating: 0,
    sessions: 0,
    image: '👤',
    focus: ['Personal Mentor'],
    contact: {
      email: mentor.email,
      phone: mentor.phone || 'Not provided',
      linkedin: mentor.linkedin || 'Not provided'
    },
    isCustom: true
  }))]
  const filteredMentors = allMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         mentor.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = filterDomain === 'all' || mentor.domain === filterDomain
    return matchesSearch && matchesDomain
  })

  const domains = ['all', ...new Set(allMentors.map(m => m.domain))]

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isToggled ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`shadow-sm border-b transition-all duration-300 ${
        isToggled ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isToggled ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className={`text-xl sm:text-2xl font-bold ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}>Mentorship Hub</h1>
            </div>
            <div className="hidden md:flex items-center gap-6 text-center">
              {/* <div>
                <div className={`text-2xl font-bold ${
                  isToggled ? 'text-gray-300' : 'text-gray-900'
                }`}>{allMentors.length}</div>
                <div className={`text-sm ${
                  isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>Mentors</div>
              </div> */}

              <button
                onClick={() => setShowAddMentorForm(true)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  isToggled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                + Add Mentor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Navigation Tabs */}
        <div className={`rounded-2xl shadow-lg p-2 mb-6 ${
          isToggled ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setActiveTab('mentors')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'mentors'
                  ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  : isToggled ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎓 Find Mentors
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'resources'
                  ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  : isToggled ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📚 Resources
            </button>
          </div>
        </div>

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <>
            {/* Search and Filter */}
            <div className={`rounded-2xl shadow-lg p-4 sm:p-6 mb-6 ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search mentors by name, skill, or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none ${
                      isToggled 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                    }`}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                    isToggled 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                      : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => {
                const bioLimit = 50
                const specLimit = 2
                const isExpandedBio = expandedBios[mentor.id]
                const isExpandedSpec = expandedSpecs[mentor.id]
                const truncatedBio = mentor.bio.length > bioLimit ? mentor.bio.substring(0, bioLimit) + '...' : mentor.bio
                const visibleSpecs = isExpandedSpec ? mentor.specialization : mentor.specialization.slice(0, specLimit)
                
                return (
                <div key={mentor.id} className={`rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden h-full flex flex-col ${
                  isToggled ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className={`p-6 text-white ${
                    isToggled 
                      ? 'bg-linear-to-br from-gray-700 to-gray-600'
                      : 'bg-linear-to-br from-gray-800 to-gray-700'
                  }`}>
                    <div className="text-5xl mb-3 text-center">{mentor.image}</div>
                    <h3 className="text-xl font-bold text-center">{mentor.name}</h3>
                    <p className="text-gray-200 text-center text-sm">{mentor.role}</p>
                    <p className="text-gray-300 text-center text-sm">{mentor.company}</p>
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
                            isToggled ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
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
                            isToggled ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
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

                    <div className={`mb-4 p-3 rounded-lg ${
                      isToggled ? 'bg-gray-700' : 'bg-gray-50'
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
                      className={`w-full font-semibold py-3 rounded-lg transition-all mt-auto ${
                        isToggled 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      Get Connected
                    </button>
                  </div>
                </div>
                )
              })}
            </div>
          </>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className={`rounded-2xl shadow-lg p-6 ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}>Helpful Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`border-2 rounded-xl p-6 transition-all ${
                  isToggled ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <div className="text-3xl mb-3">❤️</div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-800'
                  }`}>Mental Health Support</h3>
                  <ul className={`space-y-2 text-sm ${
                    isToggled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• AASRA: 91-22-27546669 (24x7 Crisis Helpline)</li>
                    <li>• iCall: 91-22-25521111 (Mon-Sat, 8am-10pm)</li>
                    <li>• Vandrevala Foundation: 1860-2662-345</li>
                    <li>• Your Campus Counseling Center</li>
                  </ul>
                </div>

                <div className={`border-2 rounded-xl p-6 transition-all ${
                  isToggled ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-800'
                  }`}>Career Guidance</h3>
                  <ul className={`space-y-2 text-sm ${
                    isToggled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• LinkedIn Learning - Free courses</li>
                    <li>• GeeksforGeeks - Interview prep</li>
                    <li>• Coursera - Skill development</li>
                    <li>• GitHub - Build portfolio</li>
                  </ul>
                </div>

                <div className={`border-2 rounded-xl p-6 transition-all ${
                  isToggled ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-800'
                  }`}>Study Resources</h3>
                  <ul className={`space-y-2 text-sm ${
                    isToggled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• NPTEL - Free video lectures</li>
                    <li>• MIT OCW - Course materials</li>
                    <li>• Khan Academy - Fundamentals</li>
                    <li>• Stack Overflow - Problem solving</li>
                  </ul>
                </div>

                <div className={`border-2 rounded-xl p-6 transition-all ${
                  isToggled ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-400'
                }`}>
                  <div className="text-3xl mb-3">💼</div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-800'
                  }`}>Internship Platforms</h3>
                  <ul className={`space-y-2 text-sm ${
                    isToggled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <li>• Internshala - Indian internships</li>
                    <li>• LinkedIn Jobs - Professional network</li>
                    <li>• AngelList - Startup opportunities</li>
                    <li>• LetsIntern - Student focused</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl shadow-lg p-8 text-white ${
              isToggled 
                ? 'bg-linear-to-br from-gray-700 to-gray-600'
                : 'bg-linear-to-br from-gray-800 to-gray-700'
            }`}>
              <h3 className="text-2xl font-bold mb-4">Remember</h3>
              <div className="space-y-3">
                <p className="flex items-start gap-3">
                  <span className="text-xl">✅</span>
                  <span>It's okay to ask for help. Every successful person had mentors.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-xl">✅</span>
                  <span>Academic pressure is temporary. Your mental health is permanent.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-xl">✅</span>
                  <span>One bad semester doesn't define your career or future.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-xl">✅</span>
                  <span>Take breaks. Rest is productive. Burnout helps no one.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connected Success Popup */}
        {showConnectedPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-2xl max-w-md w-full ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`p-6 text-white text-center ${
                isToggled 
                  ? 'bg-linear-to-br from-gray-700 to-gray-600'
                  : 'bg-linear-to-br from-gray-800 to-gray-700'
              }`}>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2">Connected Successfully!</h2>
                <p className="text-gray-200">Thanks for getting connected</p>
              </div>

              <div className="p-6 text-center">
                <p className={`mb-6 ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  You will shortly get the Zoom link on your email ID and registered number.
                </p>
                <button
                  onClick={() => setShowConnectedPopup(false)}
                  className={`w-full font-semibold py-3 rounded-lg transition-all text-white ${
                    isToggled 
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Mentor Form Modal */}
        {showAddMentorForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`p-6 text-white ${
                isToggled 
                  ? 'bg-linear-to-br from-gray-700 to-gray-600'
                  : 'bg-linear-to-br from-gray-800 to-gray-700'
              }`}>
                <h2 className="text-2xl font-bold mb-2">Add Personal Mentor</h2>
                <p className="text-gray-200">Add someone you know as your mentor</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Mentor Name *"
                    value={newMentorData.name}
                    onChange={(e) => setNewMentorData({...newMentorData, name: e.target.value})}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                      isToggled 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Role/Position *"
                    value={newMentorData.role}
                    onChange={(e) => setNewMentorData({...newMentorData, role: e.target.value})}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                      isToggled 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company"
                    value={newMentorData.company}
                    onChange={(e) => setNewMentorData({...newMentorData, company: e.target.value})}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                      isToggled 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Domain"
                    value={newMentorData.domain}
                    onChange={(e) => setNewMentorData({...newMentorData, domain: e.target.value})}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                      isToggled 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                    }`}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={newMentorData.email}
                  onChange={(e) => setNewMentorData({...newMentorData, email: e.target.value})}
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                    isToggled 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                  }`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newMentorData.phone}
                    onChange={(e) => setNewMentorData({...newMentorData, phone: e.target.value})}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                      isToggled 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn Profile"
                    value={newMentorData.linkedin}
                    onChange={(e) => setNewMentorData({...newMentorData, linkedin: e.target.value})}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                      isToggled 
                        ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Specialization (comma separated)"
                  value={newMentorData.specialization}
                  onChange={(e) => setNewMentorData({...newMentorData, specialization: e.target.value})}
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                    isToggled 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                  }`}
                />
                <textarea
                  placeholder="Bio/Description"
                  value={newMentorData.bio}
                  onChange={(e) => setNewMentorData({...newMentorData, bio: e.target.value})}
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none resize-none ${
                    isToggled 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
                  }`}
                  rows="3"
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddMentorForm(false)
                      setNewMentorData({
                        name: '', role: '', company: '', domain: '', experience: '', specialization: '',
                        availability: '', bio: '', email: '', phone: '', linkedin: ''
                      })
                    }}
                    className={`flex-1 px-6 py-3 border-2 font-semibold rounded-lg transition-all ${
                      isToggled 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomMentor}
                    className={`flex-1 font-semibold py-3 rounded-lg transition-all text-white ${
                      isToggled 
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    Add Mentor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Mentorship