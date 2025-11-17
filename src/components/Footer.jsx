import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ isToggled }) => {
  const navigate = useNavigate();
  return (
    <footer className={`transition-all duration-500 border-t ${
      isToggled 
        ? 'bg-[#1a1a2e]/95 border-[#62dafb]/20' 
        : 'bg-[#e8f4fd]/95 border-[#0891b2]/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#00d4aa] to-[#62dafb]' 
                  : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold bg-clip-text text-transparent ${
                isToggled 
                  ? 'bg-gradient-to-r from-[#62dafb] to-[#00d4aa]' 
                  : 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4]'
              }`}>Mentify</h3>
            </div>
            <p className={`text-sm leading-relaxed max-w-md ${
              isToggled ? 'text-[#62dafb]/80' : 'text-[#2c5282]'
            }`}>
              Empowering students with AI-driven mentorship and wellness tools for academic excellence.
            </p>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-4 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Platform</h4>
            <ul className="space-y-2">
              <li><a href="#about" className={`text-sm transition-colors ${
                isToggled 
                  ? 'text-[#62dafb]/70 hover:text-[#00d4aa]' 
                  : 'text-gray-600 hover:text-[#0891b2]'
              }`}>About</a></li>
              <li><a href="#features" className={`text-sm transition-colors ${
                isToggled 
                  ? 'text-[#62dafb]/70 hover:text-[#00d4aa]' 
                  : 'text-gray-600 hover:text-[#0891b2]'
              }`}>Features</a></li>
              <li><a href="#testimonials" className={`text-sm transition-colors ${
                isToggled 
                  ? 'text-[#62dafb]/70 hover:text-[#00d4aa]' 
                  : 'text-gray-600 hover:text-[#0891b2]'
              }`}>Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-4 ${
              isToggled ? 'text-[#62dafb]' : 'text-[#2c5282]'
            }`}>Support</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/login')} className={`text-sm transition-colors text-left ${
                isToggled 
                  ? 'text-[#FFF2EF]/70 hover:text-[#FFDBB6]' 
                  : 'text-gray-600 hover:text-[#687FE5]'
              }`}>Sign In</button></li>
              <li><button onClick={() => navigate('/signup')} className={`text-sm transition-colors text-left ${
                isToggled 
                  ? 'text-[#FFF2EF]/70 hover:text-[#FFDBB6]' 
                  : 'text-gray-600 hover:text-[#687FE5]'
              }`}>Sign Up</button></li>
              <li><button onClick={() => navigate('/dashboard')} className={`text-sm transition-colors text-left ${
                isToggled 
                  ? 'text-[#FFF2EF]/70 hover:text-[#FFDBB6]' 
                  : 'text-gray-600 hover:text-[#687FE5]'
              }`}>Dashboard</button></li>
            </ul>
          </div>
        </div>
        
        <div className={`mt-8 pt-8 border-t text-center ${
          isToggled ? 'border-[#F7A5A5]/20' : 'border-[#687FE5]/20'
        }`}>
          <p className={`text-sm ${
            isToggled ? 'text-[#62dafb]/60' : 'text-gray-500'
          }`}>
            © 2024 Mentify. All rights reserved. Built with ❤️ for student success.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;