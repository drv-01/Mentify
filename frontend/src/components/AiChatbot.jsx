import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

function AiChatbot() {
  const navigate = useNavigate()
  const [isToggled, setIsToggled] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState("meta/llama-3.1-8b-instruct")
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

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
      const response = await axios.get(`${API_BASE_URL}/api/chat`, {
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
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE_URL}/api/chat/ai`, {
        message: userMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const aiResponse = response.data.response
      const modelUsed = response.data.modelUsed
      
      if (modelUsed) {
        setCurrentModel(modelUsed)
      }
      
      const aiMsgObj = { text: aiResponse, isUser: false, id: Date.now() + 1 }
      setMessages(prev => [...prev, aiMsgObj])
      
    } catch (error) {
      console.error("Error getting AI response:", error?.response?.data || error?.message || error)
      
      // Show the actual error to make debugging easier
      const errorDetail = error?.response?.data?.error || error?.message || 'Unknown error'
      const errorMsgObj = { 
        text: `⚠️ AI service error: ${errorDetail}. Please try again in a moment.`, 
        isUser: false, 
        id: Date.now() + 1 
      }
      setMessages(prev => [...prev, errorMsgObj])
      
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_BASE_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessages([])
      } catch (error) {
        console.error('Error clearing chat:', error)
      }
    }
  }

  // Quick suggestion buttons
  const suggestions = [
    "How can I manage exam stress?",
    "Tips for better sleep",
    "Help me stay motivated",
    "Mindfulness exercises"
  ]

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // Format AI message text (basic markdown-like rendering)
  const formatMessage = (text) => {
    if (!text) return text
    // Bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet points
    formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    formatted = formatted.replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br/>')
    return formatted
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isToggled 
        ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' 
        : 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      transition: 'all 0.3s ease'
    }}>

      {/* Header */}
      <div style={{
        background: isToggled 
          ? 'rgba(15, 15, 26, 0.85)' 
          : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: isToggled ? '1px solid rgba(118, 185, 0, 0.15)' : '1px solid rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: isToggled 
          ? '0 4px 30px rgba(118, 185, 0, 0.05)' 
          : '0 4px 30px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => navigate('/dashboard')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isToggled ? 'rgba(118, 185, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                  color: isToggled ? '#76b900' : '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '18px'
                }}
                onMouseEnter={e => {
                  e.target.style.background = isToggled ? 'rgba(118, 185, 0, 0.2)' : 'rgba(0, 0, 0, 0.08)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={e => {
                  e.target.style.background = isToggled ? 'rgba(118, 185, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                ←
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #76b900, #5a9e00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: '0 4px 15px rgba(118, 185, 0, 0.3)'
                  }}>
                    🤖
                  </div>
                  <div>
                    <h1 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: isToggled ? '#ffffff' : '#1a1a2e',
                      margin: 0,
                      letterSpacing: '-0.3px'
                    }}>Mentify AI</h1>
                    <p style={{
                      fontSize: '11px',
                      color: '#76b900',
                      margin: 0,
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>Powered by NVIDIA NIM</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Online indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: isToggled ? 'rgba(118, 185, 0, 0.1)' : 'rgba(118, 185, 0, 0.08)',
                border: '1px solid rgba(118, 185, 0, 0.2)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#76b900',
                  boxShadow: '0 0 8px rgba(118, 185, 0, 0.6)',
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#76b900'
                }}>Online</span>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isToggled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = isToggled ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = isToggled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 24px 180px' }}>
        
        {/* Welcome Screen */}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            {/* Hero */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #76b900, #5a9e00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto 24px',
              boxShadow: '0 12px 40px rgba(118, 185, 0, 0.3)',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🤖
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: isToggled ? '#ffffff' : '#1a1a2e',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>Welcome to Mentify AI</h2>
            <p style={{
              fontSize: '15px',
              color: isToggled ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
              marginBottom: '40px',
              maxWidth: '450px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Your personal wellness companion powered by <span style={{ color: '#76b900', fontWeight: '600' }}>NVIDIA NIM</span>. 
              I can help with stress, study tips, mental health, and more.
            </p>

            {/* Suggestion Chips */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              maxWidth: '600px',
              margin: '0 auto 32px'
            }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '16px',
                    border: isToggled ? '1px solid rgba(118, 185, 0, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)',
                    background: isToggled ? 'rgba(118, 185, 0, 0.08)' : 'rgba(255, 255, 255, 0.8)',
                    color: isToggled ? 'rgba(255,255,255,0.8)' : '#333',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isToggled ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = isToggled ? 'rgba(118, 185, 0, 0.18)' : 'rgba(118, 185, 0, 0.08)'
                    e.target.style.borderColor = 'rgba(118, 185, 0, 0.4)'
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(118, 185, 0, 0.15)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = isToggled ? 'rgba(118, 185, 0, 0.08)' : 'rgba(255, 255, 255, 0.8)'
                    e.target.style.borderColor = isToggled ? 'rgba(118, 185, 0, 0.2)' : 'rgba(0, 0, 0, 0.08)'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = isToggled ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Features Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              {[
                { icon: '🧘', title: 'Stress Relief', desc: 'Relaxation & coping strategies' },
                { icon: '📚', title: 'Study Tips', desc: 'Productivity & focus advice' },
                { icon: '💪', title: 'Motivation', desc: 'Goal-setting & positivity' },
                { icon: '😴', title: 'Sleep Health', desc: 'Better rest & recovery' }
              ].map((feature, i) => (
                <div key={i} style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: isToggled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                  border: isToggled ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: isToggled ? '#ffffff' : '#1a1a2e',
                    marginBottom: '4px'
                  }}>{feature.title}</div>
                  <div style={{
                    fontSize: '12px',
                    color: isToggled ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
                  }}>{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <div style={{
                maxWidth: '75%',
                display: 'flex',
                gap: '10px',
                flexDirection: message.isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: message.isUser 
                    ? (isToggled ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')
                    : 'linear-gradient(135deg, #76b900, #5a9e00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0,
                  boxShadow: message.isUser ? 'none' : '0 4px 12px rgba(118, 185, 0, 0.25)'
                }}>
                  {message.isUser ? '👤' : '🤖'}
                </div>

                {/* Message Bubble */}
                <div style={{
                  padding: '14px 18px',
                  borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: message.isUser 
                    ? (isToggled 
                        ? 'linear-gradient(135deg, rgba(118, 185, 0, 0.2), rgba(118, 185, 0, 0.1))' 
                        : 'linear-gradient(135deg, #1a1a2e, #16213e)')
                    : (isToggled 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.9)'),
                  border: message.isUser 
                    ? (isToggled ? '1px solid rgba(118, 185, 0, 0.15)' : 'none')
                    : (isToggled ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)'),
                  color: message.isUser 
                    ? '#ffffff' 
                    : (isToggled ? 'rgba(255,255,255,0.85)' : '#333'),
                  fontSize: '14px',
                  lineHeight: '1.65',
                  backdropFilter: 'blur(10px)',
                  boxShadow: message.isUser 
                    ? (isToggled ? '0 4px 15px rgba(118, 185, 0, 0.1)' : '0 4px 15px rgba(26, 26, 46, 0.2)')
                    : '0 2px 10px rgba(0,0,0,0.04)',
                  wordBreak: 'break-word'
                }}
                  dangerouslySetInnerHTML={{ __html: message.isUser ? message.text : formatMessage(message.text) }}
                />
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #76b900, #5a9e00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(118, 185, 0, 0.25)'
                }}>
                  🤖
                </div>
                <div style={{
                  padding: '16px 22px',
                  borderRadius: '18px 18px 18px 4px',
                  background: isToggled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                  border: isToggled ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#76b900',
                      opacity: 0.6,
                      animation: `bounce 1.4s infinite ease-in-out both`,
                      animationDelay: `${i * 0.16}s`
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px 24px',
        background: isToggled 
          ? 'linear-gradient(to top, rgba(15, 15, 26, 1) 60%, rgba(15, 15, 26, 0))' 
          : 'linear-gradient(to top, rgba(240, 244, 255, 1) 60%, rgba(240, 244, 255, 0))',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 8px 8px 20px',
          borderRadius: '20px',
          background: isToggled ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.95)',
          border: isToggled ? '1px solid rgba(118, 185, 0, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: isToggled 
            ? '0 8px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(118, 185, 0, 0.05)' 
            : '0 8px 40px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease'
        }}>
          <input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{
              flex: 1,
              padding: '14px 0',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: isToggled ? '#ffffff' : '#1a1a2e',
              fontSize: '15px',
              fontFamily: "'Inter', sans-serif"
            }}
            type="text"
            placeholder="Ask me anything about wellness, study tips, or mental health..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              border: 'none',
              background: inputMessage.trim() && !isLoading 
                ? 'linear-gradient(135deg, #76b900, #5a9e00)' 
                : (isToggled ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
              color: inputMessage.trim() && !isLoading ? '#ffffff' : (isToggled ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s ease',
              fontSize: '20px',
              boxShadow: inputMessage.trim() && !isLoading ? '0 4px 15px rgba(118, 185, 0, 0.35)' : 'none',
              flexShrink: 0
            }}
            onMouseEnter={e => {
              if (inputMessage.trim() && !isLoading) {
                e.target.style.transform = 'scale(1.05)'
                e.target.style.boxShadow = '0 6px 20px rgba(118, 185, 0, 0.45)'
              }
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'scale(1)'
              if (inputMessage.trim() && !isLoading) {
                e.target.style.boxShadow = '0 4px 15px rgba(118, 185, 0, 0.35)'
              }
            }}
          >
            {isLoading ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(118, 185, 0, 0.3)',
                borderTop: '2px solid #76b900',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            ) : '➤'}
          </button>
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: isToggled ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
          marginTop: '8px',
          fontWeight: '500'
        }}>
          Powered by NVIDIA NIM · {currentModel}
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Scrollbar Styling */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: rgba(118, 185, 0, 0.3); 
          border-radius: 3px; 
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(118, 185, 0, 0.5); }

        ul { padding-left: 16px; margin: 8px 0; }
        li { margin: 4px 0; list-style: disc; }
      `}</style>
    </div>
  )
}

export default AiChatbot