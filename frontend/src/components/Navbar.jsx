import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isToggled, toggleTheme, isAuthenticated }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`shadow-sm border-b transition-all duration-300 fixed w-full top-0 z-50 ${
      isToggled 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <button 
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                isToggled 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <svg className={`w-5 h-5 transition-all duration-300 ${
                isToggled ? 'text-gray-300' : 'text-gray-700'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
              <h1 className={`text-2xl sm:text-3xl font-bold transition-all duration-300 ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}>Mentify</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className={`font-semibold text-sm transition-all duration-300 ${
              isToggled 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-700 hover:text-gray-900'
            }`}>About</a>
            <a href="#features" className={`font-semibold text-sm transition-all duration-300 ${
              isToggled 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-700 hover:text-gray-900'
            }`}>Features</a>
            <a href="#testimonials" className={`font-semibold text-sm transition-all duration-300 ${
              isToggled 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-700 hover:text-gray-900'
            }`}>Testimonials</a>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isToggled 
                ? 'text-gray-300 hover:bg-gray-800' 
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
                className={`text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isToggled 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className={`font-semibold text-sm transition-all duration-300 px-4 py-2 rounded-lg border ${
                    isToggled 
                      ? 'text-gray-300 hover:text-white border-gray-600 hover:bg-gray-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  Sign In
                </button>
                {/* <button
                  onClick={() => navigate('/signup')}
                  className={`text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-md hover:shadow-sm transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                    isToggled 
                      ? 'bg-gray-900 hover:bg-gray-700' 
                      : 'bg-gray-900 hover:bg-gray-700'
                  }`}
                >
                  🚀 Start Learning
                </button> */}
              </>
            )}
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t transition-all duration-300 ${
          isToggled 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="px-6 py-4 space-y-4">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className={`block font-medium transition-colors ${
              isToggled 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>About</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className={`block font-medium transition-colors ${
              isToggled 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>Features</a>
            <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className={`block font-medium transition-colors ${
              isToggled 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}>Testimonials</a>
            
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`w-full text-white py-3 rounded-lg font-medium transition-all duration-300 ${
                    isToggled 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full font-medium py-3 rounded-lg transition-all duration-300 border ${
                      isToggled 
                        ? 'text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 border-gray-300'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className={`w-full text-white py-3 rounded-lg font-medium transition-all duration-300 ${
                      isToggled 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
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