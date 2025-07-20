import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Firebase authentication hook
  const { 
    signInWithGoogle: firebaseSignInWithGoogle, 
    loading: firebaseLoading, 
    error: firebaseError 
  } = useFirebaseAuth();
  
  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.login(formData);
      
      if (response.data.success) {
        login(response.data.user, response.data.token, response.data.refreshToken);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseGoogleLogin = async () => {
    setError('');
    
    try {
      const result = await firebaseSignInWithGoogle();
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Google login failed. Please try again.');
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
      console.error('Firebase Google Login Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-lg">
        {/* Main Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-white/20 rounded-full mb-4 animate-bounce-slow">
              <svg className="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-fade-in">
              Welcome Back
            </h1>
            <p className="text-white/80 text-base sm:text-lg font-medium animate-slide-up">
              Virtual Doctor Assistant
            </p>
            <p className="text-white/70 text-xs sm:text-sm mt-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Powered by Artificial Intelligence
            </p>
          </div>

          {/* AI Description */}
          <div className="bg-white/10 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-white font-semibold mb-3 flex items-center text-sm sm:text-base">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What Our AI Can Do
            </h3>
            <div className="text-white/80 text-xs sm:text-sm space-y-2">
              <p><strong>Free AI Consultations:</strong> Get instant medical guidance through our intelligent chatbot</p>
              <p><strong>Medical Expert Knowledge:</strong> Trained on extensive medical data including biology and health sciences</p>
              <p><strong>Symptom Analysis:</strong> Advanced AI algorithms to help understand your health concerns</p>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start">
              <svg className="w-4 h-4 text-amber-300 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-amber-100 text-xs sm:text-sm">
                <p className="font-medium mb-1">Important Disclaimer</p>
                <p>This AI provides analysis and suggestions but results may not always be 100% accurate. Always consult with licensed healthcare professionals for serious medical concerns.</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {(error || firebaseError) && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 animate-scale-in">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-red-100 text-xs sm:text-sm font-medium">
                  {error || firebaseError}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={onChange}
                  required
                  disabled={loading || firebaseLoading}
                  className="w-full px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 group-hover:bg-white/15 text-sm sm:text-base"
                />
                <div className="absolute inset-y-0 right-3 sm:right-4 flex items-center">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={onChange}
                  required
                  disabled={loading || firebaseLoading}
                  className="w-full px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 group-hover:bg-white/15 text-sm sm:text-base"
                />
                <div className="absolute inset-y-0 right-3 sm:right-4 flex items-center">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || firebaseLoading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sign In to Continue
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-transparent text-white/60 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleFirebaseGoogleLogin}
            disabled={loading || firebaseLoading}
            className="w-full py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-sm sm:text-base"
          >
            {firebaseLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-gray-700 mr-2"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </div>
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-white/60 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-white font-semibold hover:text-blue-200 transition-colors duration-300 underline decoration-2 underline-offset-2"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-white/80 text-xs font-medium">Instant AI Response</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-white/80 text-xs font-medium">Secure & Private</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white/80 text-xs font-medium">Completely Free</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
