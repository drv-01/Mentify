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

// Get chat history for a user
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId
    console.log('Fetching chat history for user:', userId)
    
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 50 // Limit to last 50 messages
    })
    
    console.log('Found messages:', messages.length)
    res.json(messages)
  } catch (error) {
    console.error('Error fetching chat history:', error)
    console.error('Error details:', error.message)
    res.status(500).json({ error: 'Failed to fetch chat history', details: error.message })
  }
}

// Save chat message
const saveChatMessage = async (req, res) => {
  try {
    const userId = req.user.userId
    const { message, isUser } = req.body
    console.log('Saving chat message:', { userId, message: message?.substring(0, 50), isUser })

    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId,
        message,
        isUser
      }
    })

    res.status(201).json(chatMessage)
  } catch (error) {
    console.error('Error saving chat message:', error)
    console.error('Error details:', error.message)
    res.status(500).json({ error: 'Failed to save chat message', details: error.message })
  }
}

// Clear chat history
const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId

    await prisma.chatMessage.deleteMany({
      where: { userId }
    })

    res.json({ message: 'Chat history cleared successfully' })
  } catch (error) {
    console.error('Error clearing chat history:', error)
    res.status(500).json({ error: 'Failed to clear chat history' })
  }
}

module.exports = {
  getChatHistory,
  saveChatMessage,
  clearChatHistory
}