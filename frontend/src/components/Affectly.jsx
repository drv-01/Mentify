import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { gsap } from 'gsap'
import { API_BASE_URL } from '../config/api'

/**
 * Affectly Component
 * Merges MoodTracker and AiChatbot functionality.
 * Flow: User inputs mood/notes -> Entry saved -> AI generates personalized analysis/suggestions.
 */
const Affectly = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  // --- UI Layout States ---
  const [isToggled, setIsToggled] = useState(false)
  const [isChatActive, setIsChatActive] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // --- Mood Tracker States ---
  const [stressLevel, setStressLevel] = useState(5)
  const [trigger, setTrigger] = useState('')
  const [note, setNote] = useState('')
  const [sleepQuality, setSleepQuality] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [socialConnection, setSocialConnection] = useState(5)
  const [physicalActivity, setPhysicalActivity] = useState('')
  const [mealPattern, setMealPattern] = useState('')

  // --- AI Chatbot States ---
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState("meta/llama-3.1-8b-instruct")

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)
  const gridRef = useRef(null)
  const headerRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const moodCardRef = useRef(null)
  const sliderSectionRef = useRef(null)
  const submitBtnRef = useRef(null)
  const chatInputRef = useRef(null)

  useEffect(() => {
    // Background orb animations
    gsap.to(orb1Ref.current, { x: 60, y: -50, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(orb2Ref.current, { x: -55, y: 65, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
    gsap.to(orb3Ref.current, { x: 45, y: 55, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 })
    gsap.to(gridRef.current, { opacity: isToggled ? 0.06 : 0.04, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    // Page entrance
    const tl = gsap.timeline()
    tl.fromTo(headerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
      .fromTo(leftRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(rightRef.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4')
      .fromTo(moodCardRef.current, { y: 20, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, '-=0.2')
      .fromTo(sliderSectionRef.current?.children ?? [], { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.1, ease: 'power2.out' }, '-=0.1')
      .fromTo(submitBtnRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1')
      .fromTo(chatInputRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3')
  }, [])


  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsToggled(theme === 'dark')
    fetchChatSessions()
    logActivity('affectly', 'Visited Affectly')
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const logActivity = (type, action) => {
    const activity = {
      id: Date.now(),
      type: type,
      action: action,
      timestamp: new Date().toLocaleString()
    }
    const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    const updatedActivities = [activity, ...existingActivities.slice(0, 4)]
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
  }


  const fetchChatSessions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSessions(response.data)

      // Load the most recent session if none is active
      if (response.data.length > 0 && !activeSessionId) {
        loadChatHistory(response.data[0].id)
      } else if (response.data.length === 0) {
        // Create an initial session if none exist
        createNewSession()
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
      if (error.response?.status === 401) handleSessionExpiry()
    }
  }

  const loadChatHistory = async (sessionId) => {
    if (!sessionId) return
    try {
      setIsLoading(true)
      setActiveSessionId(sessionId)
      setIsChatActive(true) // Immediately switch to chat mode when loading previous session
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/chat?sessionId=${sessionId}`, {
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
      if (error.response?.status === 401) handleSessionExpiry()
    } finally {
      setIsLoading(false)
    }
  }

  const createNewSession = async () => {
    setIsChatActive(false) // Return to check-in mode for new chats
    setActiveSessionId(null)
    setMessages([])
    resetMoodForm()
  }

  const startNewSessionWithAI = async (initialTitle) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE_URL}/api/chat/sessions`,
        { title: initialTitle || 'New Conversation' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSessions(prev => [response.data, ...prev])
      setActiveSessionId(response.data.id)
      return response.data.id
    } catch (error) {
      console.error('Error creating session:', error)
      return null
    }
  }

  const deleteSession = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this conversation?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/api/chat/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSessions(prev => prev.filter(s => s.id !== id))
      if (activeSessionId === id) {
        setMessages([])
        setActiveSessionId(null)
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const handleSessionExpiry = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    if (setIsAuthenticated) setIsAuthenticated(false)
    alert('Your session has expired. Please log in again.')
    navigate('/login')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const triggers = [
    'Exams', 'Assignments', 'Labs', 'Projects', 'Placements',
    'Internships', 'Sleep Deprivation', 'Social Pressure', 'Other'
  ]

  // --- Core Integration Logic ---
  const saveMoodAndGetAiSupport = async () => {
    try {
      setIsLoading(true)
      const moodLabel = stressLevel <= 3 ? 'Great' : stressLevel <= 5 ? 'Okay' : stressLevel <= 7 ? 'Stressed' : 'Overwhelmed'
      const moodEmoji = stressLevel <= 3 ? '😊' : stressLevel <= 5 ? '😐' : stressLevel <= 7 ? '😰' : '😫'

      const token = localStorage.getItem('token')

      // 1. Create a New Session First
      const newSessionId = await startNewSessionWithAI(note ? note.substring(0, 30) : `Mood: ${moodLabel}`)
      if (!newSessionId) throw new Error('Failed to create session')

      // 2. Save Mood Entry (linked to session in future if needed, but for now as metadata)
      const payload = {
        mood: moodLabel.toLowerCase(),
        moodLabel,
        moodEmoji,
        stressLevel,
        trigger: trigger || null,
        note: note || null,
        sleepQuality,
        energyLevel,
        socialConnection,
        physicalActivity: physicalActivity || null,
        mealPattern: mealPattern || null
      }

      await axios.post(`${API_BASE_URL}/api/mood`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // 3. Transition UI to Chat Mode
      setIsChatActive(true)

      // 4. Prepare AI Prompt for Analysis
      const aiPrompt = `Hi, I just logged my mood as "${moodLabel}" (Stress: ${stressLevel}/10). ${trigger ? `The trigger is ${trigger}.` : ''} ${note ? `My note: "${note}"` : ''} My sleep quality is ${sleepQuality}/10 and energy level is ${energyLevel}/10. Based on this, can you provide a short emotional analysis and some specific wellness suggestions?`

      // 5. Send to AI
      const userMsgObj = { text: `Check-in Summary: ${moodEmoji} ${moodLabel} - ${note || 'No notes added'}`, isUser: true, id: Date.now() }
      setMessages([userMsgObj])

      const response = await axios.post(`${API_BASE_URL}/api/chat/ai`, {
        message: aiPrompt,
        sessionId: newSessionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const aiResponse = response.data.response
      if (response.data.modelUsed) setCurrentModel(response.data.modelUsed)

      const aiMsgObj = { text: aiResponse, isUser: false, id: Date.now() + 1 }
      setMessages(prev => [...prev, aiMsgObj])

      fetchChatSessions() // Update titles in sidebar
      logActivity('affectly', `Logged mood and started chat: ${moodLabel}`)

    } catch (error) {
      console.error('Error in integrated flow:', error)
      if (error.response?.status === 401) {
        handleSessionExpiry()
        return
      }
      setIsLoading(false)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetMoodForm = () => {
    setStressLevel(5)
    setTrigger('')
    setNote('')
    setSleepQuality(5)
    setEnergyLevel(5)
    setSocialConnection(5)
    setPhysicalActivity('')
    setMealPattern('')
  }

  const handleManualChat = async () => {
    if (!inputMessage.trim()) return
    const userMessage = inputMessage.trim()
    const userMsgObj = { text: userMessage, isUser: true, id: Date.now() }
    setMessages(prev => [...prev, userMsgObj])
    setInputMessage("")
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE_URL}/api/chat/ai`, {
        message: userMessage,
        sessionId: activeSessionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const aiMsgObj = { text: response.data.response, isUser: false, id: Date.now() + 1 }
      if (response.data.modelUsed) setCurrentModel(response.data.modelUsed)
      setMessages(prev => [...prev, aiMsgObj])

      // Refresh sessions
      fetchChatSessions()
    } catch (error) {
      console.error("AI Error:", error)
      setMessages(prev => [...prev, { text: "⚠️ Error contacting AI service.", isUser: false, id: Date.now() }])
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessage = (text) => {
    if (!text) return text
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    formatted = formatted.replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>')
    formatted = formatted.replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    formatted = formatted.replace(/\n/g, '<br/>')
    return formatted
  }


  const clearChat = async () => {
    if (window.confirm('Clear current conversation?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_BASE_URL}/api/chat/sessions/${activeSessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessages([])
        fetchChatSessions()
      } catch (error) {
        console.error('Error clearing chat:', error)
      }
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${isToggled
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'
      }`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background orbs */}
      <div ref={orb1Ref} className={`pointer-events-none fixed top-[-100px] left-[-100px] w-[380px] h-[380px] rounded-full blur-3xl ${isToggled ? 'bg-gray-700 opacity-20' : 'bg-gray-300 opacity-25'
        }`} />
      <div ref={orb2Ref} className={`pointer-events-none fixed bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full blur-3xl ${isToggled ? 'bg-gray-600 opacity-15' : 'bg-gray-400 opacity-20'
        }`} />
      <div ref={orb3Ref} className={`pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full blur-3xl ${isToggled ? 'bg-gray-800 opacity-25' : 'bg-white opacity-60'
        }`} />
      {/* Dot grid */}
      <div ref={gridRef} className="pointer-events-none fixed inset-0" style={{
        backgroundImage: `radial-gradient(circle, ${isToggled ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        opacity: isToggled ? 0.05 : 0.03
      }} />
      {/* Header */}
      <header ref={headerRef} className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${isToggled ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${isToggled ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600'}`}
              title="Toggle Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${isToggled ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
              <h1 className={`text-2xl font-black tracking-tighter ${isToggled ? 'text-white' : 'text-gray-900'}`}>AFFECT<span className="text-cyan-500">LY</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">AI Mood Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={createNewSession} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isToggled ? 'bg-gray-800 text-cyan-500 hover:bg-gray-700' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'}`}>+ New Chat</button>
            <button onClick={clearChat} className="text-xs font-bold text-red-500 hover:underline">Delete Active Chat</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

        {/* Sidebar: Chat Sessions (3 Columns) */}
        {isSidebarOpen && (
          <div className="hidden lg:block lg:col-span-3 h-[calc(100vh-140px)] overflow-y-auto space-y-4 pr-2 custom-scrollbar animate-in slide-in-from-left duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToggled ? 'text-gray-500' : 'text-gray-400'}`}>Previous Chats</h3>
            </div>
            <div className="space-y-2">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChatHistory(session.id)}
                  className={`group p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${activeSessionId === session.id
                    ? (isToggled ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-cyan-50 border-cyan-200 shadow-sm')
                    : (isToggled ? 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60' : 'bg-white/60 border-gray-100 hover:bg-white shadow-sm')
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold truncate mb-1 ${activeSessionId === session.id ? 'text-cyan-500' : (isToggled ? 'text-gray-300' : 'text-gray-700')}`}>
                      {session.title}
                    </h4>
                    <p className="text-[9px] opacity-40 font-medium">{new Date(session.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Stage (9 Columns) */}
        <div className={`${isSidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'} transition-all duration-500`}>
          
          {!isChatActive ? (
            /* STAGE 1: Mood Check-in (Initial entry for new chats) */
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-2">
                <h2 className={`text-3xl font-black tracking-tight ${isToggled ? 'text-white' : 'text-gray-900'}`}>How are you today?</h2>
                <p className={`text-sm ${isToggled ? 'text-gray-400' : 'text-gray-500'}`}>Your check-in provides the context for our conversation.</p>
              </div>

              <section ref={moodCardRef} className={`rounded-3xl p-8 shadow-2xl border transition-all ${isToggled ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/90 border-gray-100'}`}>
                {/* Stress Level */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-60">Stress Level</label>
                    <span className="text-lg font-black text-cyan-500">{stressLevel}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={stressLevel} onChange={(e) => setStressLevel(parseInt(e.target.value))} className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan-500" />
                  <div className="flex justify-between text-[10px] font-black opacity-40 mt-3 uppercase tracking-tighter"><span>Calm & Peace</span><span>High Pressure</span></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Triggers */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest opacity-60 mb-3">Primary Trigger</label>
                    <select value={trigger} onChange={(e) => setTrigger(e.target.value)} className={`w-full p-4 rounded-xl border text-sm font-bold outline-none transition-all ${isToggled ? 'bg-gray-900/40 border-gray-700 text-gray-300 focus:border-cyan-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-cyan-400'}`}>
                      <option value="">Select (Optional)</option>
                      {triggers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {/* Note */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest opacity-60 mb-3">Quick Note</label>
                    <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's on your mind?" className={`w-full p-4 rounded-xl border text-sm font-bold outline-none transition-all ${isToggled ? 'bg-gray-900/40 border-gray-700 text-gray-300 focus:border-cyan-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-cyan-400'}`} />
                  </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {[
                    { label: 'Sleep', val: sleepQuality, set: setSleepQuality, icon: '🌙' },
                    { label: 'Energy', val: energyLevel, set: setEnergyLevel, icon: '⚡' }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-[10px] font-black uppercase opacity-60">{item.icon} {item.label}</label>
                        <span className="text-xs font-bold">{item.val}/10</span>
                      </div>
                      <input type="range" min="1" max="10" value={item.val} onChange={(e) => item.set(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan-400" />
                    </div>
                  ))}
                </div>

                <button onClick={saveMoodAndGetAiSupport} disabled={isLoading} className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-white'}`}>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>SAVE & START CONVERSATION <span className="text-xl"></span></>
                  )}
                </button>
              </section>
            </div>
          ) : (
            /* STAGE 2: Conversational Interface (Active follow-ups) */
            <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in slide-in-from-right-4 duration-500">
              <div className={`flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar rounded-t-3xl border-x border-t ${isToggled ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/80 border-gray-100 shadow-inner'}`}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] flex gap-4 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-lg ${msg.isUser ? 'bg-cyan-500' : (isToggled ? 'bg-gray-700' : 'bg-white border')}`}>
                        {msg.isUser ? '👤' : '🤖'}
                      </div>
                      <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.isUser ? 'bg-cyan-500 text-white' : (isToggled ? 'bg-gray-800/80 text-gray-200 border border-gray-700' : 'bg-white text-gray-800 border border-gray-100')}`}
                        style={{ borderRadius: msg.isUser ? '28px 28px 4px 28px' : '28px 28px 28px 4px' }}
                        dangerouslySetInnerHTML={{ __html: msg.isUser ? msg.text : formatMessage(msg.text) }}
                      />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-xl animate-pulse">🤖</div>
                      <div className={`p-5 rounded-3xl rounded-bl-none ${isToggled ? 'bg-gray-800/80 border border-gray-700' : 'bg-white border border-gray-100'} flex items-center gap-2`}>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className={`p-6 rounded-b-3xl border transition-all ${isToggled ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/90 border-gray-100 shadow-xl'}`}>
                <div className="relative flex items-center gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualChat()}
                    placeholder="Ask a follow-up question..."
                    className={`flex-1 p-4 pr-16 rounded-2xl border text-sm font-medium transition-all outline-none ${isToggled ? 'bg-gray-900/40 border-gray-700 text-gray-200 focus:border-cyan-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-cyan-400'}`}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleManualChat}
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-2 p-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-white rounded-xl transition-all active:scale-90"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
                <div className="flex justify-between items-center mt-4 px-1">
                  <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Active AI Analysis</p>
                  <div className="flex gap-4">
                    {['Advice', 'Exercises', 'Explain'].map(tag => (
                      <button key={tag} onClick={() => setInputMessage(tag)} className="text-[10px] font-black text-cyan-500 hover:underline uppercase tracking-tighter">#{tag}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .slide-in-from-left { animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ul { list-style-type: none; padding-left: 0; }
        li { margin-bottom: 8px; position: relative; padding-left: 20px; }
        li::before { content: '→'; position: absolute; left: 0; color: #06b6d4; font-weight: bold; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        ${isToggled ? '.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }' : ''}
      `}</style>
    </div>
  )
}

export default Affectly
