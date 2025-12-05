import axios from 'axios'

const API_URL = import.meta.env.VITE_PROD_API_URL || 'https://mentify.onrender.com'

export const logActivity = async (type, action) => {
  // Activity logging disabled for hosted environment
  return
}