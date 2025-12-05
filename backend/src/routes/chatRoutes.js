const express = require('express')
const router = express.Router()
const { getChatHistory, saveChatMessage, clearChatHistory } = require('../controllers/chatController')
const authMiddleware = require('../middleware/authMiddleware')

// All routes require authentication
router.use(authMiddleware)

// GET /api/chat - Get chat history for user
router.get('/', getChatHistory)

// POST /api/chat - Save chat message
router.post('/', saveChatMessage)

// DELETE /api/chat - Clear chat history
router.delete('/', clearChatHistory)

module.exports = router