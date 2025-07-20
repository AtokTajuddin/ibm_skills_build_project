import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-white/30 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Virtual Hospital
                </h1>
                <p className="text-xs text-gray-500 -mt-1 hidden sm:block">AI Healthcare Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="hidden lg:inline">Dashboard</span>
                </span>
              </Link>
              
              <Link
                to="/virtual-doctor"
                className={`px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl font-medium transition-all duration-200 ${
                  isActive('/virtual-doctor')
                    ? 'bg-emerald-100 text-emerald-700 shadow-md'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden lg:inline">AI Doctor</span>
                </span>
              </Link>

              {/* Medical Resources Dropdown */}
              <div className="relative group">
                <button className="px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl font-medium transition-all duration-200 text-gray-600 hover:text-blue-700 hover:bg-blue-50 flex items-center">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span className="hidden lg:inline">Medical Resources</span>
                    <span className="lg:hidden">Resources</span>
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <a 
                      href="https://www.alodokter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="font-medium">Alodokter</p>
                        <p className="text-xs text-gray-500">Medical Information</p>
                      </div>
                      <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    
                    <a 
                      href="https://www.halodoc.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <div>
                        <p className="font-medium">Halodoc</p>
                        <p className="text-xs text-gray-500">Online Healthcare</p>
                      </div>
                      <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    
                    <a 
                      href="https://www.who.int/news" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.615a1 1 0 00-.553-.894l-5.553-2.776a2 2 0 01-1.115-1.794V3.615a1 1 0 00-.553-.894L7.553.776a2 2 0 00-1.106 0L1.553 2.776A1 1 0 001 3.615v4.985a2 2 0 001.115 1.794l5.553 2.776c.05.025.101.048.153.069V17a2 2 0 002 2h8a2 2 0 002-2v-1.382" />
                      </svg>
                      <div>
                        <p className="font-medium">WHO Medical News</p>
                        <p className="text-xs text-gray-500">Global Health Updates</p>
                      </div>
                      <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    
                    <a 
                      href="https://www.medscape.com/news" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <div>
                        <p className="font-medium">Medscape News</p>
                        <p className="text-xs text-gray-500">Medical Research</p>
                      </div>
                      <svg className="w-3 h-3 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-24 lg:max-w-none">
                    {user?.username || user?.displayName || 'Patient'}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-24 lg:max-w-none">
                    {user?.email || 'Healthcare Member'}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-lg font-bold text-white">
                    {(user?.username || user?.displayName || 'P')[0].toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-2 sm:px-3 lg:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-0 sm:mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline text-sm lg:text-base">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 bg-white/95 backdrop-blur-lg border-t border-white/30">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50/80 rounded-lg sm:rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {(user?.username || user?.displayName || 'P')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user?.username || user?.displayName || 'Patient'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'Healthcare Member'}
                </p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 btn-touch ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            <Link
              to="/virtual-doctor"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 btn-touch ${
                isActive('/virtual-doctor')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              AI Doctor
            </Link>

            {/* Medical Resources Section */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="px-3 sm:px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Medical Resources
              </p>
              
              <a
                href="https://www.alodokter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 btn-touch text-gray-600 hover:text-green-700 hover:bg-green-50"
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1 text-left">
                  <span className="block">Alodokter</span>
                  <span className="text-xs text-gray-500">Medical Information</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href="https://www.halodoc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 btn-touch text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="flex-1 text-left">
                  <span className="block">Halodoc</span>
                  <span className="text-xs text-gray-500">Online Healthcare</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href="https://www.who.int/news"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 btn-touch text-gray-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.615a1 1 0 00-.553-.894l-5.553-2.776a2 2 0 01-1.115-1.794V3.615a1 1 0 00-.553-.894L7.553.776a2 2 0 00-1.106 0L1.553 2.776A1 1 0 001 3.615v4.985a2 2 0 001.115 1.794l5.553 2.776c.05.025.101.048.153.069V17a2 2 0 002 2h8a2 2 0 002-2v-1.382" />
                </svg>
                <div className="flex-1 text-left">
                  <span className="block">WHO Medical News</span>
                  <span className="text-xs text-gray-500">Global Health Updates</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href="https://www.medscape.com/news"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 btn-touch text-gray-600 hover:text-red-700 hover:bg-red-50"
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="flex-1 text-left">
                  <span className="block">Medscape News</span>
                  <span className="text-xs text-gray-500">Medical Research</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
