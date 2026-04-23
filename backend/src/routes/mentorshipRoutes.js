const express = require('express')
const router = express.Router()
const { logMentorConnection } = require('../controllers/mentorshipController')
const authMiddleware = require('../middleware/authMiddleware')

// All routes require authentication
router.use(authMiddleware)

// POST /api/mentorship/connect - Log mentor connection
router.post('/connect', logMentorConnection)

module.exports = router