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

// Get all mood entries for a user
const getMoodEntries = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const entries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(entries)
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    res.status(500).json({ error: 'Failed to fetch mood entries' })
  }
}

// Create a new mood entry
const createMoodEntry = async (req, res) => {
  try {
    const userId = req.user.userId
    const {
      mood,
      moodLabel,
      moodEmoji,
      stressLevel,
      trigger,
      note,
      sleepQuality,
      energyLevel,
      socialConnection,
      physicalActivity,
      mealPattern
    } = req.body

    // Validate and convert data types
    const entryData = {
      userId,
      mood: mood || '',
      moodLabel: moodLabel || '',
      moodEmoji: moodEmoji || '',
      stressLevel: parseInt(stressLevel) || 5,
      trigger: trigger || null,
      note: note || null,
      sleepQuality: sleepQuality ? parseInt(sleepQuality) : null,
      energyLevel: energyLevel ? parseInt(energyLevel) : null,
      socialConnection: socialConnection ? parseInt(socialConnection) : null,
      physicalActivity: physicalActivity || null,
      mealPattern: mealPattern || null
    }

    const entry = await prisma.moodEntry.create({
      data: entryData
    })

    res.status(201).json(entry)
  } catch (error) {
    console.error('Error creating mood entry:', error)
    res.status(500).json({ error: 'Failed to create mood entry' })
  }
}

// Delete a mood entry
const deleteMoodEntry = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    // Check if entry belongs to user
    const entry = await prisma.moodEntry.findFirst({
      where: { id: parseInt(id), userId }
    })

    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found' })
    }

    await prisma.moodEntry.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Mood entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting mood entry:', error)
    res.status(500).json({ error: 'Failed to delete mood entry' })
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
  getMoodEntries,
  createMoodEntry,
  deleteMoodEntry,
  testConnection
}