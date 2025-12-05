const express = require('express')
const router = express.Router()
const { getTasks, createTask, updateTask, deleteTask, testConnection } = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')

// All routes require authentication
router.use(authMiddleware)

// GET /api/tasks - Get all tasks for user
router.get('/', getTasks)

// POST /api/tasks - Create new task
router.post('/', createTask)

// PATCH /api/tasks/:id - Update task
router.patch('/:id', updateTask)

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask)

// GET /api/tasks/test - Test database connection
router.get('/test', testConnection)

module.exports = router