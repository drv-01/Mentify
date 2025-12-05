const express = require('express')
const router = express.Router()
const {
  getFitnessProfile,
  saveFitnessProfile,
  getWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout
} = require('../controllers/fitnessController')
const authMiddleware = require('../middleware/authMiddleware')

// Apply authentication middleware to all routes
router.use(authMiddleware)

// Fitness profile routes
router.get('/profile', getFitnessProfile)
router.post('/profile', saveFitnessProfile)

// Workout routes
router.get('/workouts', getWorkouts)
router.post('/workouts', addWorkout)
router.patch('/workouts/:id', updateWorkout)
router.delete('/workouts/:id', deleteWorkout)

module.exports = router