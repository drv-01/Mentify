import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isToggled, toggleTheme, isAuthenticated }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`backdrop-blur-md shadow-lg border-b transition-all duration-500 fixed w-full top-0 z-50 ${
      isToggled 
        ? 'bg-[#1a1a2e]/95 border-[#62dafb]/30' 
        : 'bg-[#e8f4fd]/95 border-[#0891b2]/20'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br rounded-2xl shadow-lg transition-all duration-500 ${
                isToggled 
                  ? 'from-[#00d4aa] to-[#62dafb]' 
                  : 'from-[#0891b2] to-[#06b6d4]'
              }`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent tracking-wider transition-all duration-500 ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#62dafb] via-[#00d4aa] to-[#62dafb]' 
                  : 'bg-gradient-to-r from-[#0891b2] via-[#06b6d4] to-[#0891b2]'
              }`}>Mentify</h1>
            </div>
            <button 
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                isToggled 
                  ? 'bg-[#62dafb]/20 hover:bg-[#62dafb]/30' 
                  : 'bg-[#0891b2]/20 hover:bg-[#0891b2]/30'
              }`}
            >
              <svg className={`w-5 h-5 transition-all duration-500 ${
                isToggled ? 'text-[#62dafb] rotate-180' : 'text-[#0891b2] rotate-0'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className={`font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 ${
              isToggled 
                ? 'text-[#62dafb] hover:text-[#00d4aa]' 
                : 'text-[#2c5282] hover:text-[#0891b2]'
            }`}>About</a>
            <a href="#features" className={`font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 ${
              isToggled 
                ? 'text-[#62dafb] hover:text-[#00d4aa]' 
                : 'text-[#2c5282] hover:text-[#0891b2]'
            }`}>Features</a>
            <a href="#testimonials" className={`font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 ${
              isToggled 
                ? 'text-[#62dafb] hover:text-[#00d4aa]' 
                : 'text-[#2c5282] hover:text-[#0891b2]'
            }`}>Testimonials</a>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isToggled 
                ? 'text-gray-300 hover:bg-purple-900/30' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className={`text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  isToggled 
                    ? 'bg-[#00d4aa] hover:bg-[#00d4aa]/90' 
                    : 'bg-[#0891b2] hover:bg-[#0891b2]/90'
                }`}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className={`font-semibold text-sm tracking-wide transition-all duration-300 px-4 py-2 rounded-full border ${
                    isToggled 
                      ? 'text-[#62dafb] hover:text-white border-[#00d4aa] hover:bg-[#00d4aa]' 
                      : 'text-[#2c5282] hover:text-[#0891b2] hover:bg-[#bee9e8]/50 border-transparent'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className={`text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                    isToggled 
                      ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb] hover:from-[#00c4a0] hover:to-[#52c9eb]' 
                      : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] hover:from-[#0e7490] hover:to-[#0891b2]'
                  }`}
                >
                  🚀 Start Learning
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t transition-all duration-300 ${
          isToggled 
            ? 'bg-slate-800/90 border-purple-500/30' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <div className="px-6 py-4 space-y-4">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className={`block font-medium transition-colors ${
              isToggled 
                ? 'text-[#FFF2EF] hover:text-[#FFDBB6]' 
                : 'text-gray-600 hover:text-[#687FE5]'
            }`}>About</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className={`block font-medium transition-colors ${
              isToggled 
                ? 'text-[#FFF2EF] hover:text-[#FFDBB6]' 
                : 'text-gray-600 hover:text-[#687FE5]'
            }`}>Features</a>
            <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className={`block font-medium transition-colors ${
              isToggled 
                ? 'text-[#FFF2EF] hover:text-[#FFDBB6]' 
                : 'text-gray-600 hover:text-[#687FE5]'
            }`}>Testimonials</a>
            
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`w-full text-white py-3 rounded-full font-medium shadow-md transition-all duration-300 ${
                    isToggled 
                      ? 'bg-[#8B4513] hover:bg-[#8B4513]/90' 
                      : 'bg-[#8B4513] hover:bg-[#8B4513]/90'
                  }`}
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full font-medium py-3 rounded-full transition-all duration-300 border ${
                      isToggled 
                        ? 'text-[#D2B48C] border-[#8B4513] hover:bg-[#8B4513] hover:text-white' 
                        : 'text-[#5A5A5A] hover:bg-[#DEB887]/50 border-transparent'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className={`w-full text-white py-3 rounded-full font-medium shadow-md transition-all duration-300 ${
                      isToggled 
                        ? 'bg-[#8B4513] hover:bg-[#8B4513]/90' 
                        : 'bg-[#8B4513] hover:bg-[#8B4513]/90'
                    }`}
                  >
                    Start Learning
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;