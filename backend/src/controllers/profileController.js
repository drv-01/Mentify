const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        phone: true,
        location: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    const { name, email, bio, phone, location } = req.body

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        bio: bio || null,
        phone: phone || null,
        location: location || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        phone: true,
        location: true
      }
    })

    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getProfile,
  updateProfile
}