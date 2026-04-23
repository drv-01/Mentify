import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { gsap } from 'gsap'
import { API_BASE_URL } from '../config/api'
import { checkAuthError } from '../utils/auth'
import { FULL_INDIAN_FOOD_DATA } from '../data/indianFoodData'
import ExerciseLibrary from './ExerciseLibrary'

const EatFit = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  
  // Persisted Tab States
  const [mainActiveTab, setMainActiveTab] = useState(() => 
    localStorage.getItem('eatFitMainTab') || 'fitness'
  )
  
  const [fitnessActiveTab, setFitnessActiveTab] = useState(() => 
    localStorage.getItem('eatFitFitnessTab') || 'profile'
  )
  
  const [dietActiveTab, setDietActiveTab] = useState(() => 
    localStorage.getItem('eatFitDietTab') || 'planner'
  )

  // Sync tabs to localStorage
  useEffect(() => {
    localStorage.setItem('eatFitMainTab', mainActiveTab)
  }, [mainActiveTab])

  useEffect(() => {
    localStorage.setItem('eatFitFitnessTab', fitnessActiveTab)
  }, [fitnessActiveTab])

  useEffect(() => {
    localStorage.setItem('eatFitDietTab', dietActiveTab)
  }, [dietActiveTab])
  
  // Fitness States
  const [userProfile, setUserProfile] = useState({ weight: '', height: '', age: '', selectedDay: 'Today' })
  const [workouts, setWorkouts] = useState([])
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [currentDay, setCurrentDay] = useState(() => 
    new Date().toLocaleDateString('en-US', { weekday: 'short' })
  )

  // Diet States
  const [selectedMeal, setSelectedMeal] = useState('breakfast')
  const [waterIntake, setWaterIntake] = useState(0)
  const [dailyWaterGoal] = useState(8)
  const [myPlan, setMyPlan] = useState({ breakfast: null, lunch: null, dinner: null })
  const [dietPlan, setDietPlan] = useState(null)
  const [mealSearchQuery, setMealSearchQuery] = useState('')

  // Full Indian Food Data from CSV
  const indianFoodData = {
    breakfast: FULL_INDIAN_FOOD_DATA.slice(30, 45), // Sample for defaults
    lunch: FULL_INDIAN_FOOD_DATA.slice(90, 110),
    dinner: FULL_INDIAN_FOOD_DATA.slice(110, 130)
  }

  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)
  const gridRef = useRef(null)
  const headerRef = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    // Background orb animations
    gsap.to(orb1Ref.current, { x: 70, y: -50, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(orb2Ref.current, { x: -60, y: 70, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
    gsap.to(orb3Ref.current, { x: 50, y: 60, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 })
    gsap.to(gridRef.current, { opacity: isToggled ? 0.06 : 0.04, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    // Page entrance
    gsap.fromTo(headerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
    gsap.fromTo(mainRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')

    // Initial Data Fetch
    fetchFitnessProfile()
    fetchWorkouts()
    fetchDietPlan()
    
    // Track activity for EatFit
    const logEatFitVisit = async () => {
      const { logActivity } = await import('../utils/activityLogger')
      await logActivity('eatfit', 'Visited EatFit Dashboard')
    }
    logEatFitVisit()
  }, [navigate])

  // --- Fitness Logic ---

  const fetchFitnessProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/fitness/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setUserProfile(response.data)
        if (response.data.selectedDay) {
          setCurrentDay(response.data.selectedDay === 'Today' ? new Date().toLocaleDateString('en-US', { weekday: 'short' }) : response.data.selectedDay)
        }
      }
    } catch (error) {
      console.error('Error fetching fitness profile:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/fitness/workouts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWorkouts(response.data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE_URL}/api/fitness/profile`, {
        weight: parseFloat(userProfile.weight),
        height: parseFloat(userProfile.height),
        age: parseInt(userProfile.age),
        selectedDay: userProfile.selectedDay || 'Today'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setUserProfile(response.data)
        if (response.data.selectedDay) {
          setCurrentDay(response.data.selectedDay === 'Today' 
            ? new Date().toLocaleDateString('en-US', { weekday: 'short' }) 
            : response.data.selectedDay
          )
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const submitProfile = async () => {
    if (!userProfile.weight || !userProfile.height || !userProfile.age) {
      alert('Please fill in all profile fields')
      return
    }
    await saveProfile()
    alert('Profile saved successfully!')
  }

  const getPersonalizedWorkouts = () => {
    if (!userProfile.weight || !userProfile.height) return []
    
    const bmi = (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)
    const weight = parseFloat(userProfile.weight)
    
    if (bmi < 18.5) {
      return [
        { name: 'Light Stretching', duration: 15, calories: Math.round(weight * 0.3), type: 'flexibility', icon: '🤸', 
          description: 'Gentle stretches to improve flexibility and blood circulation.',
          instructions: ['Sit or stand comfortably', 'Stretch neck side to side', 'Roll shoulders backward', 'Stretch arms across chest', 'Hold each stretch 30 seconds'] },
        { name: 'Walking', duration: 20, calories: Math.round(weight * 0.8), type: 'cardio', icon: '🚶',
          description: 'Light cardio exercise. Walk at a comfortable pace.',
          instructions: ['Start with 5-minute warm-up', 'Walk at comfortable pace', 'Swing arms naturally', 'Breathe steadily'] },
        { name: 'Bodyweight Squats', duration: 10, calories: Math.round(weight * 0.5), type: 'strength', icon: '🦵',
          description: '3 sets of 8-10 reps.',
          instructions: ['Stand with feet shoulder-width apart', 'Lower body like sitting in chair', 'Keep chest up', 'Push through heels to stand'] },
        { name: 'Yoga', duration: 25, calories: Math.round(weight * 0.4), type: 'flexibility', icon: '🧘',
          description: 'Focusing on breathing and flexibility.',
          instructions: ['Start in mountain pose', 'Move through cat-cow', 'Hold downward dog', 'End with deep breathing'] }
      ]
    } else if (bmi >= 18.5 && bmi < 25) {
      return [
        { name: 'Push-ups', duration: 15, calories: Math.round(weight * 0.6), type: 'strength', icon: '💪',
          description: '3 sets of 10-15 reps.',
          instructions: ['Start in plank position', 'Lower chest to ground', 'Push back up', 'Modify on knees if needed'] },
        { name: 'Jumping Jacks', duration: 12, calories: Math.round(weight * 0.7), type: 'cardio', icon: '🏃',
          description: 'Great cardio warm-up.',
          instructions: ['Stand with feet together', 'Jump feet apart', 'Raise arms overhead', 'Jump back to start'] },
        { name: 'Plank', duration: 8, calories: Math.round(weight * 0.4), type: 'core', icon: '🧘',
          description: 'Start with 30-second holds.',
          instructions: ['Start on forearms and toes', 'Keep body in straight line', 'Engage core muscles', 'Hold for 30 seconds'] },
        { name: 'Burpees', duration: 10, calories: Math.round(weight * 0.9), type: 'cardio', icon: '🔥',
          description: 'High intensity!',
          instructions: ['Squat down, hands on floor', 'Jump back to plank', 'Do one push-up', 'Jump feet forward', 'Jump up'] },
        { name: 'Mountain Climbers', duration: 12, calories: Math.round(weight * 0.8), type: 'cardio', icon: '⛰️',
          description: 'High intensity core and cardio.',
          instructions: ['Start in plank position', 'Bring knees to chest rapidly', 'Keep back flat', 'Engage core'] }
      ]
    } else {
      return [
        { name: 'Brisk Walking', duration: 25, calories: Math.round(weight * 0.6), type: 'cardio', icon: '🚶',
          description: 'Low impact cardio that\'s easy on joints.',
          instructions: ['Start with gentle warm-up', 'Walk at brisk pace', 'Pump arms', 'Cool down with slow walk'] },
        { name: 'Wall Push-ups', duration: 12, calories: Math.round(weight * 0.4), type: 'strength', icon: '💪',
          description: 'Stand arm\'s length from wall.',
          instructions: ['Place palms flat on wall', 'Lean body toward wall', 'Push back to start'] },
        { name: 'Chair Exercises', duration: 15, calories: Math.round(weight * 0.3), type: 'strength', icon: '🪑',
          description: 'Perfect for limited mobility.',
          instructions: ['Sit up straight', 'Do arm circles', 'Extend legs one at a time', 'March in place while seated'] },
        { name: 'Swimming', duration: 20, calories: Math.round(weight * 1.0), type: 'cardio', icon: '🏊',
          description: 'Full-body, low-impact exercise.',
          instructions: ['Alternate strokes', 'Focus on breathing', 'Take breaks as needed'] },
        { name: 'Low Impact Cardio', duration: 18, calories: Math.round(weight * 0.5), type: 'cardio', icon: '❤️',
          description: 'Gentle movements easy on joints.',
          instructions: ['Step-touches side to side', 'Gentle arm swings', 'March in place'] }
      ]
    }
  }

  const addWorkout = async (workout) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/api/fitness/workouts`, workout, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchWorkouts()
    } catch (error) {
      console.error('Error adding workout:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const addToToday = async (workout) => {
    const newWorkout = {
      ...workout,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      id: Date.now()
    }
    setWorkouts(prev => [...prev, newWorkout])
    await addWorkout(newWorkout)
  }

  const toggleWorkout = async (id) => {
    try {
      const workout = workouts.find(w => w.id === id)
      setWorkouts(prev => prev.map(w => w.id === id ? { ...w, completed: !w.completed } : w))
      
      const token = localStorage.getItem('token')
      await axios.patch(`${API_BASE_URL}/api/fitness/workouts/${id}`, {
        completed: !workout.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      fetchWorkouts()
    } catch (error) {
      console.error('Error toggling workout:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const removeWorkout = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/api/fitness/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchWorkouts()
    } catch (error) {
      console.error('Error removing workout:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const getWeeklyProgress = () => {
    const completedWorkouts = workouts.filter(w => w.completed)
    const totalMinutes = completedWorkouts.reduce((sum, w) => sum + w.duration, 0)
    return Math.min((totalMinutes / 60) * 100, 100)
  }

  const totalBurnedCalories = workouts.filter(w => w.completed).reduce((sum, w) => sum + w.calories, 0)

  // --- Diet Logic ---

  const fetchDietPlan = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/diet/plan`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setDietPlan(response.data)
        setWaterIntake(response.data.waterIntake || 0)
        const planMeals = { breakfast: null, lunch: null, dinner: null }
        response.data.meals?.forEach(meal => {
          planMeals[meal.type] = meal
        })
        setMyPlan(planMeals)
      }
    } catch (error) {
      console.error('Error fetching diet plan:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const updateWaterIntake = async (amount) => {
    const newAmount = Math.max(0, Math.min(dailyWaterGoal, waterIntake + amount))
    setWaterIntake(newAmount)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/api/diet/plan`, {
        waterIntake: newAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDietPlan()
    } catch (error) {
      console.error('Error updating water intake:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const mealPlans = {
    breakfast: [
      ...indianFoodData.breakfast,
      { name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 58, fat: 6, mood: 'energizing' },
      { name: 'Greek Yogurt Parfait', calories: 280, protein: 20, carbs: 35, fat: 8, mood: 'calming' },
      { name: 'Avocado Toast', calories: 350, protein: 10, carbs: 30, fat: 22, mood: 'focus' },
      { name: 'Smoothie Bowl', calories: 290, protein: 8, carbs: 45, fat: 12, mood: 'refreshing' },
      { name: 'Chia Pudding', calories: 260, protein: 9, carbs: 28, fat: 15, mood: 'energizing' },
      { name: 'Veggie Scramble', calories: 310, protein: 14, carbs: 20, fat: 18, mood: 'satisfying' },
      { name: 'Fruit & Nut Bowl', calories: 340, protein: 11, carbs: 42, fat: 16, mood: 'uplifting' },
      { name: 'Green Smoothie', calories: 250, protein: 7, carbs: 38, fat: 8, mood: 'cleansing' }
    ],
    lunch: [
      ...indianFoodData.lunch,
      { name: 'Quinoa Buddha Bowl', calories: 450, protein: 18, carbs: 65, fat: 15, mood: 'balanced' },
      { name: 'Grilled Chicken Salad', calories: 380, protein: 35, carbs: 20, fat: 18, mood: 'energizing' },
      { name: 'Lentil Soup', calories: 320, protein: 16, carbs: 50, fat: 8, mood: 'comforting' },
      { name: 'Mediterranean Wrap', calories: 420, protein: 15, carbs: 55, fat: 16, mood: 'satisfying' },
      { name: 'Chickpea Curry', calories: 380, protein: 17, carbs: 48, fat: 14, mood: 'warming' },
      { name: 'Caprese Salad', calories: 340, protein: 12, carbs: 25, fat: 22, mood: 'light' },
      { name: 'Veggie Burger', calories: 410, protein: 19, carbs: 45, fat: 18, mood: 'hearty' },
      { name: 'Stuffed Bell Peppers', calories: 360, protein: 14, carbs: 40, fat: 16, mood: 'nourishing' },
      { name: 'Spinach & Feta Salad', calories: 320, protein: 13, carbs: 22, fat: 20, mood: 'fresh' }
    ],
    dinner: [
      ...indianFoodData.dinner,
      { name: 'Salmon with Vegetables', calories: 420, protein: 30, carbs: 25, fat: 22, mood: 'relaxing' },
      { name: 'Vegetable Stir Fry', calories: 350, protein: 12, carbs: 45, fat: 14, mood: 'light' },
      { name: 'Turkey Meatballs', calories: 380, protein: 28, carbs: 20, fat: 20, mood: 'satisfying' },
      { name: 'Eggplant Parmesan', calories: 390, protein: 16, carbs: 35, fat: 22, mood: 'comforting' },
      { name: 'Mushroom Risotto', calories: 410, protein: 14, carbs: 52, fat: 16, mood: 'creamy' },
      { name: 'Zucchini Noodles', calories: 280, protein: 10, carbs: 28, fat: 15, mood: 'light' },
      { name: 'Ratatouille', calories: 320, protein: 8, carbs: 38, fat: 14, mood: 'rustic' },
      { name: 'Cauliflower Steaks', calories: 300, protein: 12, carbs: 25, fat: 18, mood: 'elegant' },
      { name: 'Veggie Pasta', calories: 440, protein: 15, carbs: 62, fat: 16, mood: 'hearty' },
      { name: 'Stuffed Portobello', calories: 330, protein: 13, carbs: 22, fat: 20, mood: 'savory' }
    ]
  }

  const moodFoods = [
    { category: 'Stress Relief', foods: ['Dark Chocolate', 'Green Tea', 'Blueberries', 'Almonds'], color: 'bg-blue-100' },
    { category: 'Energy Boost', foods: ['Bananas', 'Sweet Potatoes', 'Spinach', 'Eggs'], color: 'bg-yellow-100' },
    { category: 'Focus Enhancement', foods: ['Fatty Fish', 'Walnuts', 'Broccoli', 'Coffee'], color: 'bg-green-100' },
    { category: 'Mood Stabilizer', foods: ['Yogurt', 'Oats', 'Turkey', 'Beans'], color: 'bg-purple-100' }
  ]

  const addToPlan = async (meal, mealType) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/api/diet/meals`, {
        ...meal,
        type: mealType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMyPlan(prev => ({ ...prev, [mealType]: meal }))
    } catch (error) {
      console.error('Error adding meal to plan:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const removeFromPlan = async (mealType) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/api/diet/meals/type/${mealType}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMyPlan(prev => ({ ...prev, [mealType]: null }))
    } catch (error) {
      console.error('Error removing meal from plan:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const getNutritionalTotals = () => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
    Object.values(myPlan).forEach(meal => {
      if (meal) {
        totals.calories += Number(meal.calories || 0)
        totals.protein += Number(meal.protein || 0)
        totals.carbs += Number(meal.carbs || 0)
        totals.fat += Number(meal.fat || 0)
      }
    })
    return totals
  }

  // --- Rendering Helpers ---

  const renderFitnessContent = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
        {['profile', 'dashboard', 'workouts', 'progress'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFitnessActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 capitalize ${
              fitnessActiveTab === tab
                ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                : isToggled ? 'text-gray-300 hover:bg-gray-700/20' : 'text-gray-700 hover:bg-gray-200/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {fitnessActiveTab === 'profile' && (
        <div className={`p-6 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
          <h3 className={`text-xl font-bold mb-6 ${isToggled ? 'text-gray-300' : 'text-gray-700'}`}>Your Fitness Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['weight', 'height', 'age'].map(field => (
              <div key={field}>
                <label className={`block text-sm font-medium mb-2 capitalize ${isToggled ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field === 'weight' ? 'Weight (kg)' : field === 'height' ? 'Height (cm)' : 'Age'}
                </label>
                <input
                  type="number"
                  value={userProfile[field] || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, [field]: e.target.value }))}
                  onBlur={saveProfile}
                  className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                    isToggled 
                      ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-cyan-500' 
                      : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-400'
                  }`}
                  placeholder={`Enter your ${field}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${isToggled ? 'text-gray-300' : 'text-gray-700'}`}>Target Day</label>
            <select
              value={userProfile.selectedDay}
              onChange={(e) => {
                const newDay = e.target.value
                setUserProfile(prev => ({ ...prev, selectedDay: newDay }))
                setCurrentDay(newDay === 'Today' ? new Date().toLocaleDateString('en-US', { weekday: 'short' }) : newDay)
              }}
              className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                isToggled ? 'bg-gray-700/40 border-gray-600/30 text-gray-300' : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              {['Today', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <button onClick={submitProfile} className={`w-full mt-6 py-3 rounded-lg font-bold transition-all ${isToggled ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'}`}>Save Profile</button>
          {userProfile.weight && userProfile.height && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className={isToggled ? 'text-gray-400' : 'text-gray-600'}>Your BMI</span>
                <span className={isToggled ? 'text-cyan-400 text-xl' : 'text-cyan-600 text-xl'}>{(userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {fitnessActiveTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className={`font-bold ${isToggled ? 'text-gray-300' : 'text-gray-700'}`}>Calories Burned</h4>
                <span className="text-2xl">🔥</span>
              </div>
              <p className={`text-3xl font-bold ${isToggled ? 'text-white' : 'text-gray-900'}`}>{totalBurnedCalories}</p>
            </div>
            <div className={`p-6 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className={`font-bold ${isToggled ? 'text-gray-300' : 'text-gray-700'}`}>Active Time</h4>
                <span className="text-2xl">⏱️</span>
              </div>
              <p className={`text-3xl font-bold ${isToggled ? 'text-white' : 'text-gray-900'}`}>
                {workouts.filter(w => w.completed).reduce((sum, w) => sum + w.duration, 0)} min
              </p>
            </div>
          </div>
          <div className={`p-6 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isToggled ? 'text-gray-300' : 'text-gray-700'}`}>Today's Workouts ({currentDay})</h3>
            <div className="space-y-4">
              {workouts.length > 0 ? workouts.map(workout => (
                <div key={workout.id} className={`p-4 rounded-xl border-2 transition-all ${
                  workout.completed ? 'border-green-500/50 bg-green-500/5' : isToggled ? 'border-gray-700/50 bg-gray-700/20' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleWorkout(workout.id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${workout.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                        {workout.completed && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
                      </button>
                      <div>
                        <p className={`font-bold ${workout.completed ? 'opacity-50 line-through' : ''} ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>{workout.name}</p>
                        <p className="text-xs text-gray-500">{workout.duration} min • {workout.calories} cal</p>
                      </div>
                    </div>
                    <button onClick={() => removeWorkout(workout.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-8">No workouts added for today. Check personalized recommendations!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {fitnessActiveTab === 'workouts' && (
        <ExerciseLibrary 
          isToggled={isToggled} 
          onAddWorkout={addToToday} 
        />
      )}

      {fitnessActiveTab === 'progress' && (
        <div className={`p-6 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
          <h3 className={`text-xl font-bold mb-8 ${isToggled ? 'text-gray-300' : 'text-gray-700'}`}>Weekly Progress</h3>
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
              const isToday = new Date().toLocaleDateString('en-US', { weekday: 'short' }) === day
              const progress = isToday ? getWeeklyProgress() : 0
              return (
                <div key={day} className="text-center">
                  <div className={`h-24 sm:h-32 w-4 sm:w-6 mx-auto rounded-full ${isToggled ? 'bg-gray-700/50' : 'bg-gray-100'} relative overflow-hidden`}>
                    <div className="absolute bottom-0 w-full bg-cyan-500 transition-all duration-1000" style={{height: `${progress}%`}}/>
                  </div>
                  <p className={`text-[10px] sm:text-xs mt-2 font-bold ${isToday ? 'text-cyan-500' : isToggled ? 'text-gray-500' : 'text-gray-400'}`}>{day}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  const renderDietContent = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Diet sub-navigation */}
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
        {['planner', 'nutrition', 'mood-foods'].map((tab) => (
          <button
            key={tab}
            onClick={() => setDietActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 capitalize ${
              dietActiveTab === tab
                ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                : isToggled ? 'text-gray-300 hover:bg-gray-700/20' : 'text-gray-700 hover:bg-gray-200/20'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {dietActiveTab === 'planner' && (
        <div className="space-y-8">
          <div className={`p-6 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
            <h3 className={`text-xl font-bold mb-6 ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>Nutrition Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {['breakfast', 'lunch', 'dinner'].map(mealType => (
                <div key={mealType} className={`p-4 rounded-2xl border-2 border-dashed ${myPlan[mealType] ? 'border-cyan-500/30' : 'border-gray-400/20'}`}>
                  <h4 className="font-bold capitalize mb-4 text-sm text-cyan-500">{mealType}</h4>
                  {myPlan[mealType] ? (
                    <div className="space-y-2">
                      <p className={`font-bold ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>{myPlan[mealType].name}</p>
                      <p className="text-xs text-gray-500">{myPlan[mealType].calories} Calories</p>
                      <button onClick={() => removeFromPlan(mealType)} className="text-xs text-red-500 font-bold hover:underline">Remove</button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No meal added</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
            <h3 className={`text-xl font-bold mb-6 ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>Hydration Tracker</h3>
            <div className="flex items-center gap-6">
              <div className="flex gap-2 flex-1">
                {[...Array(dailyWaterGoal)].map((_, i) => (
                  <div key={i} className={`h-12 flex-1 rounded-xl transition-all duration-500 ${i < waterIntake ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : (isToggled ? 'bg-gray-700' : 'bg-gray-100')}`}/>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateWaterIntake(-1)} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-300">-</button>
                <button onClick={() => updateWaterIntake(1)} className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600">+</button>
              </div>
            </div>
            <p className="mt-4 text-sm text-center font-medium text-gray-500">{waterIntake} of {dailyWaterGoal} glasses daily</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex gap-4 overflow-x-auto flex-1 pb-4 custom-scrollbar">
              {['breakfast', 'lunch', 'dinner'].map(m => (
                <button key={m} onClick={() => setSelectedMeal(m)} className={`px-6 py-2 rounded-full font-bold capitalize transition-all whitespace-nowrap ${selectedMeal === m ? 'bg-cyan-500 text-white shadow-lg' : 'bg-white text-gray-500'}`}>{m}</button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-80 mb-4">
              <input 
                type="text" 
                placeholder="Search 1000+ Indian dishes..."
                value={mealSearchQuery}
                onChange={(e) => setMealSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-full text-sm border transition-all ${isToggled ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-200 text-gray-800 focus:border-cyan-400'}`}
              />
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(mealSearchQuery.length > 0 ? FULL_INDIAN_FOOD_DATA : mealPlans[selectedMeal])
              .filter(meal => meal.name.toLowerCase().includes(mealSearchQuery.toLowerCase()))
              .slice(0, 40) // Limit display for performance
              .map((meal, index) => (
              <div key={index} className={`p-5 rounded-2xl group relative overflow-hidden transition-all hover:-translate-y-1 ${isToggled ? 'bg-gray-800/60' : 'bg-white/90 shadow-sm'}`}>
                <div className="relative z-10">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase mb-3 inline-block ${
                    meal.mood === 'energizing' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{meal.mood}</span>
                  <h4 className={`font-bold mb-4 line-clamp-1 ${isToggled ? 'text-gray-100' : 'text-gray-800'}`}>{meal.name}</h4>
                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-xs text-gray-500"><span>Cal</span><span className="font-bold">{meal.calories}</span></div>
                    <div className="flex justify-between text-xs text-gray-500"><span>Prot</span><span className="font-bold">{meal.protein}g</span></div>
                  </div>
                  <button onClick={() => addToPlan(meal, selectedMeal)} className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all opacity-0 group-hover:opacity-100">Add Meal</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dietActiveTab === 'nutrition' && (() => {
        const totals = getNutritionalTotals()
        return (
          <div className={`p-8 rounded-2xl shadow-lg ${isToggled ? 'bg-gray-800/60' : 'bg-white/90'}`}>
            <h3 className={`text-xl font-bold mb-10 text-center ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>Nutritional Balance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
              {[
                { label: 'Calories', current: Math.round(totals.calories), goal: 2000, color: '#ef4444', unit: 'kcal' },
                { label: 'Protein', current: Math.round(totals.protein), goal: 120, color: '#3b82f6', unit: 'g' },
                { label: 'Carbs', current: Math.round(totals.carbs), goal: 250, color: '#10b981', unit: 'g' },
                { label: 'Fat', current: Math.round(totals.fat), goal: 80, color: '#f59e0b', unit: 'g' }
              ].map((n, i) => {
                const perc = Math.min(100, (n.current / n.goal) * 100)
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke={isToggled ? '#374151' : '#f3f4f6'} strokeWidth="8"/>
                        <circle cx="48" cy="48" r="40" fill="none" stroke={n.color} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - perc/100)} strokeLinecap="round" className="transition-all duration-1000"/>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-bold text-xs">{Math.round(perc)}%</span>
                        <span className="text-[8px] text-gray-500">{n.current}{n.unit}</span>
                      </div>
                    </div>
                    <span className={`font-bold ${isToggled ? 'text-gray-300' : 'text-gray-600'}`}>{n.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {dietActiveTab === 'mood-foods' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {moodFoods.map((m, i) => (
            <div key={i} className={`p-6 rounded-2xl relative overflow-hidden ${isToggled ? 'bg-gray-800/60' : 'bg-white/90 shadow-sm'}`}>
              <h4 className={`font-bold text-lg mb-6 flex items-center gap-2 ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>
                <span className="w-2 h-6 bg-cyan-500 rounded-full"/>{m.category}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {m.foods.map((f, j) => (
                  <div key={j} className={`p-3 rounded-xl text-center text-xs font-bold transition-all ${isToggled ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{f}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${isToggled ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h1 className={`text-2xl font-black  tracking-tighter ${isToggled ? 'text-white' : 'text-gray-900'}`}>EAT<span className="text-cyan-500">FIT</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Fitness & Nutrition Unified</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center bg-gray-500/10 rounded-full p-1 border border-gray-500/10">
            <button 
              onClick={() => setMainActiveTab('fitness')}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${mainActiveTab === 'fitness' ? 'bg-white text-gray-900 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Fitness
            </button>
            <button 
              onClick={() => setMainActiveTab('diet')}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${mainActiveTab === 'diet' ? 'bg-white text-gray-900 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Diet
            </button>
          </div>
          <div className="flex items-center gap-4">
             <div className="lg:hidden text-xs font-bold text-cyan-500 uppercase">{mainActiveTab}</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main ref={mainRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex gap-2 mb-8 bg-black/5 p-1 rounded-2xl">
          <button onClick={() => setMainActiveTab('fitness')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mainActiveTab === 'fitness' ? (isToggled ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-sm') : 'text-gray-500'}`}>Fitness</button>
          <button onClick={() => setMainActiveTab('diet')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mainActiveTab === 'diet' ? (isToggled ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-sm') : 'text-gray-500'}`}>Diet</button>
        </div>

        {mainActiveTab === 'fitness' ? renderFitnessContent() : renderDietContent()}
      </main>

      {/* Style Overrides and Animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  )
}

export default EatFit 
