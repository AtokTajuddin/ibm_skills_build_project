import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '',
      title: 'AI Virtual Doctor',
      description: 'Advanced AI technology for instant health consultations and symptom analysis',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: '',
      title: 'Instant Consultations',
      description: '24/7 availability with real-time AI responses for your health questions',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: '',
      title: 'Secure & Private',
      description: 'Enterprise-grade security to protect your sensitive health information',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: '',
      title: 'Indonesian Healthcare',
      description: 'Designed for Indonesian patients with bilingual support',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Jane Smith',
      role: 'Healthcare Technology Specialist',
      content: 'This AI platform represents the future of accessible healthcare in Indonesia.',
      avatar: ''
    },
    {
      name: 'John Doe',
      role: 'Software Engineer',
      content: 'Incredibly intuitive interface with powerful AI capabilities. Game-changing!',
      avatar: ''
    },
    {
      name: 'Sarah Johnson',
      role: 'Healthcare Administrator',
      content: 'The seamless integration and user experience exceeded all expectations.',
      avatar: ''
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/6 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Virtual Hospital</h1>
              <p className="text-blue-200 text-xs sm:text-sm">AI Healthcare Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-sm sm:text-base"
              >
                <span className="flex items-center">
                  Dashboard
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-white hover:text-blue-200 font-medium transition-colors duration-300 text-sm sm:text-base"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-sm sm:text-base"
                >
                  <span className="hidden xs:inline">Get Started</span>
                  <span className="xs:hidden">Start</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-32">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-lg rounded-full mb-6 sm:mb-8 animate-bounce-slow">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
            The Future of
            <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              AI Healthcare
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up px-4">
            Experience revolutionary healthcare with our advanced AI virtual doctor. 
            Get instant medical consultations, symptom analysis, and personalized health guidance 
            available 24/7 in both English and Indonesian.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-slide-up px-4" style={{ animationDelay: '0.3s' }}>
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  Start AI Consultation
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <span className="flex items-center justify-center">
                    Start Free Consultation
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold text-base sm:text-lg rounded-2xl transition-all duration-300 hover:bg-white/20 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    Sign In
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 animate-slide-up px-4" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-blue-200 text-sm sm:text-base">AI Doctor Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-blue-200 text-sm sm:text-base">Free Consultations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">ID</div>
              <div className="text-blue-200 text-sm sm:text-base">Indonesian Optimized</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white/5 backdrop-blur-lg py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
              Why Choose Our AI Healthcare Platform?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto animate-slide-up">
              Cutting-edge technology meets compassionate care in our revolutionary virtual hospital platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto`}>
                  {index === 0 && (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center">{feature.title}</h3>
                <p className="text-blue-100 text-center leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 animate-slide-up">
              See what industry experts are saying about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-blue-100 mb-4 sm:mb-6 leading-relaxed italic text-sm sm:text-base">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-blue-300 text-xs sm:text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/20 animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mb-6 sm:mb-8">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              Join thousands of users who trust our AI-powered virtual hospital for their healthcare needs. 
              Start your free consultation today!
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <span className="flex items-center justify-center">
                    Get Started Now
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold text-base sm:text-lg rounded-2xl transition-all duration-300 hover:bg-white/20 transform hover:scale-105"
                >
                  Already a member? Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-black/20 backdrop-blur-lg py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm sm:text-base">Virtual Hospital AI</h3>
                <p className="text-blue-200 text-xs sm:text-sm">The Future of Healthcare</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-blue-200 text-xs sm:text-sm">
              <span>© 2024 Virtual Hospital AI</span>
              <span className="hidden sm:inline">|</span>
              <span>Made with care for Indonesian Healthcare</span>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 text-center">
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 sm:p-4 max-w-4xl mx-auto">
              <div className="flex items-start justify-center text-left">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 mr-2 sm:mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
};

export default HomePage;
