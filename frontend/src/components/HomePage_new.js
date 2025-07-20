import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🤖',
      title: 'AI Virtual Doctor',
      description: 'Advanced AI technology for instant health consultations and symptom analysis',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: '⚡',
      title: 'Instant Consultations',
      description: '24/7 availability with real-time AI responses for your health questions',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Enterprise-grade security to protect your sensitive health information',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: '🌍',
      title: 'Indonesian Healthcare',
      description: 'Designed for Indonesian patients with bilingual support',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Healthcare Technology Specialist',
      content: 'This AI platform represents the future of accessible healthcare in Indonesia.',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Ahmad Ridwan',
      role: 'Software Engineer',
      content: 'Incredibly intuitive interface with powerful AI capabilities. Game-changing!',
      avatar: '👨‍💻'
    },
    {
      name: 'Maria Santos',
      role: 'Healthcare Administrator',
      content: 'The seamless integration and user experience exceeded all expectations.',
      avatar: '👩‍💼'
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
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Virtual Hospital</h1>
              <p className="text-blue-200 text-sm">AI Healthcare Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <span className="flex items-center">
                  <span className="mr-2">🏠</span>
                  Dashboard
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 text-white hover:text-blue-200 font-medium transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full mb-8 animate-bounce-slow">
            <span className="text-5xl">🚀</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            The Future of
            <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              AI Healthcare
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Experience revolutionary healthcare with our advanced AI virtual doctor. 
            Get instant medical consultations, symptom analysis, and personalized health guidance 
            available 24/7 in both English and Indonesian.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="flex items-center">
                  <span className="mr-3">🤖</span>
                  Start AI Consultation
                  <span className="ml-3">→</span>
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <span className="flex items-center">
                    <span className="mr-3">✨</span>
                    Start Free Consultation
                    <span className="ml-3">→</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:bg-white/20 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    <span className="mr-3">🔐</span>
                    Sign In
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-blue-200">AI Doctor Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-blue-200">Free Consultations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">🇮🇩</div>
              <div className="text-blue-200">Indonesian Optimized</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white/5 backdrop-blur-lg py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
              Why Choose Our AI Healthcare Platform?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto animate-slide-up">
              Cutting-edge technology meets compassionate care in our revolutionary virtual hospital platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">{feature.title}</h3>
                <p className="text-blue-100 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-blue-100 animate-slide-up">
              See what industry experts are saying about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{testimonial.avatar}</span>
                  </div>
                  <p className="text-blue-100 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-blue-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mb-8">
              <span className="text-4xl">💎</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of users who trust our AI-powered virtual hospital for their healthcare needs. 
              Start your free consultation today!
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-3">🚀</span>
                    Get Started Now
                    <span className="ml-3">→</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:bg-white/20 transform hover:scale-105"
                >
                  Already a member? Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-black/20 backdrop-blur-lg py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Virtual Hospital AI</h3>
                <p className="text-blue-200 text-sm">The Future of Healthcare</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-blue-200">
              <span className="text-sm">© 2024 Virtual Hospital AI</span>
              <span className="text-sm">Made with ❤️ for Indonesian Healthcare</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-4 max-w-4xl mx-auto">
              <div className="flex items-start justify-center text-left">
                <span className="text-amber-300 mr-3 mt-1">⚠️</span>
                <div className="text-amber-100 text-sm">
                  <p className="font-semibold mb-2">Important Medical Disclaimer</p>
                  <p>
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
