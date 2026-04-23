const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Auth failed: No Bearer token provided')
      return res.status(401).json({ error: 'Access token required' })
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      console.warn('Auth failed: Token missing from header')
      return res.status(401).json({ error: 'Access token required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Ensure we have a consistent user object structure
    req.user = {
      userId: decoded.userId || decoded.id,
      ...decoded
    }
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', expiredAt: error.expiredAt })
    }
    
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authMiddleware