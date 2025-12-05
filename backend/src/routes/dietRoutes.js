const express = require('express')
const router = express.Router()
const {
  getDietPlan,
  saveDietPlan,
  addMeal,
  updateMeal,
  deleteMeal
} = require('../controllers/dietController')
const authMiddleware = require('../middleware/authMiddleware')

// Apply authentication middleware to all routes
router.use(authMiddleware)

// Diet plan routes
router.get('/plan', getDietPlan)
router.post('/plan', saveDietPlan)

// Meal routes
router.post('/meals', addMeal)
router.patch('/meals/:id', updateMeal)
router.delete('/meals/:id', deleteMeal)

module.exports = router