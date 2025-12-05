import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Scheduler = () => {
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

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchTasks()
    
    // Track page visit
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(response.data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        alert('Your session has expired. Please log in again.')
        navigate('/login')
      }
    }
  }

  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Track activity
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
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        alert('Your session has expired. Please log in again.')
        navigate('/login')
      }
    }
  }

  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id)
      const token = localStorage.getItem('token')
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
        completed: !task.completed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTasks()
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
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
              }`}>Task Scheduler</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Quick Stats */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className={`rounded-xl shadow p-4 text-center ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-2xl mb-2">📋</div>
              <div className={`text-2xl font-bold ${
                isToggled ? 'text-gray-300' : 'text-gray-800'
              }`}>{stats.total}</div>
              <div className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>Total Tasks</div>
            </div>
            <div className={`rounded-xl shadow p-4 text-center ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-2xl mb-2">⏳</div>
              <div className={`text-2xl font-bold ${
                isToggled ? 'text-gray-300' : 'text-gray-800'
              }`}>{stats.pending}</div>
              <div className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>Pending</div>
            </div>
            <div className={`rounded-xl shadow p-4 text-center ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-2xl mb-2">✅</div>
              <div className={`text-2xl font-bold ${
                isToggled ? 'text-gray-300' : 'text-gray-800'
              }`}>{stats.completed}</div>
              <div className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>Completed</div>
            </div>
            <div className={`rounded-xl shadow p-4 text-center ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-2xl mb-2">🔥</div>
              <div className={`text-2xl font-bold ${
                isToggled ? 'text-gray-300' : 'text-gray-800'
              }`}>{stats.highPriority}</div>
              <div className={`text-sm ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>High Priority</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'completed', 'high'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 capitalize ${
                filter === filterType
                  ? isToggled ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  : isToggled ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filterType === 'high' ? 'High Priority' : filterType}
            </button>
          ))}
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className={`rounded-2xl shadow-lg p-6 mb-6 ${
            isToggled ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>Add New Task</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className={`p-3 border-2 rounded-lg focus:outline-none ${
                  isToggled 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                    : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
                }`}
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className={`p-3 border-2 rounded-lg focus:outline-none ${
                  isToggled 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                    : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
                }`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                className={`p-3 border-2 rounded-lg focus:outline-none ${
                  isToggled 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                    : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
                }`}
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
                className={`p-3 border-2 rounded-lg focus:outline-none ${
                  isToggled 
                    ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500'
                    : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400'
                }`}
              />
            </div>
            <textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className={`w-full p-3 border-2 rounded-lg mt-4 focus:outline-none resize-none ${
                isToggled 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                  : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
              }`}
              rows="3"
            />
            <div className="mt-4">
              <button
                onClick={addTask}
                className={`w-full font-semibold py-3 rounded-lg transition-all mb-2 ${
                  isToggled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`w-full font-semibold py-2 rounded-lg transition-all ${
                  isToggled ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className={`rounded-2xl shadow-lg p-6 ${
            isToggled ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>Your Tasks</h3>
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`border-2 rounded-lg p-4 transition-all ${
                  isToggled ? 'border-gray-700 hover:border-gray-600' : 'border-gray-100 hover:border-gray-200'
                } ${task.completed ? 'opacity-75' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.completed ? 'line-through' : ''} ${
                          isToggled ? 'text-gray-300' : 'text-gray-800'
                        }`}>{task.title}</h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${
                            isToggled ? 'text-gray-400' : 'text-gray-600'
                          }`}>{task.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isToggled ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {task.category}
                          </span>
                          {task.dueDate && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isToggled ? 'bg-gray-600 text-gray-300' : 'bg-purple-100 text-purple-800'
                            }`}>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1"
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
          <div className={`rounded-2xl shadow-lg p-8 text-center ${
            isToggled ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-5xl mb-4">📋</div>
            <h3 className={`text-xl font-bold mb-2 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>No Tasks Found</h3>
            <p className={`${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filter === 'all' 
                ? 'Start organizing your day by adding your first task!' 
                : `No ${filter} tasks found. Try a different filter or add new tasks.`
              }
            </p>
          </div>
        )}

        {/* Productivity Tips */}
        {tasks.length === 0 && (
          <div className={`rounded-2xl shadow-lg p-6 mt-6 ${
            isToggled 
              ? 'bg-linear-to-br from-gray-800 to-gray-700 text-white'
              : 'bg-linear-to-br from-gray-100 to-gray-200 text-gray-900'
          }`}>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              💡 Productivity Tips
            </h3>
            <div className="space-y-2 text-sm">
              <p>• Break large tasks into smaller, manageable chunks</p>
              <p>• Set realistic deadlines and prioritize high-impact tasks</p>
              <p>• Use the Pomodoro Technique: 25 minutes focused work, 5 minutes break</p>
              <p>• Review and update your task list daily</p>
              <p>• Celebrate completed tasks to stay motivated!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Scheduler