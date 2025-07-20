#!/usr/bin/env node

// Development Environment Setup
// Creates .env files for local development

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupDevelopmentEnvironment() {
  console.log('🏥 Virtual Hospital - Development Environment Setup');
  console.log('='.repeat(50));
  
  const envPath = path.join(__dirname, '..', '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await askQuestion('⚠️  .env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n📝 Please provide the following information:');
  console.log('(Press Enter to use default values)\n');

  // Collect configuration
  const config = {};

  // LLM API Key
  config.LLM_API_KEY = await askQuestion('🤖 LLM API Key (OpenRouter): ');
  
  // Database
  const useLocal = await askQuestion('💾 Use local MongoDB? (Y/n): ');
  if (useLocal.toLowerCase() === 'n') {
    config.MONGODB_URI = await askQuestion('📡 MongoDB URI (Atlas): ');
  } else {
    config.MONGODB_URI = 'mongodb://localhost:27017/virtualhospital';
  }

  // JWT Secret
  const jwtSecret = await askQuestion('🔐 JWT Secret (leave empty for auto-generate): ');
  config.JWT_SECRET = jwtSecret || generateSecureString(64);

  // Firebase (optional)
  const useFirebase = await askQuestion('🔥 Configure Firebase? (y/N): ');
  if (useFirebase.toLowerCase() === 'y') {
    config.FIREBASE_API_KEY = await askQuestion('Firebase API Key: ');
    config.FIREBASE_AUTH_DOMAIN = await askQuestion('Firebase Auth Domain: ');
    config.FIREBASE_PROJECT_ID = await askQuestion('Firebase Project ID: ');
    config.FIREBASE_STORAGE_BUCKET = await askQuestion('Firebase Storage Bucket: ');
    config.FIREBASE_MESSAGING_SENDER_ID = await askQuestion('Firebase Messaging Sender ID: ');
    config.FIREBASE_APP_ID = await askQuestion('Firebase App ID: ');
  }

  // Google OAuth (optional)
  const useGoogle = await askQuestion('🔍 Configure Google OAuth? (y/N): ');
  if (useGoogle.toLowerCase() === 'y') {
    config.GOOGLE_CLIENT_ID = await askQuestion('Google Client ID: ');
  }

  // Server configuration
  config.PORT = await askQuestion('🌐 Server Port (5001): ') || '5001';
  config.FRONTEND_URL = await askQuestion('🖥️  Frontend URL (http://localhost:3000): ') || 'http://localhost:3000';
  config.NODE_ENV = 'development';

  // Generate .env file
  const envContent = generateEnvFile(config);
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log(`📍 Location: ${envPath}`);
    
    // Create .env.example for reference
    const exampleContent = generateEnvExample();
    const examplePath = path.join(__dirname, '..', '.env.example');
    fs.writeFileSync(examplePath, exampleContent);
    console.log('📋 .env.example created for reference');
    
    console.log('\n🚀 You can now start the development server:');
    console.log('   npm run dev');
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }

  rl.close();
}

function generateSecureString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateEnvFile(config) {
  return `# Virtual Hospital - Development Environment
# Generated on ${new Date().toISOString()}
# DO NOT COMMIT THIS FILE TO VERSION CONTROL!

# =================================================================
# LLM API Configuration
# =================================================================
LLM_API_KEY=${config.LLM_API_KEY || ''}

# =================================================================
# Database Configuration
# =================================================================
MONGODB_URI=${config.MONGODB_URI || 'mongodb://localhost:27017/virtualhospital'}

# =================================================================
# Authentication
# =================================================================
JWT_SECRET=${config.JWT_SECRET || ''}

# =================================================================
# Firebase Configuration
# =================================================================
FIREBASE_API_KEY=${config.FIREBASE_API_KEY || ''}
FIREBASE_AUTH_DOMAIN=${config.FIREBASE_AUTH_DOMAIN || ''}
FIREBASE_PROJECT_ID=${config.FIREBASE_PROJECT_ID || ''}
FIREBASE_STORAGE_BUCKET=${config.FIREBASE_STORAGE_BUCKET || ''}
FIREBASE_MESSAGING_SENDER_ID=${config.FIREBASE_MESSAGING_SENDER_ID || ''}
FIREBASE_APP_ID=${config.FIREBASE_APP_ID || ''}

# =================================================================
# Social Authentication
# =================================================================
GOOGLE_CLIENT_ID=${config.GOOGLE_CLIENT_ID || ''}

# =================================================================
# Server Configuration
# =================================================================
PORT=${config.PORT || '5001'}
FRONTEND_URL=${config.FRONTEND_URL || 'http://localhost:3000'}
NODE_ENV=${config.NODE_ENV || 'development'}
`;
}

function generateEnvExample() {
  return `# Virtual Hospital - Environment Variables Example
# Copy this file to .env and fill in your actual values

LLM_API_KEY=your_openrouter_api_key_here
MONGODB_URI=mongodb://localhost:27017/virtualhospital
JWT_SECRET=your_secure_jwt_secret_here
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
PORT=5001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
`;
}

// Run setup if called directly
if (require.main === module) {
  setupDevelopmentEnvironment().catch(console.error);
}

module.exports = { setupDevelopmentEnvironment };
