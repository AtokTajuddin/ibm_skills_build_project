// Environment Variable Validation for Production
// This file validates that all required environment variables are present

const requiredEnvVars = [
  'LLM_API_KEY',
  'MONGODB_URI',
  'JWT_SECRET',
  'FIREBASE_PROJECT_ID',
  'NODE_ENV'
];

const optionalEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'GOOGLE_CLIENT_ID',
  'FRONTEND_URL',
  'PORT'
];

function validateEnvironment() {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional but recommended variables
  optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  // Log results
  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\n🚨 Production deployment will fail without these variables!');
      console.error('Add them in Vercel Dashboard: Settings > Environment Variables');
      process.exit(1);
    }
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    warnings.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
  }

  // Security checks
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET is too short! Use at least 32 characters.');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  if (process.env.LLM_API_KEY && !process.env.LLM_API_KEY.startsWith('sk-or-v1-')) {
    console.warn('⚠️  LLM_API_KEY format seems incorrect for OpenRouter');
  }

  if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost') && process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot use localhost MongoDB in production! Use MongoDB Atlas.');
    process.exit(1);
  }

  console.log('✅ Environment validation passed!');
}

module.exports = { validateEnvironment };

// Run validation if this file is executed directly
if (require.main === module) {
  validateEnvironment();
}
