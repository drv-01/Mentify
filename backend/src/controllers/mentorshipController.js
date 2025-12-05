const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get all custom mentors for a user
const getCustomMentors = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const mentors = await prisma.customMentor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(mentors)
  } catch (error) {
    console.error('Error fetching custom mentors:', error)
    res.status(500).json({ error: 'Failed to fetch custom mentors' })
  }
}

// Create a new custom mentor
const createCustomMentor = async (req, res) => {
  try {
    const userId = req.user.userId
    const {
      name,
      role,
      company,
      domain,
      experience,
      specialization,
      availability,
      bio,
      email,
      phone,
      linkedin
    } = req.body

    const mentor = await prisma.customMentor.create({
      data: {
        userId,
        name,
        role,
        company: company || 'Not specified',
        domain: domain || 'General',
        experience: experience || '0 years',
        specialization: Array.isArray(specialization) ? specialization : specialization?.split(',').map(s => s.trim()) || ['General Guidance'],
        availability: availability || 'Flexible',
        bio: bio || 'Personal mentor added by student.',
        email,
        phone: phone || 'Not provided',
        linkedin: linkedin || 'Not provided'
      }
    })

    res.status(201).json(mentor)
  } catch (error) {
    console.error('Error creating custom mentor:', error)
    res.status(500).json({ error: 'Failed to create custom mentor' })
  }
}

// Delete a custom mentor
const deleteCustomMentor = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    // Check if mentor belongs to user
    const mentor = await prisma.customMentor.findFirst({
      where: { id: parseInt(id), userId }
    })

    if (!mentor) {
      return res.status(404).json({ error: 'Custom mentor not found' })
    }

    await prisma.customMentor.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Custom mentor deleted successfully' })
  } catch (error) {
    console.error('Error deleting custom mentor:', error)
    res.status(500).json({ error: 'Failed to delete custom mentor' })
  }
}

// Log mentor connection
const logMentorConnection = async (req, res) => {
  try {
    const userId = req.user.userId
    const { mentorId, mentorName, mentorType } = req.body

    const connection = await prisma.mentorConnection.create({
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
  getCustomMentors,
  createCustomMentor,
  deleteCustomMentor,
  logMentorConnection
}