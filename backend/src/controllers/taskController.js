const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Test connection on startup
prisma.$connect().catch(err => {
  console.error('Failed to connect to database:', err)
})

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

// Create a new task
const createTask = async (req, res) => {
  try {
    const userId = req.user.userId
    const { title, description, priority, dueDate, category } = req.body

    // Validate and convert data types
    const taskData = {
      userId,
      title: title || '',
      description: description || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      category: category || 'personal',
      completed: false
    }

    const task = await prisma.task.create({
      data: taskData
    })

    res.status(201).json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
}

// Update a task
const updateTask = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { completed } = req.body

    // Check if task belongs to user
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), userId }
    })

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { completed }
    })

    res.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
}

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    // Check if task belongs to user
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), userId }
    })

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    await prisma.task.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
}

// Test database connection
const testConnection = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'Database connection successful' })
  } catch (error) {
    console.error('Database connection test failed:', error)
    res.status(500).json({ error: 'Database connection failed', details: error.message })
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  testConnection
}