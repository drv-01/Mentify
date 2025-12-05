const express = require('express')
const router = express.Router()
const { getCustomMentors, createCustomMentor, deleteCustomMentor, logMentorConnection } = require('../controllers/mentorshipController')
const authMiddleware = require('../middleware/authMiddleware')

// All routes require authentication
router.use(authMiddleware)

// GET /api/mentorship/custom - Get all custom mentors for user
router.get('/custom', getCustomMentors)

// POST /api/mentorship/custom - Create new custom mentor
router.post('/custom', createCustomMentor)

// DELETE /api/mentorship/custom/:id - Delete custom mentor
router.delete('/custom/:id', deleteCustomMentor)

// POST /api/mentorship/connect - Log mentor connection
router.post('/connect', logMentorConnection)

module.exports = router