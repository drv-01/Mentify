import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ isToggled }) => {
  const navigate = useNavigate();
  return (
    <footer className={`transition-all duration-300 border-t ${
      isToggled 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isToggled 
                  ? 'bg-gray-900' 
                  : 'bg-gray-900'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div> */}
              <h3 className={`text-2xl font-bold ${
                isToggled ? 'text-white' : 'text-gray-900'
              }`}>Mentify</h3>
            </div>
            <p className={`text-sm leading-relaxed max-w-md ${
              isToggled ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Empowering students with AI-driven mentorship and wellness tools for academic excellence.
            </p>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-4 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>Platform</h4>
            <ul className="space-y-2">
              <li><a href="#about" className={`text-sm transition-colors ${
                isToggled 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>About</a></li>
              <li><a href="#features" className={`text-sm transition-colors ${
                isToggled 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>Features</a></li>
              <li><a href="#testimonials" className={`text-sm transition-colors ${
                isToggled 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-4 ${
              isToggled ? 'text-white' : 'text-gray-900'
            }`}>Support</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/login')} className={`text-sm transition-colors text-left ${
                isToggled 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>Sign In</button></li>
              <li><button onClick={() => navigate('/signup')} className={`text-sm transition-colors text-left ${
                isToggled 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>Sign Up</button></li>
              <li><button onClick={() => navigate('/dashboard')} className={`text-sm transition-colors text-left ${
                isToggled 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>Dashboard</button></li>
            </ul>
          </div>
        </div>
        
        <div className={`mt-8 pt-8 border-t text-center ${
          isToggled ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${
            isToggled ? 'text-gray-500' : 'text-gray-500'
          }`}>
            © 2024 Mentify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;