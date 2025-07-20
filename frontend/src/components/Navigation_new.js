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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <span className="text-xl font-bold text-white">🏥</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Virtual Hospital
                </h1>
                <p className="text-xs text-gray-500 -mt-1">AI Healthcare Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">🏠</span>
                  Dashboard
                </span>
              </Link>
              
              <Link
                to="/virtual-doctor"
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive('/virtual-doctor')
                    ? 'bg-emerald-100 text-emerald-700 shadow-md'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Doctor
                </span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.username || user?.displayName || 'Patient'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'Healthcare Member'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {(user?.username || user?.displayName || 'P')[0].toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🚪</span>
                <span className="hidden sm:inline">Logout</span>
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
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 py-4 space-y-3 bg-white/90 backdrop-blur-lg border-t border-white/20">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {(user?.username || user?.displayName || 'P')[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {user?.username || user?.displayName || 'Patient'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'Healthcare Member'}
                </p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <span className="mr-3">🏠</span>
              Dashboard
            </Link>
            
            <Link
              to="/virtual-doctor"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive('/virtual-doctor')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className="mr-3">🤖</span>
              AI Doctor
            </Link>
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
