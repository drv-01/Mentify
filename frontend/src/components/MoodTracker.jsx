import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MoodTracker = () => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [entries, setEntries] = useState([])
  const [stressLevel, setStressLevel] = useState(5)
  const [trigger, setTrigger] = useState('')
  const [note, setNote] = useState('')
  const [sleepQuality, setSleepQuality] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [socialConnection, setSocialConnection] = useState(5)
  const [physicalActivity, setPhysicalActivity] = useState('')
  const [mealPattern, setMealPattern] = useState('')

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchMoodEntries()
    
    // Track page visit
    const activity = {
      id: Date.now(),
      type: 'mood',
      action: 'Visited Mood Tracker',
      timestamp: new Date().toLocaleString()
    }
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
  }, [])

  const fetchMoodEntries = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Token from localStorage:', token ? 'Present' : 'Missing')
      console.log('Token length:', token ? token.length : 0)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/mood`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEntries(response.data)
    } catch (error) {
      console.error('Error fetching mood entries:', error)
      if (error.response?.status === 401) {
        console.log('Token appears to be invalid or expired')
        // Clear invalid token and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        alert('Your session has expired. Please log in again.')
        navigate('/login')
      }
    }
  }

  const triggers = [
    'Exams', 'Assignments', 'Labs', 'Projects', 'Placements', 
    'Internships', 'Sleep Deprivation', 'Social Pressure', 'Other'
  ]

  const saveMoodEntry = async () => {
    try {
      const moodLabel = stressLevel <= 3 ? 'Great' : stressLevel <= 5 ? 'Okay' : stressLevel <= 7 ? 'Stressed' : 'Overwhelmed'
      const moodEmoji = stressLevel <= 3 ? '😊' : stressLevel <= 5 ? '😐' : stressLevel <= 7 ? '😰' : '😫'
      
      const payload = {
        mood: moodLabel.toLowerCase(),
        moodLabel,
        moodEmoji,
        stressLevel,
        trigger: trigger || null,
        note: note || null,
        sleepQuality,
        energyLevel,
        socialConnection,
        physicalActivity: physicalActivity || null,
        mealPattern: mealPattern || null
      }
      
      console.log('Sending mood entry payload:', payload)
      
      const token = localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_URL}/api/mood`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Track activity
      const activity = {
        id: Date.now(),
        type: 'mood',
        action: `Logged mood: ${moodLabel}`,
        timestamp: new Date().toLocaleString()
      }
      const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
      const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
      localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
      
      // Reset form
      setStressLevel(5)
      setTrigger('')
      setNote('')
      setSleepQuality(5)
      setEnergyLevel(5)
      setSocialConnection(5)
      setPhysicalActivity('')
      setMealPattern('')
      
      // Refresh entries
      fetchMoodEntries()
    } catch (error) {
      console.error('Error saving mood entry:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        alert('Your session has expired. Please log in again.')
        navigate('/login')
      }
    }
  }

  const getAverageStress = () => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry.stressLevel, 0)
    return (sum / entries.length).toFixed(1)
  }

  const deleteEntry = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/mood/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchMoodEntries()
    } catch (error) {
      console.error('Error deleting mood entry:', error)
    }
  }

  const getRecentTrend = () => {
    if (entries.length < 2) return 'neutral'
    const recent = entries.slice(0, 3)
    const avgRecent = recent.reduce((acc, e) => acc + e.stressLevel, 0) / recent.length
    const older = entries.slice(3, 6)
    if (older.length === 0) return 'neutral'
    const avgOlder = older.reduce((acc, e) => acc + e.stressLevel, 0) / older.length
    
    if (avgRecent < avgOlder - 1) return 'improving'
    if (avgRecent > avgOlder + 1) return 'declining'
    return 'stable'
  }

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
              }`}>Mood Tracker</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Quick Stats */}
        {entries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className={`rounded-xl shadow p-4 text-center ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-2xl mb-2">📅</div>
              <div className={`text-2xl font-bold ${
                isToggled ? 'text-gray-300' : 'text-gray-800'
              }`}>{entries.length}</div>
              <div className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>Check-ins</div>
            </div>
            <div className={`rounded-xl shadow p-4 text-center ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-2xl mb-2">🧠</div>
              <div className={`text-2xl font-bold ${
                isToggled ? 'text-gray-300' : 'text-gray-800'
              }`}>{getAverageStress()}/10</div>
              <div className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>Avg Stress</div>
            </div>
            <div className={`rounded-xl shadow p-4 text-center ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-2xl mb-2">📈</div>
              <div className={`text-2xl font-bold capitalize ${
                isToggled ? 'text-gray-300' : 'text-gray-800'
              }`}>{getRecentTrend()}</div>
              <div className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>Trend</div>
            </div>
          </div>
        )}

        {/* Mood Entry Form */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
          isToggled ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            isToggled ? 'text-white' : 'text-gray-900'
          }`}>How are you feeling today?</h2>

          {/* Stress Level */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Stress Level: {stressLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Trigger Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              What's on your mind?
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                isToggled 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                  : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
              }`}
            >
              <option value="">Select a trigger (optional)</option>
              {triggers.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Sleep Quality */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sleep Quality: {sleepQuality}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Energy Level */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Energy Level: {energyLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Exhausted</span>
              <span>Energetic</span>
            </div>
          </div>

          {/* Social Connection */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Social Connection: {socialConnection}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={socialConnection}
              onChange={(e) => setSocialConnection(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Isolated</span>
              <span>Connected</span>
            </div>
          </div>

          {/* Physical Activity */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Physical Activity Today
            </label>
            <select
              value={physicalActivity}
              onChange={(e) => setPhysicalActivity(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                isToggled 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                  : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
              }`}
            >
              <option value="">Select activity level</option>
              <option value="none">No exercise</option>
              <option value="light">Light (walking, stretching)</option>
              <option value="moderate">Moderate (gym, sports)</option>
              <option value="intense">Intense (running, heavy workout)</option>
            </select>
          </div>

          {/* Meal Pattern */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Eating Pattern Today
            </label>
            <select
              value={mealPattern}
              onChange={(e) => setMealPattern(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none ${
                isToggled 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                  : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
              }`}
            >
              <option value="">Select eating pattern</option>
              <option value="regular">Regular meals</option>
              <option value="skipped">Skipped meals</option>
              <option value="overate">Overate</option>
              <option value="stress-eating">Stress eating</option>
              <option value="healthy">Healthy choices</option>
            </select>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write about your day, thoughts, or feelings..."
              className={`w-full p-3 border-2 rounded-lg focus:outline-none resize-none ${
                isToggled 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
              }`}
              rows="3"
            />
          </div>

          <button
            onClick={saveMoodEntry}
            className={`w-full font-semibold py-3 rounded-lg transition-all ${
              isToggled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            Save Check-in
          </button>
        </div>

        {/* Support Resources */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
          isToggled 
            ? 'bg-linear-to-br from-gray-800 to-gray-700 text-white'
            : 'bg-linear-to-br from-gray-100 to-gray-200 text-gray-900'
        }`}>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            ☕ Need Support?
          </h3>
          <div className="space-y-2 text-sm">
            <p>• Talk to your college counselor or reach out to a trusted friend</p>
            <p>• Take short breaks between study sessions - your brain needs rest</p>
            <p>• Try the 5-4-3-2-1 grounding technique when feeling overwhelmed</p>
            <p>• Remember: One exam doesn't define your future</p>
            <p className="font-semibold mt-3">Support: 6303945340(24x7)</p>
          </div>
        </div>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <div className={`rounded-2xl shadow-lg p-6 ${
            isToggled ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>Recent Check-ins</h3>
            <div className="space-y-3">
              {entries.slice(0, 5).map((entry) => {
                return (
                  <div key={entry.id} className={`border-2 rounded-lg p-4 transition-all ${
                    isToggled ? 'border-gray-700 hover:border-gray-600' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{entry.moodEmoji}</span>
                        <div>
                          <div className={`font-semibold ${
                            isToggled ? 'text-gray-300' : 'text-gray-800'
                          }`}>{entry.moodLabel}</div>
                          <div className={`text-sm ${
                            isToggled ? 'text-gray-400' : 'text-gray-500'
                          }`}>{new Date(entry.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${
                            isToggled ? 'text-gray-300' : 'text-gray-600'
                          }`}>Stress: {entry.stressLevel}/10</div>
                          {entry.trigger && (
                            <div className={`text-xs mt-1 ${
                              isToggled ? 'text-gray-400' : 'text-gray-500'
                            }`}>{entry.trigger}</div>
                          )}
                        </div>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {entry.note && (
                      <p className={`text-sm mt-2 ml-11 ${
                        isToggled ? 'text-gray-400' : 'text-gray-600'
                      }`}>{entry.note}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Encouragement for first-time users */}
        {entries.length === 0 && (
          <div className={`rounded-2xl shadow-lg p-8 text-center ${
            isToggled ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-5xl mb-4">📚</div>
            <h3 className={`text-xl font-bold mb-2 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>Start Your Wellness Journey</h3>
            <p className={`${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>Begin by checking in with how you're feeling today. Small steps lead to big changes.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MoodTracker;