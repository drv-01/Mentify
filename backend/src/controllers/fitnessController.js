const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get fitness profile
const getFitnessProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const profile = await prisma.fitnessProfile.findUnique({
      where: { userId }
    })
    
    res.json(profile)
  } catch (error) {
    console.error('Error fetching fitness profile:', error)
    res.status(500).json({ error: 'Failed to fetch fitness profile' })
  }
}

// Save fitness profile
const saveFitnessProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    const { weight, height, age, selectedDay } = req.body
    
    const profile = await prisma.fitnessProfile.upsert({
      where: { userId },
      update: { weight, height, age, selectedDay },
      create: { userId, weight, height, age, selectedDay }
    })
    
    res.json(profile)
  } catch (error) {
    console.error('Error saving fitness profile:', error)
    res.status(500).json({ error: 'Failed to save fitness profile' })
  }
}

// Get workouts
const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(workouts)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    res.status(500).json({ error: 'Failed to fetch workouts' })
  }
}

// Add workout
const addWorkout = async (req, res) => {
  try {
    const userId = req.user.userId
    const { name, duration, calories, type, icon, description, instructions, date, completed } = req.body
    
    const workout = await prisma.workout.create({
      data: {
        userId,
        name,
        duration,
        calories,
        type,
        icon,
        description,
        instructions,
        date,
        completed: completed || false
      }
    })
    
    res.json(workout)
  } catch (error) {
    console.error('Error adding workout:', error)
    res.status(500).json({ error: 'Failed to add workout' })
  }
}

// Update workout
const updateWorkout = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { completed } = req.body
    
    const workout = await prisma.workout.updateMany({
      where: { 
        id: parseInt(id),
        userId 
      },
      data: { completed }
    })
    
    res.json(workout)
  } catch (error) {
    console.error('Error updating workout:', error)
    res.status(500).json({ error: 'Failed to update workout' })
  }
}

// Delete workout
const deleteWorkout = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    
    await prisma.workout.deleteMany({
      where: { 
        id: parseInt(id),
        userId 
      }
    })
    
    res.json({ message: 'Workout deleted successfully' })
  } catch (error) {
    console.error('Error deleting workout:', error)
    res.status(500).json({ error: 'Failed to delete workout' })
  }
}

module.exports = {
  getFitnessProfile,
  saveFitnessProfile,
  getWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout
}