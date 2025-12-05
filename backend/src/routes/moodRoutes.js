const express = require('express')
const router = express.Router()
const { getMoodEntries, createMoodEntry, deleteMoodEntry, testConnection } = require('../controllers/moodController')
const authMiddleware = require('../middleware/authMiddleware')

// All routes require authentication
router.use(authMiddleware)

// GET /api/mood - Get all mood entries for user
router.get('/', getMoodEntries)

// POST /api/mood - Create new mood entry
router.post('/', createMoodEntry)

// DELETE /api/mood/:id - Delete mood entry
router.delete('/:id', deleteMoodEntry)

// GET /api/mood/test - Test database connection
router.get('/test', testConnection)

module.exports = router