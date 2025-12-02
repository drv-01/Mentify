const API_BASE_URL = import.meta.env.MODE === 'production'
  ? (import.meta.env.VITE_PROD_API_URL || 'https://mentify.onrender.com')
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000')

const FRONTEND_URL = import.meta.env.MODE === 'production'
  ? (import.meta.env.VITE_PROD_FRONTEND_URL || 'https://mentifyapp.vercel.app')
  : (import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173')

export { API_BASE_URL, FRONTEND_URL }