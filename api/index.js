// Vercel Serverless Function Entry Point
// Virtual Hospital API

require('dotenv').config();

// Validate environment variables in production
if (process.env.NODE_ENV === 'production') {
  const { validateEnvironment } = require('../validate-env');
  validateEnvironment();
}

// Import the backend app
const path = require('path');
const backendPath = path.join(__dirname, '../backend/src/app.js');

let app;
try {
  app = require(backendPath);
} catch (error) {
  console.error('Failed to load backend app:', error);
  
  // Fallback simple API for health checks
  module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'GET' && req.url === '/api/health') {
      return res.status(200).json({
        status: 'error',
        message: 'Backend app failed to load',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    return res.status(500).json({
      error: 'Backend initialization failed',
      message: error.message
    });
  };
  return;
}

// Security headers for production
function addSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

// Main handler
module.exports = (req, res) => {
  // Add security headers
  addSecurityHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/api/health') {
    return res.status(200).json({
      status: 'ok',
      service: 'Virtual Hospital API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  }
  
  // Pass to main app
  try {
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};
