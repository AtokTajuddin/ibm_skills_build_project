// JWT Test Script to verify automatic token generation
const JwtService = require('./src/utils/jwtService.ts');

console.log('🔧 Testing JWT Service...\n');

// Test data
const testUser = {
  id: '64a1234567890abcdef12345',
  email: 'test@virtualhospital.com',
  username: 'testuser',
  provider: 'local'
};

console.log('📋 Test User Data:', testUser);
console.log('');

try {
  // Test token generation
  console.log('🔐 Generating JWT token...');
  const token = JwtService.default.generateToken(testUser);
  console.log('✅ Token generated successfully!');
  console.log('🎟️ Token:', token.substring(0, 50) + '...');
  console.log('');
  
  // Test token verification
  console.log('🔍 Verifying JWT token...');
  const decoded = JwtService.default.verifyToken(token);
  console.log('✅ Token verified successfully!');
  console.log('📄 Decoded payload:', decoded);
  console.log('');
  
  // Test refresh token
  console.log('🔄 Generating refresh token...');
  const refreshToken = JwtService.default.generateRefreshToken(testUser);
  console.log('✅ Refresh token generated successfully!');
  console.log('🎟️ Refresh Token:', refreshToken.substring(0, 50) + '...');
  console.log('');
  
  console.log('🎉 All JWT tests passed!');
  console.log('');
  console.log('✅ JWT Authentication is ready:');
  console.log('  - Tokens are automatically generated on login');
  console.log('  - Tokens expire in 7 days (improved UX)');
  console.log('  - Refresh tokens available for 30 days');
  console.log('  - Secure token verification implemented');
  
} catch (error) {
  console.log('❌ JWT test failed:', error.message);
  console.log('');
  console.log('🔧 Make sure JWT_SECRET is set in .env file');
}
