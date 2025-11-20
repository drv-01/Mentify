const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_PROD_API_URL 
  : import.meta.env.VITE_API_URL

const FRONTEND_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_PROD_FRONTEND_URL
  : import.meta.env.VITE_FRONTEND_URL

export { API_BASE_URL, FRONTEND_URL }