const prisma = require('../db/prisma')

// Log mentor connection
const logMentorConnection = async (req, res) => {
  try {
    const userId = req.user.userId
    const { mentorId, mentorName, mentorType } = req.body

    const connection = await prisma.MentorConnection.create({
      data: {
        userId,
        mentorId: mentorId ? parseInt(mentorId) : null,
        mentorName,
        mentorType: mentorType || 'default',
        status: 'connected'
      }
    })

    res.status(201).json(connection)
  } catch (error) {
    console.error('Error logging mentor connection:', error)
    res.status(500).json({ error: 'Failed to log mentor connection' })
  }
}

module.exports = {
  logMentorConnection
}