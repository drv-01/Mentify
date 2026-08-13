const trimTrailingSlash = (value) => value.replace(/\/$/, '');

const readUrl = (name, fallback) => {
  const value = process.env[name] || fallback;

  try {
    return trimTrailingSlash(new URL(value).origin);
  } catch {
    throw new Error(`${name} must be an absolute URL`);
  }
};

const isProduction = process.env.NODE_ENV === 'production';

const getBackendUrl = () => readUrl(
  'BACKEND_URL',
  `http://localhost:${process.env.PORT || 8000}`,
);

const getFrontendUrl = () => readUrl(
  'FRONTEND_URL',
  'http://localhost:5173',
);

const getAllowedOrigins = () => {
  const configuredOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([getFrontendUrl(), ...configuredOrigins.map((origin) => trimTrailingSlash(origin))]);
};

module.exports = { getBackendUrl, getFrontendUrl, getAllowedOrigins, isProduction };
