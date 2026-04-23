import { useState, useEffect } from 'react'
import axios from 'axios'

const EXERCISE_DATA_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

const ExerciseLibrary = ({ isToggled, onAddWorkout }) => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('All')
  const [selectedExercise, setSelectedExercise] = useState(null)

  const muscleGroups = [
    'All', 'abdominals', 'hamstrings', 'adductors', 'quadriceps', 'biceps', 'shoulders', 
    'chest', 'middle back', 'lats', 'triceps', 'traps', 'forearms', 'glutes', 'calves', 'lower back'
  ]

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(EXERCISE_DATA_URL)
        setExercises(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching exercises:', error)
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMuscle = selectedMuscle === 'All' || ex.primaryMuscles.includes(selectedMuscle)
    return matchesSearch && matchesMuscle
  })

  const getImageUrl = (exId, index = 0) => {
    return `${IMAGE_BASE_URL}${exId}/${index}.jpg`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Muscle-Wise Header */}
      <div className="text-center mb-10">
        <h2 className={`text-3xl font-black mb-2 ${isToggled ? 'text-white' : 'text-gray-900'}`}>
          MUSCLE <span className="text-cyan-500">WIKI</span>
        </h2>
        <p className="text-sm text-gray-500 font-medium">Select a muscle group to browse exercises</p>
      </div>

      {/* Muscle-Wise Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mb-8">
        {muscleGroups.map(muscle => (
          <button
            key={muscle}
            onClick={() => setSelectedMuscle(muscle)}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border-2 ${
              selectedMuscle === muscle
                ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10'
                : isToggled 
                  ? 'bg-gray-800/40 border-transparent hover:border-gray-700' 
                  : 'bg-white border-transparent hover:border-gray-100 shadow-sm'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              selectedMuscle === muscle ? 'bg-cyan-500 text-white' : isToggled ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="text-xs font-black">{muscle === 'All' ? '∞' : muscle[0].toUpperCase()}</span>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              selectedMuscle === muscle ? 'text-cyan-500' : isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {muscle}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/5 p-4 rounded-3xl">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search 800+ exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 transition-all ${
              isToggled ? 'bg-gray-800 ring-gray-700 text-gray-200 focus:ring-cyan-500' : 'bg-white ring-gray-200 text-gray-800 focus:ring-cyan-400'
            }`}
          />
          <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExercises.slice(0, 50).map((ex) => (
          <div
            key={ex.id}
            onClick={() => setSelectedExercise(ex)}
            className={`group rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
              isToggled ? 'bg-gray-800/60' : 'bg-white shadow-sm'
            }`}
          >
            <div className="aspect-video relative overflow-hidden bg-gray-900">
              <img
                src={getImageUrl(ex.id)}
                alt={ex.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x225?text=No+Image' }}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-[10px] text-white rounded-md font-bold uppercase">
                  {ex.level}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className={`font-bold text-sm mb-1 line-clamp-1 ${isToggled ? 'text-gray-100' : 'text-gray-800'}`}>
                {ex.name}
              </h4>
              <div className="flex flex-wrap gap-1 mb-3">
                {ex.primaryMuscles.map(m => (
                  <span key={m} className="text-[9px] text-cyan-500 font-bold uppercase">{m}</span>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddWorkout({
                    name: ex.name,
                    duration: 15,
                    calories: 100,
                    type: ex.category || 'strength',
                    icon: '💪'
                  })
                }}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Add to Today
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
            isToggled ? 'bg-gray-900 border border-gray-800' : 'bg-white'
          }`}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b backdrop-blur-xl bg-inherit border-gray-500/10">
              <h3 className={`text-xl font-black tracking-tight ${isToggled ? 'text-white' : 'text-gray-900'}`}>
                {selectedExercise.name}
              </h3>
              <button
                onClick={() => setSelectedExercise(null)}
                className={`p-2 rounded-xl transition-all ${isToggled ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src={getImageUrl(selectedExercise.id, 0)}
                    alt={selectedExercise.name}
                    className="rounded-2xl w-full aspect-square object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image' }}
                  />
                  <img
                    src={getImageUrl(selectedExercise.id, 1)}
                    alt={selectedExercise.name}
                    className="rounded-2xl w-full aspect-square object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image' }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className={`p-3 rounded-2xl flex-1 min-w-[120px] ${isToggled ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Equipment</p>
                    <p className={`text-sm font-bold ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>{selectedExercise.equipment || 'Body Weight'}</p>
                  </div>
                  <div className={`p-3 rounded-2xl flex-1 min-w-[120px] ${isToggled ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Difficulty</p>
                    <p className={`text-sm font-bold ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>{selectedExercise.level}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className={`text-sm font-bold uppercase tracking-widest mb-3 ${isToggled ? 'text-cyan-400' : 'text-cyan-600'}`}>Primary Muscles</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.primaryMuscles.map(m => (
                      <span key={m} className={`px-3 py-1 rounded-full text-xs font-bold ${isToggled ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedExercise.secondaryMuscles?.length > 0 && (
                  <div>
                    <h5 className={`text-sm font-bold uppercase tracking-widest mb-3 ${isToggled ? 'text-gray-400' : 'text-gray-500'}`}>Secondary</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.secondaryMuscles.map(m => (
                        <span key={m} className={`px-3 py-1 rounded-full text-xs font-bold ${isToggled ? 'bg-gray-800/40 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className={`text-sm font-bold uppercase tracking-widest mb-3 ${isToggled ? 'text-cyan-400' : 'text-cyan-600'}`}>Instructions</h5>
                  <div className="space-y-3">
                    {selectedExercise.instructions.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isToggled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                        }`}>
                          {i + 1}
                        </span>
                        <p className={`text-sm leading-relaxed ${isToggled ? 'text-gray-300' : 'text-gray-600'}`}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddWorkout({
                      name: selectedExercise.name,
                      duration: 15,
                      calories: 100,
                      type: selectedExercise.category || 'strength',
                      icon: '💪'
                    })
                    setSelectedExercise(null)
                  }}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  ADD TO WORKOUT PLAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseLibrary
