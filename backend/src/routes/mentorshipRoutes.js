const express = require('express')
const router = express.Router()
const { logMentorConnection, listCustomMentors, createCustomMentor, deleteCustomMentor } = require('../controllers/mentorshipController')
const authMiddleware = require('../middleware/authMiddleware')

// All routes require authentication
router.use(authMiddleware)

// POST /api/mentorship/connect - Log mentor connection
router.post('/connect', logMentorConnection)
router.get('/custom', listCustomMentors)
router.post('/custom', createCustomMentor)
router.delete('/custom/:id', deleteCustomMentor)

module.exports = router
