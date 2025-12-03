import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './testimonial-slider.css';

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
    <div className={`min-h-screen transition-all duration-300 ${
      isToggled 
        ? 'bg-gray-900' 
        : 'bg-gray-50'
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
                ? 'bg-gray-900/90' 
                : 'bg-white/80'
            }`}></div>
          </div>
          
          <div className="max-w-4xl relative z-10">
            {/* <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 transition-all duration-300 shadow-sm ${
              isToggled 
                ? 'bg-gray-900' 
                : 'bg-gray-900'
            }`}>
            </div> */}
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-300 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>
              Transform Your
              <span className={`block transition-all duration-300 mt-2 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Student Journey
              </span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed transition-all duration-300 px-4 ${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Empowering students with AI-driven mentorship, wellness tracking, and personalized 
              guidance for academic excellence and mental well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button
                onClick={() => navigate('/signup')}
                className={`text-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-semibold transition-all duration-300 text-base sm:text-lg ${
                  isToggled 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                Start Your Journey
              </button>
              {/* <button
                onClick={() => navigate('/login')}
                className={`border-2 px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-semibold transition-all duration-300 text-base sm:text-lg ${
                  isToggled 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Sign In
              </button> */}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" style={{ scrollMarginTop: '80px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Empowering Student Success</h2>
              <p className={`text-lg mb-6 leading-relaxed transition-all duration-300 ${
                isToggled ? 'text-gray-300/80' : 'text-gray-700'
              }`}>
                Mental health challenges affect 1 in 4 students. Mentify provides AI-powered tools and personalized mentorship to help students thrive academically and personally.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isToggled ? 'bg-gray-800' : 'bg-gray-800'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-all duration-300 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>24/7 AI-Powered Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isToggled ? 'bg-gray-800' : 'bg-gray-800'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-all duration-300 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Expert Mentorship Network</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isToggled ? 'bg-gray-800' : 'bg-gray-800'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-all duration-300 ${
                    isToggled ? 'text-gray-300' : 'text-gray-700'
                  }`}>Secure & Private Platform</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800" 
                alt="Student using AI technology for learning" 
                className="rounded-lg shadow-sm w-full h-96 object-cover"
              />
              <div className={`absolute inset-0 rounded-lg ${
                isToggled ? 'bg-gray-900/20' : 'bg-white/10'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative" style={{ scrollMarginTop: '80px' }}>
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>Why Choose Mentify?</h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-300 ${
              isToggled ? 'text-gray-300/80' : 'text-gray-700'
            }`}>AI-powered tools and personalized mentorship for student success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`backdrop-blur-none p-8 rounded-lg shadow-sm border transition-all duration-300 ${
              isToggled 
                ? 'bg-gray-900/80 border-gray-600/20' 
                : 'bg-white/90 border-gray-300/10'
            }`}>
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900' 
                  : 'bg-gray-900'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-900'
              }`}>Smart Mood Tracking</h3>
              <p className={`transition-all duration-300 ${
                isToggled ? 'text-gray-300/80' : 'text-gray-600'
              }`}>AI-powered emotional insights with personalized recommendations.</p>
            </div>

            <div className={`backdrop-blur-none p-8 rounded-lg shadow-sm border transition-all duration-300 ${
              isToggled 
                ? 'bg-gray-900/80 border-gray-600/20' 
                : 'bg-white/90 border-gray-300/10'
            }`}>
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900' 
                  : 'bg-gray-900'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-900'
              }`}>AI Mentorship</h3>
              <p className={`transition-all duration-300 ${
                isToggled ? 'text-gray-300/80' : 'text-gray-600'
              }`}>Connect with AI-powered mentors and verified professionals.</p>
            </div>

            <div className={`backdrop-blur-none p-8 rounded-lg shadow-sm border transition-all duration-300 ${
              isToggled 
                ? 'bg-gray-900/80 border-gray-600/20' 
                : 'bg-white/90 border-gray-300/10'
            }`}>
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900' 
                  : 'bg-gray-900'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-900'
              }`}>Smart Wellness</h3>
              <p className={`transition-all duration-300 ${
                isToggled ? 'text-gray-300/80' : 'text-gray-600'
              }`}>Personalized fitness, nutrition, and productivity recommendations.</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>How Mentify Works</h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-300 ${
              isToggled ? 'text-gray-300/80' : 'text-gray-700'
            }`}>Your journey to academic success in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300" 
                  alt="Sign up process" 
                  className="w-64 h-48 object-cover rounded-lg mx-auto shadow-sm"
                />
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  isToggled ? 'bg-gray-800' : 'bg-gray-800'
                }`}>1</div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Sign Up & Set Goals</h3>
              <p className={`text-sm ${
                isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
              }`}>Create your account and tell us about your academic goals and challenges</p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300" 
                  alt="AI analysis" 
                  className="w-64 h-48 object-cover rounded-lg mx-auto shadow-sm"
                />
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  isToggled ? 'bg-gray-800' : 'bg-gray-800'
                }`}>2</div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>AI Analysis & Matching</h3>
              <p className={`text-sm ${
                isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
              }`}>Our AI analyzes your profile and matches you with the perfect mentors and resources</p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300" 
                  alt="Success achievement" 
                  className="w-64 h-48 object-cover rounded-lg mx-auto shadow-sm"
                />
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  isToggled ? 'bg-gray-800' : 'bg-gray-800'
                }`}>3</div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Achieve Success</h3>
              <p className={`text-sm ${
                isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
              }`}>Follow personalized guidance and track your progress towards academic excellence</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className={`py-20 ${
          isToggled ? 'bg-gray-900/50' : 'bg-gray-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Trusted by Students Worldwide</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-[#0891b2]'
                }`}>10K+</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>Active Students</div>
              </div>
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-[#0891b2]'
                }`}>500+</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>Expert Mentors</div>
              </div>
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-[#0891b2]'
                }`}>95%</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>Success Rate</div>
              </div>
              <div>
                <div className={`text-4xl font-bold mb-2 ${
                  isToggled ? 'text-gray-300' : 'text-[#0891b2]'
                }`}>50+</div>
                <div className={`text-sm font-medium ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>Universities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" style={{ scrollMarginTop: '80px' }}>
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>What Students Say</h2>
          </div>
          
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={2}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={4000}
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]}
            className="testimonial-slider"
          >
            <div className="px-4">
              <div className={`p-8 rounded-lg shadow-sm border transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900/80 border-gray-600/20' 
                  : 'bg-white/90 border-gray-300/10'
              }`}>
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150" 
                    alt="Student testimonial" 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className={`font-bold ${
                      isToggled ? 'text-gray-300' : 'text-gray-900'
                    }`}>Sarah M.</h4>
                    <p className={`text-sm ${
                      isToggled ? 'text-gray-300/70' : 'text-gray-600'
                    }`}>Psychology Major</p>
                  </div>
                </div>
                <p className={`text-lg leading-relaxed ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-600'
                }`}>
                  "Mentify's AI mentor helped me manage anxiety during finals. The personalized insights were game-changing."
                </p>
              </div>
            </div>

            <div className="px-4">
              <div className={`p-8 rounded-lg shadow-sm border transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900/80 border-gray-600/20' 
                  : 'bg-white/90 border-gray-300/10'
              }`}>
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150" 
                    alt="Student testimonial" 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className={`font-bold ${
                      isToggled ? 'text-gray-300' : 'text-gray-900'
                    }`}>Alex K.</h4>
                    <p className={`text-sm ${
                      isToggled ? 'text-gray-300/70' : 'text-gray-600'
                    }`}>Engineering Student</p>
                  </div>
                </div>
                <p className={`text-lg leading-relaxed ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-600'
                }`}>
                  "The AI-powered mentorship connected me with perfect guidance. Mentify transformed my academic journey."
                </p>
              </div>
            </div>

            <div className="px-4">
              <div className={`p-8 rounded-lg shadow-sm border transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900/80 border-gray-600/20' 
                  : 'bg-white/90 border-gray-300/10'
              }`}>
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" 
                    alt="Student testimonial" 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className={`font-bold ${
                      isToggled ? 'text-gray-300' : 'text-gray-900'
                    }`}>Mike R.</h4>
                    <p className={`text-sm ${
                      isToggled ? 'text-gray-300/70' : 'text-gray-600'
                    }`}>Business Student</p>
                  </div>
                </div>
                <p className={`text-lg leading-relaxed ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-600'
                }`}>
                  "The wellness tracking feature helped me maintain work-life balance. Highly recommend to all students!"
                </p>
              </div>
            </div>

            <div className="px-4">
              <div className={`p-8 rounded-lg shadow-sm border transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900/80 border-gray-600/20' 
                  : 'bg-white/90 border-gray-300/10'
              }`}>
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150" 
                    alt="Student testimonial" 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className={`font-bold ${
                      isToggled ? 'text-gray-300' : 'text-gray-900'
                    }`}>Emma L.</h4>
                    <p className={`text-sm ${
                      isToggled ? 'text-gray-300/70' : 'text-gray-600'
                    }`}>Medical Student</p>
                  </div>
                </div>
                <p className={`text-lg leading-relaxed ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-600'
                }`}>
                  "Mentify's personalized study plans improved my grades significantly. The AI understands my learning style perfectly."
                </p>
              </div>
            </div>
          </Slider>
        </div>

        {/* Pricing Section
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-300 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>Choose Your Plan</h2>
            <p className={`text-lg max-w-2xl mx-auto transition-all duration-300 ${
              isToggled ? 'text-gray-300/80' : 'text-gray-700'
            }`}>Start free and upgrade as you grow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-lg shadow-sm border transition-all duration-300 ${
              isToggled ? 'bg-gray-900/60 border-gray-600/20' : 'bg-white/90 border-gray-300/10'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Free</h3>
              <div className={`text-4xl font-bold mb-6 ${
                isToggled ? 'text-gray-300' : 'text-[#0891b2]'
              }`}>$0<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic AI mentorship
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mood tracking
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic scheduler
                </li>
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                isToggled 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-[#1a1a2e]' 
                  : 'border-gray-300 text-[#0891b2] hover:bg-gray-800 hover:text-white'
              }`}>
                Get Started
              </button>
            </div>
            
            <div className={`p-8 rounded-lg shadow-sm border-2 relative transition-all duration-300 ${
              isToggled ? 'bg-gray-900/80 border-[#00d4aa]' : 'bg-white border-gray-300'
            }`}>
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white ${
                isToggled ? 'bg-gray-800' : 'bg-gray-800'
              }`}>Most Popular</div>
              <h3 className={`text-2xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Pro</h3>
              <div className={`text-4xl font-bold mb-6 ${
                isToggled ? 'text-gray-300' : 'text-[#0891b2]'
              }`}>$19<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced AI mentorship
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1-on-1 mentor sessions
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fitness & diet planning
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-900 hover:bg-gray-700' 
                  : 'bg-gray-900 hover:bg-gray-700'
              }`}>
                Start Pro Trial
              </button>
            </div>
            
            <div className={`p-8 rounded-lg shadow-sm border transition-all duration-300 ${
              isToggled ? 'bg-gray-900/60 border-gray-600/20' : 'bg-white/90 border-gray-300/10'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`}>Enterprise</h3>
              <div className={`text-4xl font-bold mb-6 ${
                isToggled ? 'text-gray-300' : 'text-[#0891b2]'
              }`}>Custom</div>
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  University integration
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bulk student accounts
                </li>
                <li className={`flex items-center ${
                  isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
                }`}>
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Analytics dashboard
                </li>
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                isToggled 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-[#1a1a2e]' 
                  : 'border-gray-300 text-[#0891b2] hover:bg-gray-800 hover:text-white'
              }`}>
                Contact Sales
              </button>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        {/* <div className={`py-20 ${
          isToggled ? 'bg-gray-900/80' : 'bg-gray-800/5'
        }`}>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-300 ${
              isToggled ? 'text-gray-300' : 'text-gray-700'
            }`}>Ready to Transform Your Journey?</h2>
            <p className={`text-lg mb-8 transition-all duration-300 ${
              isToggled ? 'text-gray-300/80' : 'text-gray-700/80'
            }`}>
              Join thousands of students who are already achieving their goals with Mentify's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className={`text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-sm text-lg ${
                  isToggled 
                    ? 'bg-gray-900 hover:bg-gray-700' 
                    : 'bg-gray-900 hover:bg-gray-700'
                }`}
              >
                Start Free Today
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`border-2 px-8 py-4 rounded-lg font-bold transition-all duration-300 text-lg ${
                  isToggled 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-[#1a1a2e]' 
                    : 'border-gray-300 text-[#0891b2] hover:bg-gray-800 hover:text-white'
                }`}
              >
                Watch Demo
              </button>
            </div>
          </div> */}
        {/* </div> */}
      </div>
      
      <Footer isToggled={isToggled} />
    </div>
  );
};

export default Landing;