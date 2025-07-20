const axios = require('axios');

async function testConnection() {
    console.log('🔗 Testing backend connection...\n');
    
    try {
        // Test health endpoint first
        console.log('📡 Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:5001/api/health');
        console.log('✅ Health check:', healthResponse.data);
        
        // Test registration endpoint
        console.log('\n📝 Testing registration endpoint...');
        const userData = {
            username: 'testuser123',
            email: 'test123@example.com',
            password: 'Test123!'
        };
        
        const registerResponse = await axios.post('http://localhost:5001/api/auth/register', userData, {
            timeout: 5000
        });
        
        console.log('✅ Registration response:', registerResponse.data);
        
    } catch (error) {
        console.error('❌ Error details:');
        console.error('Code:', error.code);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n🔧 Backend is not running or not accessible on port 5001');
        }
    }
}

testConnection();
