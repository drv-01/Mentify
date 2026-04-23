const isDev = import.meta.env.DEV;

const API_BASE_URL = isDev 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  : (import.meta.env.VITE_PROD_API_URL || 'https://mentify.onrender.com');

const FRONTEND_URL = isDev
  ? (import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173')
  : (import.meta.env.VITE_PROD_FRONTEND_URL || 'https://mentifyapp.vercel.app');

export { API_BASE_URL, FRONTEND_URL };