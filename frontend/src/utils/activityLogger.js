import axios from 'axios'

const API_URL = import.meta.env.VITE_PROD_API_URL || 'https://mentify.onrender.com'

export const logActivity = async (type, action) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    await axios.post(`${API_URL}/api/activities`, {
      type,
      action,
      timestamp: new Date().toLocaleString()
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}