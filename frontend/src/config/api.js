const removeTrailingSlash = (url) => url.replace(/\/$/, '');

const API_BASE_URL = removeTrailingSlash(
  import.meta.env.VITE_API_URL || 'http://localhost:8000',
);

const FRONTEND_URL = removeTrailingSlash(
  import.meta.env.VITE_FRONTEND_URL || window.location.origin,
);

export { API_BASE_URL, FRONTEND_URL };
