const prisma = require('../db/prisma')

const normalizeText = (value) => typeof value === 'string' ? value.trim() : ''
const splitList = (value) => Array.isArray(value)
  ? value.map(normalizeText).filter(Boolean)
  : normalizeText(value).split(',').map((item) => item.trim()).filter(Boolean)

const listCustomMentors = async (req, res) => {
  try {
    const mentors = await prisma.CustomMentor.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(mentors)
  } catch (error) {
    console.error('Error loading custom mentors:', error.message)
    return res.status(500).json({ error: 'Failed to load mentors' })
  }
}

const createCustomMentor = async (req, res) => {
  const name = normalizeText(req.body.name)
  const role = normalizeText(req.body.role)
  const email = normalizeText(req.body.email).toLowerCase()
  const phone = normalizeText(req.body.phone)
  const linkedin = normalizeText(req.body.linkedin)
  const domain = normalizeText(req.body.domain)
  const availability = normalizeText(req.body.availability)
  const specialization = splitList(req.body.specialization)
  const focus = splitList(req.body.focus)

  if (!name || !role || !email || !domain || !availability || specialization.length === 0) {
    return res.status(400).json({ error: 'Name, role, email, focus domain, specialization, and availability are required.' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  try {
    const mentor = await prisma.CustomMentor.create({
      data: {
        userId: req.user.userId,
        name,
        role,
        company: normalizeText(req.body.company) || null,
        domain,
        experience: normalizeText(req.body.experience) || null,
        specialization,
        availability,
        bio: normalizeText(req.body.bio) || null,
        email,
        phone: phone || null,
        linkedin: linkedin || null,
      },
    })
    return res.status(201).json({ ...mentor, focus })
  } catch (error) {
    console.error('Error creating custom mentor:', error.message)
    return res.status(500).json({ error: 'Failed to add mentor' })
  }
}

const deleteCustomMentor = async (req, res) => {
  const mentorId = Number(req.params.id)
  if (!Number.isInteger(mentorId)) return res.status(400).json({ error: 'Invalid mentor id' })

  try {
    const deleted = await prisma.CustomMentor.deleteMany({
      where: { id: mentorId, userId: req.user.userId },
    })
    if (deleted.count === 0) return res.status(404).json({ error: 'Mentor not found' })
    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting custom mentor:', error.message)
    return res.status(500).json({ error: 'Failed to delete mentor' })
  }
}

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
  logMentorConnection,
  listCustomMentors,
  createCustomMentor,
  deleteCustomMentor,
}
