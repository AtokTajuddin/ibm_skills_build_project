import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { virtualDoctorService } from '../services/api';

const VirtualDoctor = ({ onBack }) => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([
    {
      role: 'system',
      content: 'Welcome to Virtual Hospital AI! 👨‍⚕️ I am your AI healthcare assistant, ready to help with medical information, symptom analysis, and health guidance. How can I assist you today? (You can communicate in both English and Indonesian.)',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  // const [downloadForm, setDownloadForm] = useState({ show: false, downloading: false, downloaded: false, error: null });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setConversation([...conversation, userMessage]);
    setUserInput('');
    setLoading(true);
    
    try {
      const response = await virtualDoctorService.sendMessage(userInput, conversationId);
      
      if (response.data.conversationId) {
        setConversationId(response.data.conversationId);
      }
      
      const aiResponse = {
        role: 'system',
        content: response.data.response || 'I apologize, but I couldn\'t generate a response at this time. Please try again.',
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        role: 'system',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        timestamp: new Date(),
        isError: true
      };
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await virtualDoctorService.getConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadConversation = async (id) => {
    try {
      const response = await virtualDoctorService.getConversation(id);
      if (response.data.conversation) {
        setConversation(response.data.conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setConversationId(id);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const startNewConversation = () => {
    setConversation([
      {
        role: 'system',
        content: 'Welcome to Virtual Hospital AI! 👨‍⚕️ I am your AI healthcare assistant, ready to help with medical information, symptom analysis, and health guidance. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
    setConversationId(null);
    setShowHistory(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickQuestions = [
    { icon: '🤒', text: 'I have symptoms to discuss', category: 'symptoms' },
    { icon: '💊', text: 'Ask about medications', category: 'medication' },
    { icon: '🏃‍♂️', text: 'Get health tips', category: 'tips' },
    { icon: '🩺', text: 'General health question', category: 'general' }
  ];

  const handleQuickQuestion = (question) => {
    setUserInput(question.text);
  };

  const handleReturnToDashboard = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 sm:pt-20">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-white/30 shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReturnToDashboard}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800">AI Healthcare Assistant</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Always here to help with your health questions</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) loadConversationHistory();
                }}
                className="px-2 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm"
              >
                <span className="mr-1 sm:mr-2">📋</span>
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={startNewConversation}
                className="px-2 sm:px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm"
              >
                <span className="mr-1 sm:mr-2">✨</span>
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 flex gap-4 lg:gap-6 flex-col lg:flex-row">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-full lg:w-80 bg-white/70 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-xl border border-white/20 h-fit order-2 lg:order-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Conversation History
            </h3>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => loadConversation(conv._id)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <p className="font-medium text-gray-800 truncate">
                      {conv.messages[1]?.content.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conv.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </button>
                ))}
                {conversations.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No previous conversations</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Main Chat */}
        <div className="flex-1 order-1 lg:order-2">
          {/* Messages Container */}
          <div className="bg-white/70 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-xl border border-white/20 mb-4 lg:mb-6 h-80 sm:h-96 overflow-hidden">
            <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 lg:space-y-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`max-w-xs sm:max-w-sm lg:max-w-md ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl lg:rounded-2xl rounded-br-md' 
                      : message.isError
                        ? 'bg-red-50 border border-red-200 text-red-800 rounded-xl lg:rounded-2xl rounded-bl-md'
                        : 'bg-gray-100 text-gray-800 rounded-xl lg:rounded-2xl rounded-bl-md'
                  } px-3 sm:px-4 py-2 sm:py-3 shadow-lg`}>
                    {message.role === 'system' && !message.isError && (
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">🤖</span>
                        <span className="text-sm font-medium text-emerald-600">AI Assistant</span>
                      </div>
                    )}
                    {message.role === 'user' && (
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-blue-100">You</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    {message.timestamp && (
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🤖</span>
                      <span className="text-sm font-medium text-emerald-600">AI Assistant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="animate-bounce bg-emerald-500 rounded-full w-2 h-2"></div>
                      <div className="animate-bounce bg-emerald-500 rounded-full w-2 h-2" style={{ animationDelay: '0.1s' }}></div>
                      <div className="animate-bounce bg-emerald-500 rounded-full w-2 h-2" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-gray-600 text-sm ml-2">Analyzing your question...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Questions */}
          {conversation.length <= 1 && (
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200 transform hover:scale-105 border border-gray-200 hover:border-blue-300"
                  >
                    <span className="text-2xl mr-3">{question.icon}</span>
                    <span className="text-gray-700 font-medium">{question.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="bg-white/70 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask me about symptoms, medications, health tips, or any medical questions..."
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 sm:h-24 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Press Enter to send</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    AI Doctor Online
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !userInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🚀</span>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-6 bg-amber-50/70 backdrop-blur-lg border border-amber-200 rounded-xl p-4">
            <div className="flex items-start">
              <span className="text-amber-500 mr-3 mt-0.5">⚠️</span>
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Medical Disclaimer</p>
                <p>This AI assistant provides general health information for educational purposes only. It cannot replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns. In emergencies, contact emergency services immediately.</p>
              </div>
            </div>
          </div>

          {/* Return to Dashboard Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleReturnToDashboard}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualDoctor;
