// Environment Configuration Manager
// Handles environment variables with fallbacks and validation

const path = require('path');
const fs = require('fs');

class EnvironmentConfig {
  constructor() {
    this.loadEnvironment();
    this.validateConfig();
  }

  loadEnvironment() {
    // Try to load .env file if it exists (for local development)
    try {
      const envPath = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        require('dotenv').config({ path: envPath });
        console.log('✅ Local .env file loaded');
      } else {
        console.log('ℹ️  No .env file found, using system environment variables');
      }
    } catch (error) {
      console.log('ℹ️  dotenv not available, using system environment variables');
    }
  }

  validateConfig() {
    const required = [
      'LLM_API_KEY',
      'MONGODB_URI', 
      'JWT_SECRET'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Production requires these environment variables: ${missing.join(', ')}`);
      } else {
        console.warn('⚠️  Development mode: some features may not work without proper configuration');
      }
    }
  }

  // Get configuration with fallbacks
  get(key, fallback = null) {
    return process.env[key] || fallback;
  }

  // Database configuration
  getDatabase() {
    return {
      uri: this.get('MONGODB_URI', 'mongodb://localhost:27017/virtualhospital'),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    };
  }

  // JWT configuration
  getJWT() {
    return {
      secret: this.get('JWT_SECRET', 'development_jwt_secret_change_in_production'),
      expiresIn: this.get('JWT_EXPIRES_IN', '24h')
    };
  }

  // LLM API configuration
  getLLM() {
    return {
      apiKey: this.get('LLM_API_KEY'),
      baseURL: this.get('LLM_BASE_URL', 'https://openrouter.ai/api/v1')
    };
  }

  // Firebase configuration
  getFirebase() {
    return {
      apiKey: this.get('FIREBASE_API_KEY'),
      authDomain: this.get('FIREBASE_AUTH_DOMAIN'),
      projectId: this.get('FIREBASE_PROJECT_ID'),
      storageBucket: this.get('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.get('FIREBASE_MESSAGING_SENDER_ID'),
      appId: this.get('FIREBASE_APP_ID')
    };
  }

  // Server configuration
  getServer() {
    return {
      port: parseInt(this.get('PORT', '5001')),
      frontendUrl: this.get('FRONTEND_URL', 'http://localhost:3000'),
      nodeEnv: this.get('NODE_ENV', 'development'),
      corsOrigin: this.get('CORS_ORIGIN', '*')
    };
  }

  // Check if running in production
  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  // Check if all required services are configured
  isFullyConfigured() {
    const llm = this.getLLM();
    const db = this.getDatabase();
    const jwt = this.getJWT();
    
    return !!(llm.apiKey && db.uri && jwt.secret);
  }

  // Get service status
  getStatus() {
    const config = {
      environment: this.get('NODE_ENV', 'development'),
      hasLLMKey: !!this.get('LLM_API_KEY'),
      hasDatabase: !!this.get('MONGODB_URI'),
      hasJWTSecret: !!this.get('JWT_SECRET'),
      hasFirebase: !!this.get('FIREBASE_PROJECT_ID'),
      fullyConfigured: this.isFullyConfigured()
    };

    return config;
  }
}

module.exports = new EnvironmentConfig();
