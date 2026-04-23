const express = require('express')
const router = express.Router()
const { 
  getChatHistory, 
  getChatSessions,
  createChatSession,
  deleteChatSession,
  saveChatMessage, 
  clearChatHistory, 
  generateAIResponse, 
  testNIMAPI 
} = require('../controllers/chatController')
const { authenticateToken } = require('../middleware/auth')

// All routes require authentication
router.use(authenticateToken)

// GET /api/chat/test - Test NVIDIA NIM API connection
router.get('/test', testNIMAPI)

// Session Management
router.get('/sessions', getChatSessions)
router.post('/sessions', createChatSession)
router.delete('/sessions/:id', deleteChatSession)

// GET /api/chat - Get chat history for user
router.get('/', getChatHistory)

// POST /api/chat/ai - Generate AI response
router.post('/ai', generateAIResponse)

// POST /api/chat - Save chat message
router.post('/', saveChatMessage)

// DELETE /api/chat - Clear chat history
router.delete('/', clearChatHistory)

module.exports = router