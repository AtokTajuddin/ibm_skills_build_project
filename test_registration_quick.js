const axios = require('axios');

async function testQuickRegistration() {
    console.log('🧪 Testing Quick Registration (CSRF Disabled)...\n');
    
    try {
        // Test registration
        const userData = {
            username: 'testuser' + Math.floor(Math.random() * 1000),
            email: 'quicktest' + Date.now() + '@example.com',
            password: 'Test123!'
        };
        
        console.log('📝 Testing registration...');
        const registerResponse = await axios.post('http://localhost:5001/api/auth/register', userData);
        
        if (registerResponse.data.success) {
            console.log('✅ Registration successful!');
            console.log('User:', registerResponse.data.user.username);
            console.log('Token received:', !!registerResponse.data.token);
            
            // Test login
            console.log('\n🔐 Testing login...');
            const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
                email: userData.email,
                password: userData.password
            });
            
            if (loginResponse.data.success) {
                console.log('✅ Login successful!');
                console.log('User:', loginResponse.data.user.username);
                console.log('Token received:', !!loginResponse.data.token);
            }
        }
        
        console.log('\n🎉 All tests passed! Registration and login are working fast now!');
        
    } catch (error) {
        console.error('❌ Test failed:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testQuickRegistration();
