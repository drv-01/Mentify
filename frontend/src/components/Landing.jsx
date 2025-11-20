import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Landing = () => {
  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const theme = localStorage.getItem('theme');
    setIsAuthenticated(!!token);
    setIsToggled(theme === 'dark');
    
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isToggled;
    setIsToggled(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isToggled 
        ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' 
        : 'bg-gradient-to-br from-[#e8f4fd] via-[#d1ecf1] to-[#bee9e8]'
    }`} style={{ scrollBehavior: 'smooth' }}>
      <div className="relative z-10">
        <Navbar 
          isToggled={isToggled} 
          toggleTheme={toggleTheme} 
          isAuthenticated={isAuthenticated} 
        />

        {/* Hero Section */}
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200" 
              alt="Students collaborating and studying together" 
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${
              isToggled 
                ? 'bg-gradient-to-br from-[#1a1a2e]/85 via-[#16213e]/75 to-[#0f3460]/85' 
                : 'bg-gradient-to-br from-white/70 via-cyan-50/60 to-teal-50/70'
            }`}></div>
          </div>
          
          <div className="max-w-4xl relative z-10">
            {/* <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 transition-all duration-500 shadow-2xl ${
              isToggled 
                ? 'bg-gradient-to-r from-[#68D391] to-[#9AE6B4]' 
                : 'bg-gradient-to-r from-[#4299E1] to-[#63B3ED]'
            }`}>
            </div> */}
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>
              Transform Your
              <span className={`block bg-clip-text text-transparent transition-all duration-500 mt-2 ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#00d4aa] via-[#62dafb] to-[#00d4aa]' 
                  : 'bg-gradient-to-r from-[#0891b2] via-[#06b6d4] to-[#0891b2]'
              }`}>
                Student Journey
              </span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed transition-all duration-500 px-4 font-medium ${
              isToggled ? 'text-[#62dafb]/90' : 'text-[#2c5282]'
            }`}>
              Empowering students with AI-driven mentorship, wellness tracking, and personalized 
              guidance for academic excellence and mental well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button
                onClick={() => navigate('/signup')}
                className={`text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold transition-all duration-300 shadow-2xl text-base sm:text-lg ${
                  isToggled 
                    ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb]' 
                    : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2]'
                }`}
              >
                Start Your Journey
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`border-2 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold transition-all duration-300 text-base sm:text-lg backdrop-blur-sm ${
                  isToggled 
                    ? 'border-[#62dafb] text-[#62dafb] hover:bg-[#62dafb] hover:text-[#1a1a2e] bg-white/10' 
                    : 'border-[#0891b2] text-[#0891b2] hover:bg-[#0891b2] hover:text-white bg-white/50'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" style={{ scrollMarginTop: '80px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-500 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>Empowering Student Success</h2>
              <p className={`text-lg mb-6 leading-relaxed transition-all duration-500 ${
                isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
              }`}>
                Mental health challenges affect 1 in 4 students. Mentify provides AI-powered tools and personalized mentorship to help students thrive academically and personally.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isToggled ? 'bg-[#00d4aa]' : 'bg-[#0891b2]'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-all duration-500 ${
                    isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                  }`}>24/7 AI-Powered Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isToggled ? 'bg-[#00d4aa]' : 'bg-[#0891b2]'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-all duration-500 ${
                    isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                  }`}>Expert Mentorship Network</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isToggled ? 'bg-[#00d4aa]' : 'bg-[#0891b2]'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-all duration-500 ${
                    isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
                  }`}>Secure & Private Platform</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800" 
                alt="Student using AI technology for learning" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className={`absolute inset-0 rounded-2xl ${
                isToggled ? 'bg-[#1A2A4F]/20' : 'bg-white/10'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" style={{ scrollMarginTop: '80px' }}>
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Why Choose Mentify?</h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>AI-powered tools and personalized mentorship for student success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`backdrop-blur-sm p-8 rounded-3xl shadow-2xl border transition-all duration-500 ${
              isToggled 
                ? 'bg-[#1a1a2e]/80 border-[#62dafb]/20' 
                : 'bg-white/90 border-[#0891b2]/10'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' 
                  : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${
                isToggled ? 'text-[#62dafb]' : 'text-gray-900'
              }`}>Smart Mood Tracking</h3>
              <p className={`transition-all duration-300 ${
                isToggled ? 'text-[#62dafb]/80' : 'text-gray-600'
              }`}>AI-powered emotional insights with personalized recommendations.</p>
            </div>

            <div className={`backdrop-blur-sm p-8 rounded-3xl shadow-2xl border transition-all duration-500 ${
              isToggled 
                ? 'bg-[#1a1a2e]/80 border-[#62dafb]/20' 
                : 'bg-white/90 border-[#0891b2]/10'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' 
                  : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${
                isToggled ? 'text-[#62dafb]' : 'text-gray-900'
              }`}>AI Mentorship</h3>
              <p className={`transition-all duration-300 ${
                isToggled ? 'text-[#62dafb]/80' : 'text-gray-600'
              }`}>Connect with AI-powered mentors and verified professionals.</p>
            </div>

            <div className={`backdrop-blur-sm p-8 rounded-3xl shadow-2xl border transition-all duration-500 ${
              isToggled 
                ? 'bg-[#1a1a2e]/80 border-[#62dafb]/20' 
                : 'bg-white/90 border-[#0891b2]/10'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' 
                  : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${
                isToggled ? 'text-[#62dafb]' : 'text-gray-900'
              }`}>Smart Wellness</h3>
              <p className={`transition-all duration-300 ${
                isToggled ? 'text-[#62dafb]/80' : 'text-gray-600'
              }`}>Personalized fitness, nutrition, and productivity recommendations.</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>How Mentify Works</h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>Your journey to academic success in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300" 
                  alt="Sign up process" 
                  className="w-64 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                />
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  isToggled ? 'bg-[#00d4aa]' : 'bg-[#0891b2]'
                }`}>1</div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>Sign Up & Set Goals</h3>
              <p className={`text-sm ${
                isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
              }`}>Create your account and tell us about your academic goals and challenges</p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300" 
                  alt="AI analysis" 
                  className="w-64 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                />
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  isToggled ? 'bg-[#00d4aa]' : 'bg-[#0891b2]'
                }`}>2</div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>AI Analysis & Matching</h3>
              <p className={`text-sm ${
                isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
              }`}>Our AI analyzes your profile and matches you with the perfect mentors and resources</p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300" 
                  alt="Success achievement" 
                  className="w-64 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                />
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  isToggled ? 'bg-[#00d4aa]' : 'bg-[#0891b2]'
                }`}>3</div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>Achieve Success</h3>
              <p className={`text-sm ${
                isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
              }`}>Follow personalized guidance and track your progress towards academic excellence</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className={`py-20 ${
          isToggled ? 'bg-[#1a1a2e]/50' : 'bg-white/50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-500 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>Trusted by Students Worldwide</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
                }`}>10K+</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>Active Students</div>
              </div>
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
                }`}>500+</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>Expert Mentors</div>
              </div>
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
                }`}>95%</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>Success Rate</div>
              </div>
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
                }`}>50+</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>Universities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" style={{ scrollMarginTop: '80px' }}>
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>What Students Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-3xl shadow-2xl border transition-all duration-500 ${
              isToggled 
                ? 'bg-[#1a1a2e]/80 border-[#62dafb]/20' 
                : 'bg-white/90 border-[#0891b2]/10'
            }`}>
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150" 
                  alt="Student testimonial" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className={`font-bold ${
                    isToggled ? 'text-[#62dafb]' : 'text-gray-900'
                  }`}>Sarah M.</h4>
                  <p className={`text-sm ${
                    isToggled ? 'text-[#62dafb]/70' : 'text-gray-600'
                  }`}>Psychology Major</p>
                </div>
              </div>
              <p className={`text-lg leading-relaxed ${
                isToggled ? 'text-[#62dafb]/80' : 'text-gray-600'
              }`}>
                "Mentify's AI mentor helped me manage anxiety during finals. The personalized insights were game-changing."
              </p>
            </div>

            <div className={`p-8 rounded-3xl shadow-2xl border transition-all duration-500 ${
              isToggled 
                ? 'bg-[#1a1a2e]/80 border-[#62dafb]/20' 
                : 'bg-white/90 border-[#0891b2]/10'
            }`}>
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150" 
                  alt="Student testimonial" 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className={`font-bold ${
                    isToggled ? 'text-[#62dafb]' : 'text-gray-900'
                  }`}>Alex K.</h4>
                  <p className={`text-sm ${
                    isToggled ? 'text-[#62dafb]/70' : 'text-gray-600'
                  }`}>Engineering Student</p>
                </div>
              </div>
              <p className={`text-lg leading-relaxed ${
                isToggled ? 'text-[#62dafb]/80' : 'text-gray-600'
              }`}>
                "The AI-powered mentorship connected me with perfect guidance. Mentify transformed my academic journey."
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Choose Your Plan</h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>Start free and upgrade as you grow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-3xl shadow-lg border transition-all duration-300 ${
              isToggled ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' : 'bg-white/90 border-[#0891b2]/10'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>Free</h3>
              <div className={`text-4xl font-bold mb-6 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
              }`}>$0<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic AI mentorship
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mood tracking
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic scheduler
                </li>
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                isToggled 
                  ? 'border-[#62dafb] text-[#62dafb] hover:bg-[#62dafb] hover:text-[#1a1a2e]' 
                  : 'border-[#0891b2] text-[#0891b2] hover:bg-[#0891b2] hover:text-white'
              }`}>
                Get Started
              </button>
            </div>
            
            <div className={`p-8 rounded-3xl shadow-lg border-2 relative transition-all duration-300 ${
              isToggled ? 'bg-[#1a1a2e]/80 border-[#00d4aa]' : 'bg-white border-[#0891b2]'
            }`}>
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white ${
                isToggled ? 'bg-[#00d4aa]' : 'bg-[#0891b2]'
              }`}>Most Popular</div>
              <h3 className={`text-2xl font-bold mb-4 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>Pro</h3>
              <div className={`text-4xl font-bold mb-6 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
              }`}>$19<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced AI mentorship
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1-on-1 mentor sessions
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fitness & diet planning
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb]' 
                  : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2]'
              }`}>
                Start Pro Trial
              </button>
            </div>
            
            <div className={`p-8 rounded-3xl shadow-lg border transition-all duration-300 ${
              isToggled ? 'bg-[#1a1a2e]/60 border-[#62dafb]/20' : 'bg-white/90 border-[#0891b2]/10'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
              }`}>Enterprise</h3>
              <div className={`text-4xl font-bold mb-6 ${
                isToggled ? 'text-[#62dafb]' : 'text-[#0891b2]'
              }`}>Custom</div>
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  University integration
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bulk student accounts
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Analytics dashboard
                </li>
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                isToggled 
                  ? 'border-[#62dafb] text-[#62dafb] hover:bg-[#62dafb] hover:text-[#1a1a2e]' 
                  : 'border-[#0891b2] text-[#0891b2] hover:bg-[#0891b2] hover:text-white'
              }`}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`py-20 ${
          isToggled ? 'bg-[#1a1a2e]/80' : 'bg-[#0891b2]/5'
        }`}>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Ready to Transform Your Academic Journey?</h2>
            <p className={`text-lg mb-8 transition-all duration-500 ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]/80'
            }`}>
              Join thousands of students who are already achieving their academic goals with Mentify's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className={`text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg text-lg ${
                  isToggled 
                    ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb]' 
                    : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2]'
                }`}
              >
                Start Free Today
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`border-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 text-lg ${
                  isToggled 
                    ? 'border-[#62dafb] text-[#62dafb] hover:bg-[#62dafb] hover:text-[#1a1a2e]' 
                    : 'border-[#0891b2] text-[#0891b2] hover:bg-[#0891b2] hover:text-white'
                }`}
              >
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer isToggled={isToggled} />
    </div>
  );
};

export default Landing;