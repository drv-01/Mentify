import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AiChatbot() {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const API_KEY = "AIzaSyC8lcrRWBsG_g-5WP1Eo4OrsmTd6YHVZGA"

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    loadChatHistory()
    
    // Track page visit
    const activity = {
      id: Date.now(),
      type: 'chatbot',
      action: 'Visited AI Chatbot',
      timestamp: new Date().toLocaleString()
    }
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
  }, [])

  useEffect(() => {
    scrollToBottom()
    if (messages.length === 0) {
      inputRef.current?.focus()
    }
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const history = response.data.map(msg => ({
        text: msg.message,
        isUser: msg.isUser,
        id: msg.id
      }))
      setMessages(history)
    } catch (error) {
      console.error('Error loading chat history:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        alert('Your session has expired. Please log in again.')
        navigate('/login')
      }
    }
  }

  const saveChatMessage = async (message, isUser) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        message,
        isUser
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error saving chat message:', error)
    }
  }

  const createContextualPrompt = (userMessage) => {
    return `You are a helpful AI assistant focused on mental health and wellness for students. Please provide a clear, supportive, and helpful response to the following question: ${userMessage}`
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function handleSendMessage() {
    if (!inputMessage.trim()) return
    
    const userMessage = inputMessage.trim()
    const userMsgObj = { text: userMessage, isUser: true, id: Date.now() }
    setMessages(prev => [...prev, userMsgObj])
    setInputMessage("")
    setIsLoading(true)
    
    // Save user message
    await saveChatMessage(userMessage, true)
    
    try {
      const contextualPrompt = createContextualPrompt(userMessage)
      const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        "contents": [{
          "parts": [{ "text": contextualPrompt }]
        }]
      })
      
      const aiResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again."
      const aiMsgObj = { text: aiResponse, isUser: false, id: Date.now() + 1 }
      setMessages(prev => [...prev, aiMsgObj])
      
      // Save AI response
      await saveChatMessage(aiResponse, false)
      
    } catch (error) {
      console.error("Error getting AI response:", error)
      
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
      
      const fallbackResponse = getFallbackResponse(userMessage)
      const fallbackMsgObj = { text: fallbackResponse, isUser: false, id: Date.now() + 1 }
      setMessages(prev => [...prev, fallbackMsgObj])
      
      // Save fallback response
      await saveChatMessage(fallbackResponse, false)
      
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessages([])
      } catch (error) {
        console.error('Error clearing chat:', error)
      }
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isToggled ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`shadow-sm border-b transition-all duration-300 ${
        isToggled ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isToggled ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className={`text-xl sm:text-2xl font-bold ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}>AI Chatbot</h1>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isToggled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-32">
        {messages.length === 0 && (
          <div className={`rounded-2xl shadow-lg p-8 text-center mb-6 ${
            isToggled ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-5xl mb-4">🤖</div>
            <h2 className={`text-xl font-bold mb-2 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>Welcome to AI Assistant</h2>
            <p className={`${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>Start a conversation by typing a message below. I'm here to help with mental health, wellness, and student life questions.</p>
          </div>
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-2xl shadow-lg p-4 ${
                message.isUser 
                  ? isToggled ? 'bg-gray-700 ml-12' : 'bg-gray-100 ml-12'
                  : isToggled ? 'bg-gray-800 mr-12' : 'bg-white mr-12'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  message.isUser 
                    ? isToggled ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
                    : isToggled ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                }`}>
                  {message.isUser ? '👤' : '🤖'}
                </div>
                <span className={`ml-2 font-medium text-sm ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {message.isUser ? "You" : "AI Assistant"}
                </span>
              </div>
              
              <div className={`ml-10 whitespace-pre-wrap ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`rounded-2xl shadow-lg p-4 mr-12 ${
              isToggled ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isToggled ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                }`}>
                  🤖
                </div>
                <span className={`ml-2 font-medium text-sm ${
                  isToggled ? 'text-gray-300' : 'text-gray-700'
                }`}>AI Assistant</span>
              </div>
              <div className={`ml-10 flex items-center ${
                isToggled ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="animate-spin text-lg">⟳</div>
                <span className="ml-2">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Wellness Tips */}
        {messages.length === 0 && (
          <div className={`rounded-2xl shadow-lg p-6 mt-6 ${
            isToggled 
              ? 'bg-linear-to-br from-gray-800 to-gray-700 text-white'
              : 'bg-linear-to-br from-gray-100 to-gray-200 text-gray-900'
          }`}>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              💡 Ask me about
            </h3>
            <div className="space-y-2 text-sm">
              <p>• Stress management and relaxation techniques</p>
              <p>• Study tips and time management strategies</p>
              <p>• Mental health resources and support</p>
              <p>• Healthy lifestyle habits for students</p>
              <p>• Motivation and goal-setting advice</p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Input */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        <div className={`rounded-2xl shadow-lg p-3 flex items-center space-x-3 ${
          isToggled ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${
              isToggled 
                ? 'bg-gray-700 border-gray-600 text-gray-300 focus:border-gray-500 placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-800 focus:border-gray-400 placeholder-gray-500'
            }`}
            type="text"
            placeholder="Ask me anything about mental health, wellness, or student life..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              inputMessage.trim() && !isLoading
                ? isToggled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin text-lg">⟳</div>
            ) : (
              <div className="text-lg">➤</div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AiChatbot