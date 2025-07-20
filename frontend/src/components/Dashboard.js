import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import VirtualDoctor from './VirtualDoctor';
import Navigation from './Navigation';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVirtualDoctor, setShowVirtualDoctor] = useState(false);
  const [stats, setStats] = useState({
    consultations: 0,
    lastVisit: 'Never',
    healthScore: 85
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load user stats (mock data for now)
    setStats({
      consultations: Math.floor(Math.random() * 10) + 1,
      lastVisit: new Date().toLocaleDateString(),
      healthScore: Math.floor(Math.random() * 20) + 80
    });

    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  if (showVirtualDoctor) {
    return <VirtualDoctor onBack={() => setShowVirtualDoctor(false)} />;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {/* Welcome Header */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 mb-6 lg:mb-8 animate-scale-in">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-4 lg:mb-0 w-full lg:w-auto">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {getTimeGreeting()}, {user?.username || user?.displayName || 'Patient'}! 👋
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  Welcome to your personal AI healthcare dashboard
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {currentTime.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString('id-ID')}
                </p>
              </div>
              <div className="flex-shrink-0 mt-4 lg:mt-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                  <span className="text-4xl sm:text-5xl lg:text-6xl">🏥</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Consultations</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.consultations}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">💬</span>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.healthScore}%</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">💚</span>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 animate-slide-up sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Last Visit</p>
                  <p className="text-lg sm:text-lg font-bold text-purple-600">{stats.lastVisit}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">📅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Action Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 mb-6 lg:mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full mb-4 sm:mb-6 animate-pulse">
                <span className="text-4xl sm:text-5xl">🤖</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                Your AI Doctor is Ready!
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
                Get instant medical consultation powered by advanced AI technology. 
                Ask about symptoms, medications, health tips, or general medical advice.
              </p>
              <button
                onClick={() => setShowVirtualDoctor(true)}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm sm:text-base"
              >
                <span className="mr-2 sm:mr-3 text-xl sm:text-2xl">💊</span>
                Start AI Consultation
                <span className="ml-2 sm:ml-3">→</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
            {/* Symptom Checker */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">🩺</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Symptom Checker</h3>
                <p className="text-gray-600 text-sm mb-3 sm:mb-4">
                  Describe your symptoms and get instant AI analysis
                </p>
                <button 
                  onClick={() => setShowVirtualDoctor(true)}
                  className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Check Symptoms
                </button>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🍎</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Health Tips</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get personalized health and wellness advice
                </p>
                <button 
                  onClick={() => setShowVirtualDoctor(true)}
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Get Tips
                </button>
              </div>
            </div>

            {/* Medication Info */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Medication Guide</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn about medications and drug interactions
                </p>
                <button 
                  onClick={() => setShowVirtualDoctor(true)}
                  className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Check Medication
                </button>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50/70 backdrop-blur-lg border border-amber-200 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Important Medical Disclaimer
                </h3>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Our AI assistant provides general health information and educational content. 
                  This service is not a substitute for professional medical advice, diagnosis, or treatment. 
                  Always seek the advice of qualified healthcare providers with any questions about your health conditions. 
                  In case of medical emergencies, contact emergency services immediately.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                    🚨 Emergency: 119 (Indonesia)
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                    🏥 For serious conditions: Visit nearest hospital
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
