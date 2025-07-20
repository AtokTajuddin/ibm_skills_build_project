import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/20 backdrop-blur-lg py-8 md:py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Virtual Hospital AI</h3>
                <p className="text-blue-200 text-sm">The Future of Healthcare</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Revolutionary AI-powered healthcare platform providing 24/7 medical consultations and health guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/virtual-doctor" className="text-blue-200 hover:text-white transition-colors duration-300 text-sm">
                  Virtual Doctor
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-blue-200 hover:text-white transition-colors duration-300 text-sm">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-blue-200 hover:text-white transition-colors duration-300 text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li className="text-blue-200 text-sm">AI Medical Consultation</li>
              <li className="text-blue-200 text-sm">24/7 Healthcare Support</li>
              <li className="text-blue-200 text-sm">Indonesian Language Support</li>
              <li className="text-blue-200 text-sm">Secure & Private</li>
            </ul>
          </div>

          {/* External Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Healthcare Partners</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.halodoc.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Halodoc
                </a>
              </li>
              <li>
                <a 
                  href="https://www.alodokter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  Alodokter
                </a>
              </li>
              <li>
                <a 
                  href="https://www.klikdokter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-200 hover:text-white transition-colors duration-300 text-sm"
                >
                  KlikDokter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-blue-200 text-sm">
              <span>© {new Date().getFullYear()} Virtual Hospital AI. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span>Made with care for Indonesian Healthcare</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-blue-200 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="text-blue-200 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-4 max-w-4xl mx-auto">
              <div className="flex items-start justify-center text-left">
                <svg className="w-5 h-5 text-amber-300 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-amber-100 text-xs sm:text-sm">
                  <p className="font-semibold mb-2">Important Medical Disclaimer</p>
                  <p className="leading-relaxed">
                    This AI healthcare platform provides general health information and educational content. 
                    It is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Always seek advice from qualified healthcare providers for medical concerns. 
                    In emergencies, contact emergency services immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
