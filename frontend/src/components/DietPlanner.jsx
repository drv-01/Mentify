import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const DietPlanner = () => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [activeTab, setActiveTab] = useState('planner')
  const [selectedMeal, setSelectedMeal] = useState('breakfast')
  const [waterIntake, setWaterIntake] = useState(0)
  const [dailyGoal] = useState(8)
  const [myPlan, setMyPlan] = useState({ breakfast: null, lunch: null, dinner: null })
  const [dietPlan, setDietPlan] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchDietPlan()
    
    // Track page visit
    const activity = {
      id: Date.now(),
      type: 'diet',
      action: 'Visited Diet Planner',
      timestamp: new Date().toLocaleString()
    }
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
  }, [navigate])

  const fetchDietPlan = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/diet/plan`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setDietPlan(response.data)
        setWaterIntake(response.data.waterIntake || 0)
        // Convert meals to myPlan format
        const planMeals = { breakfast: null, lunch: null, dinner: null }
        response.data.meals?.forEach(meal => {
          planMeals[meal.type] = meal
        })
        setMyPlan(planMeals)
      }
    } catch (error) {
      console.error('Error fetching diet plan:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }

  const mealPlans = {
    breakfast: [
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

  const addWater = async () => {
    if (waterIntake < dailyGoal) {
      const newAmount = waterIntake + 1
      setWaterIntake(newAmount)
      await updateWaterIntake(newAmount)
    }
  }

  const removeWater = async () => {
    if (waterIntake > 0) {
      const newAmount = waterIntake - 1
      setWaterIntake(newAmount)
      await updateWaterIntake(newAmount)
    }
  }

  const updateWaterIntake = async (amount) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      await axios.post(`${import.meta.env.VITE_API_URL}/api/diet/plan`, {
        waterIntake: amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error updating water intake:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }

  const addToPlan = async (meal, mealType) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      await axios.post(`${import.meta.env.VITE_API_URL}/api/diet/meals`, {
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        type: mealType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMyPlan(prev => ({ ...prev, [mealType]: meal }))
      fetchDietPlan()
    } catch (error) {
      console.error('Error adding meal to plan:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }

  const removeFromPlan = async (mealType) => {
    try {
      const mealToRemove = dietPlan?.meals?.find(meal => meal.type === mealType)
      if (mealToRemove) {
        const token = localStorage.getItem('token')
        if (!token) return
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/diet/meals/${mealToRemove.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setMyPlan(prev => ({ ...prev, [mealType]: null }))
      fetchDietPlan()
    } catch (error) {
      console.error('Error removing meal from plan:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isToggled 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700' 
        : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'
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
              }`}>Diet Planner</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {['planner', 'nutrition', 'mood-foods'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                activeTab === tab
                  ? isToggled 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-900'
                  : isToggled
                    ? 'text-gray-300 hover:bg-gray-700/20'
                    : 'text-gray-700 hover:bg-gray-200/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Meal Planner Tab */}
        {activeTab === 'planner' && (
          <div className="space-y-8">
            {/* My Daily Plan */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>My Daily Plan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                  <div key={mealType} className={`p-4 rounded-lg border-2 border-dashed ${
                    myPlan[mealType] 
                      ? isToggled ? 'border-gray-700 bg-gray-700/10' : 'border-gray-200 bg-gray-200/10'
                      : isToggled ? 'border-gray-600/30' : 'border-gray-700/30'
                  }`}>
                    <h4 className={`font-semibold capitalize mb-2 ${
                      isToggled ? 'text-gray-300' : 'text-gray-700'
                    }`}>{mealType}</h4>
                    {myPlan[mealType] ? (
                      <div>
                        <p className={`font-medium mb-1 ${
                          isToggled ? 'text-gray-300' : 'text-gray-800'
                        }`}>{myPlan[mealType].name}</p>
                        <p className={`text-sm mb-2 ${
                          isToggled ? 'text-gray-400' : 'text-gray-600'
                        }`}>{myPlan[mealType].calories} calories</p>
                        <button 
                          onClick={() => removeFromPlan(mealType)}
                          className="text-red-500 text-sm hover:text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className={`text-sm ${
                        isToggled ? 'text-gray-500' : 'text-gray-500'
                      }`}>No meal selected</p>
                    )}
                  </div>
                ))}
              </div>
              {(myPlan.breakfast || myPlan.lunch || myPlan.dinner) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      isToggled ? 'text-gray-300' : 'text-gray-800'
                    }`}>Total Calories:</span>
                    <span className={`font-bold ${
                      isToggled ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {(myPlan.breakfast?.calories || 0) + (myPlan.lunch?.calories || 0) + (myPlan.dinner?.calories || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Water Intake Tracker */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Daily Water Intake</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={removeWater}
                  className={`p-2 rounded-full ${
                    isToggled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } text-white transition-all duration-300`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <div className="flex space-x-2">
                  {[...Array(dailyGoal)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-10 rounded-full border-2 transition-all duration-300 ${
                        i < waterIntake
                          ? isToggled ? 'bg-gray-700 border-gray-700' : 'bg-gray-200 border-gray-200'
                          : isToggled ? 'border-gray-600/30' : 'border-gray-700/30'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={addWater}
                  className={`p-2 rounded-full ${
                    isToggled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } text-white transition-all duration-300`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <span className={`text-sm font-medium ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>{waterIntake}/{dailyGoal} glasses</span>
              </div>
            </div>

            {/* Meal Selection */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
              {['breakfast', 'lunch', 'dinner'].map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base capitalize transition-all duration-300 ${
                    selectedMeal === meal
                      ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                      : isToggled ? 'text-gray-300 hover:bg-gray-700/20' : 'text-gray-700 hover:bg-gray-200/20'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>

            {/* Meal Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mealPlans[selectedMeal].map((meal, index) => (
                <div
                  key={index}
                  className={`p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                    isToggled ? 'bg-gray-800/60 hover:bg-gray-800/80' : 'bg-white/90 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-lg font-bold ${
                      isToggled ? 'text-gray-300' : 'text-gray-700'
                    }`}>{meal.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      meal.mood === 'energizing' ? 'bg-yellow-100 text-yellow-800' :
                      meal.mood === 'calming' ? 'bg-blue-100 text-blue-800' :
                      meal.mood === 'focus' ? 'bg-green-100 text-green-800' :
                      meal.mood === 'balanced' ? 'bg-purple-100 text-purple-800' :
                      meal.mood === 'comforting' ? 'bg-orange-100 text-orange-800' :
                      meal.mood === 'relaxing' ? 'bg-indigo-100 text-indigo-800' :
                      meal.mood === 'light' ? 'bg-teal-100 text-teal-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>{meal.mood}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>Calories</span>
                      <span className={`text-sm font-medium ${isToggled ? 'text-gray-300' : 'text-gray-800'}`}>{meal.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>Protein</span>
                      <span className={`text-sm font-medium ${isToggled ? 'text-gray-300' : 'text-gray-800'}`}>{meal.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>Carbs</span>
                      <span className={`text-sm font-medium ${isToggled ? 'text-gray-300' : 'text-gray-800'}`}>{meal.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>Fat</span>
                      <span className={`text-sm font-medium ${isToggled ? 'text-gray-300' : 'text-gray-800'}`}>{meal.fat}g</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToPlan(meal, selectedMeal)}
                    className={`w-full mt-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isToggled 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}>
                    Add to Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-2xl shadow-lg ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Daily Nutrition Goals</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: 'Calories', current: 1650, goal: 2000, unit: 'kcal', color: 'bg-red-500' },
                  { label: 'Protein', current: 85, goal: 120, unit: 'g', color: 'bg-blue-500' },
                  { label: 'Carbs', current: 180, goal: 250, unit: 'g', color: 'bg-green-500' },
                  { label: 'Fat', current: 65, goal: 80, unit: 'g', color: 'bg-yellow-500' }
                ].map((nutrient, index) => {
                  const percentage = (nutrient.current / nutrient.goal) * 100
                  return (
                    <div key={index} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={isToggled ? '#4b5563' : '#e5e7eb'}
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={nutrient.color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-sm font-bold ${
                            isToggled ? 'text-gray-300' : 'text-gray-800'
                          }`}>{Math.round(percentage)}%</span>
                        </div>
                      </div>
                      <h4 className={`font-semibold mb-1 ${
                        isToggled ? 'text-gray-300' : 'text-gray-800'
                      }`}>{nutrient.label}</h4>
                      <p className={`text-sm ${
                        isToggled ? 'text-gray-400' : 'text-gray-600'
                      }`}>{nutrient.current}/{nutrient.goal} {nutrient.unit}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mood Foods Tab */}
        {activeTab === 'mood-foods' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-2xl shadow-lg mb-6 ${
              isToggled ? 'bg-gray-800/60' : 'bg-white/90'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Foods for Mental Wellness</h3>
              <p className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>Discover foods that can naturally boost your mood and mental clarity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {moodFoods.map((category, index) => (
                <div
                  key={index}
                  className={`p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                    isToggled ? 'bg-gray-800/60' : 'bg-white/90'
                  }`}
                >
                  <h4 className={`text-lg font-bold mb-4 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>{category.category}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {category.foods.map((food, foodIndex) => (
                      <div
                        key={foodIndex}
                        className={`p-3 rounded-lg text-center text-sm font-medium ${
                          isToggled ? 'bg-gray-700/20 text-gray-300' : `${category.color} text-gray-800`
                        }`}
                      >
                        {food}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DietPlanner