import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const API_URL = API_BASE_URL

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