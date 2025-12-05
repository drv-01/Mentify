import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FitnessTracker = () => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [userProfile, setUserProfile] = useState({ weight: '', height: '', age: '' })
  const [workouts, setWorkouts] = useState([])
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [currentDay, setCurrentDay] = useState(userProfile.selectedDay === 'Today' ? new Date().toLocaleDateString('en-US', { weekday: 'short' }) : userProfile.selectedDay)
  const [dietPlan, setDietPlan] = useState(null)
  const [waterIntake, setWaterIntake] = useState(0)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchFitnessProfile()
    fetchWorkouts()
    fetchDietPlan()
    
    // Track page visit
    const activity = {
      id: Date.now(),
      type: 'fitness',
      action: 'Visited Fitness Tracker',
      timestamp: new Date().toLocaleString()
    }
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
  }, [])

  const fetchFitnessProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fitness/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setUserProfile(response.data)
      }
    } catch (error) {
      console.error('Error fetching fitness profile:', error)
    }
  }

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fitness/workouts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWorkouts(response.data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
    }
  }

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_URL}/api/fitness/profile`, {
        weight: parseFloat(userProfile.weight),
        height: parseFloat(userProfile.height),
        age: parseInt(userProfile.age),
        selectedDay: userProfile.selectedDay || 'Today'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchFitnessProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const getPersonalizedWorkouts = () => {
    if (!userProfile.weight || !userProfile.height) return []
    
    const bmi = (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)
    const weight = parseFloat(userProfile.weight)
    
    if (bmi < 18.5) {
      return [
        { name: 'Light Stretching', duration: 15, calories: Math.round(weight * 0.3), type: 'flexibility', icon: '🤸', 
          description: 'Gentle stretches to improve flexibility and blood circulation. Hold each stretch for 30 seconds.',
          instructions: ['Sit or stand comfortably', 'Stretch neck side to side', 'Roll shoulders backward', 'Stretch arms across chest', 'Hold each stretch 30 seconds'] },
        { name: 'Walking', duration: 20, calories: Math.round(weight * 0.8), type: 'cardio', icon: '🚶',
          description: 'Light cardio exercise. Walk at a comfortable pace to build endurance gradually.',
          instructions: ['Start with 5-minute warm-up', 'Walk at comfortable pace', 'Swing arms naturally', 'Breathe steadily', 'Cool down with slow walk'] },
        { name: 'Bodyweight Squats', duration: 10, calories: Math.round(weight * 0.5), type: 'strength', icon: '🦵',
          description: 'Stand with feet shoulder-width apart, lower body as if sitting back into a chair. 3 sets of 8-10 reps.',
          instructions: ['Stand with feet shoulder-width apart', 'Lower body like sitting in chair', 'Keep chest up, knees behind toes', 'Go down until thighs parallel to floor', 'Push through heels to stand'] },
        { name: 'Yoga', duration: 25, calories: Math.round(weight * 0.4), type: 'flexibility', icon: '🧘',
          description: 'Gentle yoga poses focusing on breathing and flexibility. Perfect for stress relief and muscle building.',
          instructions: ['Start in mountain pose', 'Move through cat-cow stretches', 'Hold downward dog for 30 seconds', 'Practice child\'s pose for rest', 'End with deep breathing'] }
      ]
    } else if (bmi >= 18.5 && bmi < 25) {
      return [
        { name: 'Push-ups', duration: 15, calories: Math.round(weight * 0.6), type: 'strength', icon: '💪',
          description: 'Start in plank position, lower chest to ground, push back up. 3 sets of 10-15 reps. Modify on knees if needed.',
          instructions: ['Start in plank position', 'Keep body straight', 'Lower chest to ground', 'Push back up', 'Modify on knees if needed'] },
        { name: 'Jumping Jacks', duration: 12, calories: Math.round(weight * 0.7), type: 'cardio', icon: '🏃',
          description: 'Jump feet apart while raising arms overhead, then jump back to starting position. Great cardio warm-up.',
          instructions: ['Stand with feet together', 'Jump feet apart', 'Raise arms overhead', 'Jump back to start', 'Keep steady rhythm'] },
        { name: 'Plank', duration: 8, calories: Math.round(weight * 0.4), type: 'core', icon: '🧘',
          description: 'Hold plank position on forearms and toes. Keep body straight. Start with 30-second holds, build up gradually.',
          instructions: ['Start on forearms and toes', 'Keep body in straight line', 'Engage core muscles', 'Hold for 30 seconds', 'Rest and repeat 3 times'] },
        { name: 'Burpees', duration: 10, calories: Math.round(weight * 0.9), type: 'cardio', icon: '🔥',
          description: 'Squat down, jump back to plank, do push-up, jump feet forward, jump up with arms overhead. High intensity!',
          instructions: ['Start standing', 'Squat down, hands on floor', 'Jump back to plank position', 'Do one push-up', 'Jump feet forward', 'Jump up with arms overhead'] },
        { name: 'Mountain Climbers', duration: 12, calories: Math.round(weight * 0.8), type: 'cardio', icon: '⛰️',
          description: 'Start in plank position, alternate bringing knees to chest rapidly. Keep core engaged throughout.',
          instructions: ['Start in plank position', 'Bring right knee to chest', 'Return to plank', 'Bring left knee to chest', 'Alternate rapidly', 'Keep core tight'] }
      ]
    } else {
      return [
        { name: 'Brisk Walking', duration: 25, calories: Math.round(weight * 0.6), type: 'cardio', icon: '🚶',
          description: 'Walk at a pace where you can still hold a conversation. Low impact cardio that\'s easy on joints.',
          instructions: ['Start with gentle warm-up', 'Walk at brisk but comfortable pace', 'Pump arms while walking', 'Maintain steady breathing', 'Cool down with slow walk'] },
        { name: 'Wall Push-ups', duration: 12, calories: Math.round(weight * 0.4), type: 'strength', icon: '💪',
          description: 'Stand arm\'s length from wall, place palms flat against wall, push body toward and away from wall.',
          instructions: ['Stand arm\'s length from wall', 'Place palms flat on wall', 'Lean body toward wall', 'Push back to start', 'Keep body straight'] },
        { name: 'Chair Exercises', duration: 15, calories: Math.round(weight * 0.3), type: 'strength', icon: '🪑',
          description: 'Seated exercises including arm circles, leg extensions, and seated marches. Perfect for limited mobility.',
          instructions: ['Sit up straight in chair', 'Do arm circles forward and back', 'Extend legs one at a time', 'March in place while seated', 'Repeat each exercise 10 times'] },
        { name: 'Swimming', duration: 20, calories: Math.round(weight * 1.0), type: 'cardio', icon: '🏊',
          description: 'Full-body, low-impact exercise. Water supports body weight while providing resistance training.',
          instructions: ['Start with gentle warm-up laps', 'Alternate between different strokes', 'Focus on steady breathing', 'Take breaks as needed', 'Cool down with easy swimming'] },
        { name: 'Low Impact Cardio', duration: 18, calories: Math.round(weight * 0.5), type: 'cardio', icon: '❤️',
          description: 'Gentle movements like step-touches, arm swings, and marching in place. Easy on joints.',
          instructions: ['Start with marching in place', 'Add arm swings', 'Do step-touches side to side', 'Include gentle knee lifts', 'Keep movements controlled'] }
      ]
    }
  }

  const addWorkout = async (workout) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_URL}/api/fitness/workouts`, workout, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchWorkouts()
    } catch (error) {
      console.error('Error adding workout:', error)
    }
  }

  const addToToday = async (workout) => {
    const newWorkout = {
      ...workout,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      id: Date.now() // temporary ID
    }
    
    // Add to state immediately
    setWorkouts(prev => [...prev, newWorkout])
    setActiveTab('dashboard')
    
    // Save to database
    await addWorkout(newWorkout)
  }

  const submitProfile = async () => {
    if (!userProfile.weight || !userProfile.height || !userProfile.age) {
      alert('Please fill in all profile fields')
      return
    }
    await saveProfile()
    alert('Profile saved successfully!')
  }

  const toggleWorkout = async (id) => {
    try {
      const workout = workouts.find(w => w.id === id)
      
      // Update state immediately
      setWorkouts(prev => prev.map(w => 
        w.id === id ? { ...w, completed: !w.completed } : w
      ))
      
      const token = localStorage.getItem('token')
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/fitness/workouts/${id}`, {
        completed: !workout.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // If workout was just completed, show progress tab
      if (!workout.completed) {
        setTimeout(() => setActiveTab('progress'), 500)
      }
      
      fetchWorkouts()
    } catch (error) {
      console.error('Error toggling workout:', error)
    }
  }

  const removeWorkout = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/fitness/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchWorkouts()
    } catch (error) {
      console.error('Error removing workout:', error)
    }
  }

  const getWeeklyProgress = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' })
    const completedWorkouts = workouts.filter(w => w.completed)
    const totalMinutes = completedWorkouts.reduce((sum, w) => sum + w.duration, 0)
    return Math.min((totalMinutes / 60) * 100, 100)
  }

  const totalCalories = workouts.filter(w => w.completed).reduce((sum, w) => sum + w.calories, 0)

  const fetchDietPlan = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/diet/plan`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setDietPlan(response.data)
        setWaterIntake(response.data.waterIntake || 0)
      }
    } catch (error) {
      console.error('Error fetching diet plan:', error)
    }
  }

  const updateWaterIntake = async (amount) => {
    const newAmount = Math.max(0, waterIntake + amount)
    setWaterIntake(newAmount)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_URL}/api/diet/plan`, {
        waterIntake: newAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDietPlan()
    } catch (error) {
      console.error('Error updating water intake:', error)
    }
  }

  const addMeal = async (meal) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_URL}/api/diet/meals`, meal, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDietPlan()
    } catch (error) {
      console.error('Error adding meal:', error)
    }
  }


  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isToggled 
        ? 'bg-linear-to-br from-gray-900 via-gray-800 to-gray-700' 
        : 'bg-linear-to-br from-gray-50 via-gray-100 to-gray-200'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-md shadow-sm border-b transition-all duration-500 ${
        isToggled 
          ? 'bg-gray-900/90 border-gray-700/30' 
          : 'bg-gray-50/80 border-gray-200/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isToggled ? 'text-gray-300 hover:bg-gray-700/20' : 'text-gray-700 hover:bg-gray-200/20'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className={`text-xl sm:text-2xl font-bold ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Fitness Tracker</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {['profile', 'dashboard', 'workouts', 'diet', 'progress'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 capitalize ${
                activeTab === tab
                  ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                  : isToggled ? 'text-gray-300 hover:bg-gray-700/20' : 'text-gray-700 hover:bg-gray-200/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Your Fitness Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Weight (kg)</label>
                  <input
                    type="number"
                    value={userProfile.weight || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, weight: e.target.value }))}
                    onBlur={saveProfile}
                    className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                      isToggled 
                        ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-gray-500'
                        : 'bg-white border-gray-300 text-gray-800 focus:border-gray-400'
                    }`}
                    placeholder="Enter your weight"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Height (cm)</label>
                  <input
                    type="number"
                    value={userProfile.height || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, height: e.target.value }))}
                    onBlur={saveProfile}
                    className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                      isToggled 
                        ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-gray-500'
                        : 'bg-white border-gray-300 text-gray-800 focus:border-gray-400'
                    }`}
                    placeholder="Enter your height"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Age</label>
                  <input
                    type="number"
                    value={userProfile.age || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, age: e.target.value }))}
                    onBlur={saveProfile}
                    className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                      isToggled 
                        ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-gray-500'
                        : 'bg-white border-gray-300 text-gray-800 focus:border-gray-400'
                    }`}
                    placeholder="Enter your age"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className={`block text-sm font-medium mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>Select Day for Workout Plan</label>
                <select
                  value={userProfile.selectedDay}
                  onChange={(e) => {
                    const newDay = e.target.value
                    setUserProfile(prev => ({ ...prev, selectedDay: newDay }))
                    setCurrentDay(newDay === 'Today' ? new Date().toLocaleDateString('en-US', { weekday: 'short' }) : newDay)
                  }}
                  className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                    isToggled 
                      ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-gray-500'
                      : 'bg-white border-gray-300 text-gray-800 focus:border-gray-400'
                  }`}
                >
                  <option value="Today">Today</option>
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                  <option value="Sat">Saturday</option>
                  <option value="Sun">Sunday</option>
                </select>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={submitProfile}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isToggled 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Submit Profile
                </button>
              </div>
              
              {userProfile.weight && userProfile.height && (
                <div className="mt-6 p-4 rounded-lg bg-linear-to-r from-blue-50 to-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Your BMI</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {(userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {(() => {
                          const bmi = userProfile.weight / ((userProfile.height / 100) ** 2)
                          if (bmi < 18.5) return 'Underweight'
                          if (bmi < 25) return 'Normal'
                          if (bmi < 30) return 'Overweight'
                          return 'Obese'
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Calories Burned */}
              <div className={`p-6 rounded-2xl shadow-lg ${
                isToggled ? 'bg-gray-800/60' : 'bg-white/90'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Calories Burned</h3>
                  <span className="text-2xl">🔥</span>
                </div>
                <p className={`text-center text-3xl font-bold mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-gray-800'
                }`}>{totalCalories}</p>
                <p className={`text-center text-sm ${
                  isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>From workouts</p>
              </div>

              {/* Active Minutes */}
              <div className={`p-6 rounded-2xl shadow-lg ${
                isToggled ? 'bg-gray-800/60' : 'bg-white/90'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Active Minutes</h3>
                  <span className="text-2xl">⏱️</span>
                </div>
                <p className={`text-center text-3xl font-bold mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  {workouts.filter(w => w.completed).reduce((sum, w) => sum + w.duration, 0)}
                </p>
                <p className={`text-center text-sm ${
                  isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>Minutes today</p>
              </div>
            </div>

            {/* Today's Workouts */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>Today's Workouts ({currentDay})</h3>
                <div className={`text-sm ${
                  isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>Progress: {Math.round(getWeeklyProgress())}%</div>
              </div>
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <div key={workout.id} className={`p-4 rounded-lg border ${
                    workout.completed 
                      ? isToggled ? 'bg-gray-700/20 border-green-500' : 'bg-green-50 border-green-200'
                      : isToggled ? 'bg-gray-700/10 border-gray-600/30' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => toggleWorkout(workout.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            workout.completed 
                              ? 'bg-green-500 border-green-500' 
                              : isToggled ? 'border-gray-300' : 'border-gray-300'
                          }`}
                        >
                          {workout.completed && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium ${
                              workout.completed 
                                ? isToggled ? 'text-gray-300 line-through' : 'text-gray-600 line-through'
                                : isToggled ? 'text-gray-300' : 'text-gray-800'
                            }`}>{workout.name}</p>
                            <button 
                              onClick={() => setSelectedWorkout(selectedWorkout === workout.id ? null : workout.id)}
                              className={`text-xs px-2 py-1 rounded ${
                                isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              {selectedWorkout === workout.id ? 'Hide' : 'Info'}
                            </button>
                          </div>
                          <p className={`text-sm ${
                            isToggled ? 'text-gray-400' : 'text-gray-600'
                          }`}>{workout.duration} min • {workout.calories} cal</p>
                          {selectedWorkout === workout.id && (
                            <div className={`mt-2 p-3 rounded text-sm ${
                              isToggled ? 'bg-gray-700/40 text-gray-300' : 'bg-blue-50 text-gray-700'
                            }`}>
                              <p className="mb-2">{workout.description}</p>
                              <div className="text-xs">
                                <p className="font-semibold mb-1">Instructions:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {workout.instructions?.map((step, index) => (
                                    <li key={index}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          workout.type === 'cardio' ? 'bg-red-100 text-red-800' :
                          workout.type === 'strength' ? 'bg-blue-100 text-blue-800' :
                          workout.type === 'flexibility' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>{workout.type}</span>
                        <button 
                          onClick={() => removeWorkout(workout.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Workouts Tab */}
        {activeTab === 'workouts' && (
          <div className="space-y-8">
            {!userProfile.weight || !userProfile.height ? (
              <div className={`p-8 rounded-2xl shadow-lg text-center ${
                isToggled ? 'bg-gray-800/60' : 'bg-white/90'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>Complete Your Profile First</h3>
                <p className={`mb-6 ${
                  isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>Please enter your weight and height in the Profile tab to get personalized workout recommendations.</p>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isToggled 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Go to Profile
                </button>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl shadow-lg ${
                isToggled ? 'bg-gray-800/60' : 'bg-white/90'
              }`}>
                <h3 className={`text-xl font-bold mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>Personalized Workouts</h3>
                <p className={`text-sm mb-6 ${
                  isToggled ? 'text-gray-400' : 'text-gray-600'
                }`}>Based on your BMI: {(userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {getPersonalizedWorkouts().map((workout, index) => (
                    <div key={index} className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                      isToggled ? 'bg-gray-800/60 hover:bg-gray-800/80' : 'bg-white/90 hover:bg-white'
                    }`}>
                      <div className="text-center">
                        <div className="text-4xl mb-4">{workout.icon}</div>
                        <h4 className={`text-lg font-bold mb-2 ${
                          isToggled ? 'text-gray-300' : 'text-gray-700'
                        }`}>{workout.name}</h4>
                        <div className="space-y-1 mb-4">
                          <p className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>
                            {workout.duration} minutes
                          </p>
                          <p className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>
                            ~{workout.calories} calories
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            workout.type === 'cardio' ? 'bg-red-100 text-red-800' :
                            workout.type === 'strength' ? 'bg-blue-100 text-blue-800' :
                            workout.type === 'core' ? 'bg-yellow-100 text-yellow-800' :
                            workout.type === 'flexibility' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>{workout.type}</span>
                        </div>
                        <button 
                          onClick={() => addToToday(workout)}
                          className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
                            isToggled 
                              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          }`}
                        >
                          Add to Today
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diet Tab */}
        {activeTab === 'diet' && (
          <div className="space-y-8">
            {/* Water Intake */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Water Intake</h3>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl font-bold ${
                  isToggled ? 'text-gray-300' : 'text-gray-800'
                }`}>{waterIntake} glasses</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateWaterIntake(-1)}
                    className={`px-3 py-1 rounded ${
                      isToggled ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                    }`}
                  >-</button>
                  <button
                    onClick={() => updateWaterIntake(1)}
                    className={`px-3 py-1 rounded ${
                      isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                    }`}
                  >+</button>
                </div>
              </div>
            </div>

            {/* Quick Meals */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Quick Meals</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, type: 'breakfast' },
                  { name: 'Grilled Chicken', calories: 250, protein: 30, carbs: 0, fat: 14, type: 'lunch' },
                  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0, type: 'snack' },
                  { name: 'Salmon', calories: 200, protein: 22, carbs: 0, fat: 12, type: 'dinner' },
                  { name: 'Apple', calories: 80, protein: 0, carbs: 22, fat: 0, type: 'snack' },
                  { name: 'Brown Rice', calories: 110, protein: 3, carbs: 23, fat: 1, type: 'side' }
                ].map((meal, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    isToggled ? 'bg-gray-700/10 border-gray-600/30' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      isToggled ? 'text-gray-300' : 'text-gray-800'
                    }`}>{meal.name}</h4>
                    <p className={`text-sm mb-2 ${
                      isToggled ? 'text-gray-400' : 'text-gray-600'
                    }`}>{meal.calories} cal</p>
                    <button
                      onClick={() => addMeal(meal)}
                      className={`w-full py-2 rounded text-sm ${
                        isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      Add to Today
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Meals */}
            {dietPlan && dietPlan.meals && dietPlan.meals.length > 0 && (
              <div className={`p-6 rounded-2xl shadow-lg ${
                isToggled ? 'bg-gray-800/60' : 'bg-white/90'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>Today's Meals</h3>
                <div className="space-y-3">
                  {dietPlan.meals.map((meal) => (
                    <div key={meal.id} className={`p-4 rounded-lg border ${
                      meal.consumed
                        ? isToggled ? 'bg-gray-700/20 border-green-500' : 'bg-green-50 border-green-200'
                        : isToggled ? 'bg-gray-700/10 border-gray-600/30' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-semibold ${
                            isToggled ? 'text-gray-300' : 'text-gray-800'
                          }`}>{meal.name}</h4>
                          <p className={`text-sm ${
                            isToggled ? 'text-gray-400' : 'text-gray-600'
                          }`}>{meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={meal.consumed}
                          onChange={async (e) => {
                            try {
                              const token = localStorage.getItem('token')
                              await axios.patch(`${import.meta.env.VITE_API_URL}/api/diet/meals/${meal.id}`, {
                                consumed: e.target.checked
                              }, {
                                headers: { Authorization: `Bearer ${token}` }
                              })
                              fetchDietPlan()
                            } catch (error) {
                              console.error('Error updating meal:', error)
                            }
                          }}
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Weekly Progress</h3>
              <div className="grid grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const progress = day === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? getWeeklyProgress() : 0
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'short' }) === day
                  return (
                    <div key={day} className="text-center">
                      <p className={`text-sm font-medium mb-2 ${
                        isToday 
                          ? isToggled ? 'text-gray-700' : 'text-gray-200'
                          : isToggled ? 'text-gray-300' : 'text-gray-600'
                      }`}>{day}</p>
                      <div className={`w-8 h-32 mx-auto rounded-full ${
                        isToggled ? 'bg-gray-700/20' : 'bg-gray-200'
                      } relative overflow-hidden`}>
                        <div 
                          className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                            isToggled ? 'bg-gray-700' : 'bg-gray-200'
                          }`}
                          style={{ height: `${progress}%` }}
                        />
                      </div>
                      <p className={`text-xs mt-2 ${
                        isToggled ? 'text-gray-400' : 'text-gray-500'
                      }`}>{Math.round(progress)}%</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Achievement Badges */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'First Workout', icon: '🏆', earned: workouts.some(w => w.completed) },
                  { name: '7 Day Streak', icon: '🔥', earned: workouts.filter(w => w.completed).length >= 7 },
                  { name: 'Workout Warrior', icon: '👟', earned: workouts.length >= 5 },
                  { name: 'Calorie Crusher', icon: '💪', earned: totalCalories >= 500 }
                ].map((badge, index) => (
                  <div key={index} className={`p-4 rounded-lg text-center ${
                    badge.earned 
                      ? isToggled ? 'bg-gray-700/20' : 'bg-yellow-50'
                      : isToggled ? 'bg-gray-700/10' : 'bg-gray-50'
                  }`}>
                    <div className={`text-3xl mb-2 ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                      {badge.icon}
                    </div>
                    <p className={`text-sm font-medium ${
                      badge.earned 
                        ? isToggled ? 'text-gray-300' : 'text-yellow-800'
                        : isToggled ? 'text-gray-500' : 'text-gray-500'
                    }`}>{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FitnessTracker