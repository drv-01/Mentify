const prisma = require('../db/prisma')
const axios = require('axios')

// NVIDIA NIM API configuration
const NVIDIA_NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
// Primary: fast 8B model for snappy responses
const NVIDIA_NIM_MODEL = 'meta/llama-3.1-8b-instruct'
// Fallbacks ordered by speed — smallest/fastest first
const FALLBACK_MODELS = [
  'google/gemma-2-9b-it',               // 9B — very fast
  'nvidia/llama-4-scout-17b-16e-instruct', // efficient MoE
  'nvidia/llama-4-maverick-17b-128e-instruct',
  'google/gemma-3-27b-it',
  'google/gemma-4-31b-it',
  'nvidia/llama-3.3-nemotron-super-49b-v1.5' // largest — last resort
]

// Get chat history for a specific session or user's general history
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId
    const { sessionId } = req.query
    
    console.log(`Fetching chat history for user: ${userId}, session: ${sessionId || 'none'}`)
    
    const messages = await prisma.ChatMessage.findMany({
      where: { 
        userId,
        sessionId: sessionId ? parseInt(sessionId) : null
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    })
    
    res.json(messages)
  } catch (error) {
    console.error('Error fetching chat history:', error)
    res.status(500).json({ error: 'Failed to fetch chat history' })
  }
}

// Get all chat sessions for a user
const getChatSessions = async (req, res) => {
  try {
    const userId = req.user.userId
    const sessions = await prisma.ChatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    })
    res.json(sessions)
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    res.status(500).json({ error: 'Failed to fetch chat sessions' })
  }
}

// Create a new chat session
const createChatSession = async (req, res) => {
  try {
    const userId = req.user.userId
    const { title } = req.body
    
    const session = await prisma.ChatSession.create({
      data: {
        userId,
        title: title || 'New Conversation'
      }
    })
    
    res.status(201).json(session)
  } catch (error) {
    console.error('Error creating chat session:', error)
    res.status(500).json({ error: 'Failed to create chat session' })
  }
}

// Delete a chat session
const deleteChatSession = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    
    await prisma.ChatSession.deleteMany({
      where: { id: parseInt(id), userId }
    })
    
    res.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error deleting chat session:', error)
    res.status(500).json({ error: 'Failed to delete chat session' })
  }
}

// Save chat message to a specific session
const saveChatMessage = async (req, res) => {
  try {
    const userId = req.user.userId
    const { message, isUser, sessionId } = req.body
    
    const chatMessage = await prisma.ChatMessage.create({
      data: {
        userId,
        message,
        isUser,
        sessionId: sessionId ? parseInt(sessionId) : null
      }
    })

    // Update session timestamp and title if it's the first user message
    if (sessionId && isUser) {
      const session = await prisma.ChatSession.findUnique({
        where: { id: parseInt(sessionId) },
        include: { _count: { select: { messages: true } } }
      })

      const updateData = { updatedAt: new Date() }
      if (session && session.title === 'New Conversation') {
        updateData.title = message.substring(0, 30) + (message.length > 30 ? '...' : '')
      }

      await prisma.ChatSession.update({
        where: { id: parseInt(sessionId) },
        data: updateData
      })
    }

    res.status(201).json(chatMessage)
  } catch (error) {
    console.error('Error saving chat message:', error)
    res.status(500).json({ error: 'Failed to save chat message' })
  }
}

// Clear chat history
const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId

    await prisma.ChatMessage.deleteMany({
      where: { userId }
    })

    res.json({ message: 'Chat history cleared successfully' })
  } catch (error) {
    console.error('Error clearing chat history:', error)
    res.status(500).json({ error: 'Failed to clear chat history' })
  }
}

// Generate AI response using NVIDIA NIM API with session context
const generateAIResponse = async (req, res) => {
  try {
    const { message, sessionId } = req.body
    const userId = req.user.userId
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const apiKey = process.env.NVIDIA_NIM_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'NVIDIA NIM API key not configured' })
    }

    // Fetch recent context (only 6 messages to keep prompt small and fast)
    let recentMessages = []
    try {
      const history = await prisma.ChatMessage.findMany({
        where: { 
          userId,
          sessionId: sessionId ? parseInt(sessionId) : null
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      recentMessages = history.reverse().map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.message
      }))
    } catch (dbErr) {
      console.error('Error fetching context:', dbErr)
    }

    // Concise system prompt — shorter prompt = faster response
    const systemMessage = {
      role: 'system',
      content: 'You are Mentify AI, a concise and empathetic mental health & wellness assistant for students. Give short, warm, actionable advice on stress, study, sleep, anxiety, and motivation. If someone is in crisis, recommend professional help immediately.'
    }

    const nimMessages = [
      systemMessage,
      ...recentMessages,
      { role: 'user', content: message }
    ]

    console.log('Calling NVIDIA NIM API with model:', NVIDIA_NIM_MODEL)
    
    let aiResponse = null
    let usedModel = NVIDIA_NIM_MODEL
    
    // ─── Call API: primary model with 8s timeout for snappy UX ───
    const callModel = (model, timeoutMs) => axios.post(NVIDIA_NIM_BASE_URL, {
      model,
      messages: nimMessages,
      max_tokens: 512,   // reduced for faster token generation
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: timeoutMs
    })

    // Try primary first
    try {
      const response = await callModel(NVIDIA_NIM_MODEL, 8000)
      aiResponse = response.data?.choices?.[0]?.message?.content
    } catch (primaryError) {
      console.warn(`Primary (${NVIDIA_NIM_MODEL}) failed: ${primaryError.message} — rotating fallbacks...`)

      // Rotate through fallbacks — each gets 8s
      for (const fallbackModel of FALLBACK_MODELS) {
        try {
          console.log(`Trying fallback: ${fallbackModel}`)
          const fb = await callModel(fallbackModel, 8000)
          if (fb.data?.choices?.[0]?.message?.content) {
            aiResponse = fb.data.choices[0].message.content
            usedModel = fallbackModel
            console.log(`✅ Got response from: ${usedModel}`)
            break
          }
        } catch (fbErr) {
          console.error(`  ✗ ${fallbackModel}: ${fbErr.message}`)
        }
      }
    }

    if (!aiResponse) {
      throw new Error('All models exhausted')
    }

    // ─── Respond immediately, then save to DB in background ───
    res.json({ response: aiResponse, modelUsed: usedModel })

    // Fire-and-forget DB writes (don't block the response)
    // Fire-and-forget DB writes
    Promise.all([
      prisma.ChatMessage.create({ data: { userId, message, isUser: true, sessionId: sessionId ? parseInt(sessionId) : null } }),
      prisma.ChatMessage.create({ data: { userId, message: aiResponse, isUser: false, sessionId: sessionId ? parseInt(sessionId) : null } })
    ]).then(async () => {
      // Update session title if it's the first message
      if (sessionId) {
        const session = await prisma.ChatSession.findUnique({
          where: { id: parseInt(sessionId) },
          include: { _count: { select: { messages: true } } }
        });
        
        if (session && session.title === 'New Conversation') {
          await prisma.ChatSession.update({
            where: { id: parseInt(sessionId) },
            data: { 
              title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
              updatedAt: new Date()
            }
          });
        } else {
          await prisma.ChatSession.update({
            where: { id: parseInt(sessionId) },
            data: { updatedAt: new Date() }
          });
        }
      }
    }).catch(dbErr => console.error('DB save error:', dbErr.message))
  } catch (error) {
    console.error('Final Error generating AI response:', error.message)
    
    // Internal hardcoded fallback if all API attempts fail
    const getFallbackResponse = (question) => {
      const q = question.toLowerCase()
      if (q.includes('hello') || q.includes('hi')) {
        return "Hello! I'm here to help you with any questions about mental health, wellness, or student life. How can I assist you today?"
      }
      if (q.includes('stress') || q.includes('anxiety')) {
        return "I understand you're dealing with stress or anxiety. Remember to take deep breaths, practice mindfulness, and don't hesitate to reach out to friends, family, or counselors for support."
      }
      if (q.includes('study') || q.includes('exam')) {
        return "Study stress is common! Try breaking tasks into smaller chunks, taking regular breaks, and maintaining a healthy sleep schedule. You've got this!"
      }
      return "I'm having trouble connecting right now, but I'm still here to help! Could you try rephrasing your question?"
    }
    
    const fallbackResponse = getFallbackResponse(req.body.message)
    
    // Save user message even if AI fails
    try {
      await prisma.ChatMessage.create({
        data: { userId: req.user.userId, message: req.body.message, isUser: true, sessionId: req.body.sessionId ? parseInt(req.body.sessionId) : null }
      })
      await prisma.ChatMessage.create({
        data: { userId: req.user.userId, message: fallbackResponse, isUser: false, sessionId: req.body.sessionId ? parseInt(req.body.sessionId) : null }
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
    }
    
    res.json({ response: fallbackResponse })
  }
}

// Test NVIDIA NIM API connection
const testNIMAPI = async (req, res) => {
  try {
    const apiKey = process.env.NVIDIA_NIM_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'NVIDIA NIM API key not configured' })
    }

    const response = await axios.post(NVIDIA_NIM_BASE_URL, {
      model: NVIDIA_NIM_MODEL,
      messages: [
        { role: 'user', content: 'Hello, this is a test message.' }
      ],
      max_tokens: 64,
      temperature: 0.5,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })
    
    res.json({ 
      status: 'success', 
      message: 'NVIDIA NIM API is working',
      model: NVIDIA_NIM_MODEL,
      response: response.data?.choices?.[0]?.message?.content || 'No response text'
    })
  } catch (error) {
    console.error('NVIDIA NIM API test error:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'NVIDIA NIM API test failed', 
      details: error.response?.data || error.message 
    })
  }
}

module.exports = {
  getChatHistory,
  getChatSessions,
  createChatSession,
  deleteChatSession,
  saveChatMessage,
  clearChatHistory,
  generateAIResponse,
  testNIMAPI
}