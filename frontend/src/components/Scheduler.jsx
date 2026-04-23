import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { gsap } from 'gsap'
import { API_BASE_URL } from '../config/api'
import { checkAuthError } from '../utils/auth'

const Scheduler = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [tasks, setTasks] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    dueDate: ''
  })

  const headerRef = useRef(null)
  const statsRef = useRef(null)
  const filtersRef = useRef(null)
  const tasksRef = useRef(null)
  const formRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)
  const gridRef = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    gsap.to(orb1Ref.current, { x: 60, y: -40, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(orb2Ref.current, { x: -50, y: 60, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 })
    gsap.to(orb3Ref.current, { x: 40, y: 50, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 })
    gsap.to(gridRef.current, { opacity: isToggled ? 0.06 : 0.04, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    gsap.fromTo(headerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
    gsap.fromTo(mainRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 })
  }, [])

  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.4)' }
      )
    }
  }, [tasks.length])

  useEffect(() => {
    if (tasksRef.current) {
      gsap.fromTo(
        tasksRef.current.querySelectorAll('.task-item'),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
      )
    }
  }, [filter, tasks])

  useEffect(() => {
    if (showAddForm && formRef.current) {
      gsap.fromTo(formRef.current,
        { y: -20, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }
      )
    }
  }, [showAddForm])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchTasks()

    const activity = {
      id: Date.now(),
      type: 'scheduler',
      action: 'Visited Task Scheduler',
      timestamp: new Date().toLocaleString()
    }
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(response.data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title')
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/api/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const activity = {
        id: Date.now(),
        type: 'scheduler',
        action: `Added task: ${newTask.title}`,
        timestamp: new Date().toLocaleString()
      }
      const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
      const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
      localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
      setNewTask({ title: '', description: '', priority: 'medium', category: 'personal', dueDate: '' })
      setShowAddForm(false)
      fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id)
      const token = localStorage.getItem('token')
      await axios.patch(`${API_BASE_URL}/api/tasks/${id}`, {
        completed: !task.completed
      }, { headers: { Authorization: `Bearer ${token}` } })
      fetchTasks()
    } catch (error) {
      console.error('Error toggling task:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      checkAuthError(error, navigate, setIsAuthenticated)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    if (filter === 'high') return task.priority === 'high'
    return true
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length
    return { total, completed, pending, highPriority }
  }

  const stats = getTaskStats()

  const inputCls = isToggled
    ? 'bg-gray-700/40 border-gray-600/30 text-gray-300 focus:border-cyan-500'
    : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-400'

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
                TASK <span className="text-cyan-500">SCHEDULER</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Organize your day</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 ${
              isToggled ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'
            }`}
          >
            + Add Task
          </button>
        </div>
      </header>

      {/* Main */}
      <main ref={mainRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Quick Stats */}
        {tasks.length > 0 && (
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '📋', value: stats.total, label: 'Total Tasks' },
              { icon: '⏳', value: stats.pending, label: 'Pending' },
              { icon: '✅', value: stats.completed, label: 'Completed' },
              { icon: '🔥', value: stats.highPriority, label: 'High Priority' },
            ].map(({ icon, value, label }) => (
              <div key={label} className={`rounded-2xl shadow-lg p-5 text-center ${
                isToggled ? 'bg-gray-800/60' : 'bg-white/90'
              }`}>
                <div className="text-2xl mb-2">{icon}</div>
                <div className={`text-2xl font-bold ${isToggled ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                <div className={`text-xs font-medium mt-1 ${isToggled ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div ref={filtersRef} className="flex flex-wrap gap-2 mb-8">
          {['all', 'pending', 'completed', 'high'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 capitalize ${
                filter === filterType
                  ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                  : isToggled ? 'text-gray-300 hover:bg-gray-700/20' : 'text-gray-700 hover:bg-gray-200/20'
              }`}
            >
              {filterType === 'high' ? 'High Priority' : filterType}
            </button>
          ))}
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div ref={formRef} className={`rounded-2xl shadow-lg p-6 mb-8 ${
            isToggled ? 'bg-gray-800/60' : 'bg-white/90'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${isToggled ? 'text-white' : 'text-gray-900'}`}>Add New Task</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className={`p-3 border rounded-lg focus:outline-none transition-all ${inputCls}`}
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className={`p-3 border rounded-lg focus:outline-none transition-all ${inputCls}`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                className={`p-3 border rounded-lg focus:outline-none transition-all ${inputCls}`}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className={`p-3 border rounded-lg focus:outline-none transition-all ${inputCls}`}
              />
            </div>
            <textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className={`w-full p-3 border rounded-lg mt-4 focus:outline-none resize-none transition-all placeholder-gray-500 ${inputCls}`}
              rows="3"
            />
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={addTask}
                className={`w-full font-bold py-3 rounded-xl transition-all hover:scale-[1.01] ${
                  isToggled ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'
                }`}
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`w-full font-semibold py-2 rounded-xl transition-all ${
                  isToggled ? 'text-gray-400 hover:bg-gray-700/40' : 'text-gray-600 hover:bg-gray-200/40'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div ref={tasksRef} className={`rounded-2xl shadow-lg p-6 ${
            isToggled ? 'bg-gray-800/60' : 'bg-white/90'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${isToggled ? 'text-white' : 'text-gray-900'}`}>Your Tasks</h3>
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`task-item p-4 rounded-xl border-2 transition-all ${
                  task.completed
                    ? isToggled ? 'border-gray-700/50 bg-gray-700/20 opacity-60' : 'border-gray-100 bg-gray-50 opacity-60'
                    : isToggled ? 'border-gray-700/50 bg-gray-700/20 hover:border-gray-600/50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-gray-400'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`font-bold ${task.completed ? 'line-through' : ''} ${
                          isToggled ? 'text-gray-200' : 'text-gray-800'
                        }`}>{task.title}</p>
                        {task.description && (
                          <p className={`text-sm mt-1 ${isToggled ? 'text-gray-400' : 'text-gray-500'}`}>{task.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getPriorityColor(task.priority)} `}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                            isToggled ? 'bg-cyan-900/40 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
                          }`}>
                            {task.category}
                          </span>
                          {task.dueDate && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              isToggled ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={tasksRef} className={`rounded-2xl shadow-lg p-10 text-center ${
            isToggled ? 'bg-gray-800/60' : 'bg-white/90'
          }`}>
            <div className="text-5xl mb-4">📋</div>
            <h3 className={`text-xl font-bold mb-2 ${isToggled ? 'text-white' : 'text-gray-900'}`}>No Tasks Found</h3>
            <p className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-500'}`}>
              {filter === 'all'
                ? 'Start organizing your day by adding your first task!'
                : `No ${filter} tasks found. Try a different filter or add new tasks.`}
            </p>
          </div>
        )}

        {/* Productivity Tips */}
        {tasks.length === 0 && (
          <div className={`rounded-2xl shadow-lg p-6 mt-6 ${
            isToggled ? 'bg-gray-800/60' : 'bg-white/90'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isToggled ? 'text-gray-200' : 'text-gray-800'}`}>
              <span className="w-2 h-6 bg-cyan-500 rounded-full" />
              Productivity Tips
            </h3>
            <div className={`space-y-2 text-sm ${isToggled ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>• Break large tasks into smaller, manageable chunks</p>
              <p>• Set realistic deadlines and prioritize high-impact tasks</p>
              <p>• Use the Pomodoro Technique: 25 minutes focused work, 5 minutes break</p>
              <p>• Review and update your task list daily</p>
              <p>• Celebrate completed tasks to stay motivated!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Scheduler
