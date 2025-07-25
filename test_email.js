// Quick Email Test Script for Virtual Hospital
// Run this after setting up Gmail App Password to test email sending

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('🔧 Testing Gmail Email Configuration...\n');
    
    // Check environment variables
    console.log('📋 Configuration Check:');
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'Not set');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***hidden***' : 'Not set');
    console.log('');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here') {
        console.log('❌ ERROR: Gmail credentials not configured!');
        console.log('');
        console.log('📝 To fix this:');
        console.log('1. Go to: https://myaccount.google.com/security');
        console.log('2. Enable 2-Step Verification');
        console.log('3. Generate App Password for "Mail"');
        console.log('4. Update EMAIL_PASS in .env file');
        console.log('');
        return;
    }
    
    try {
        // Create transporter
        console.log('🔌 Creating Gmail transporter...');
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // Verify connection
        console.log('✅ Verifying Gmail connection...');
        await transporter.verify();
        console.log('✅ Gmail connection successful!');
        
        // Send test email
        console.log('📧 Sending test email...');
        const testEmailOptions = {
            from: `"Virtual Hospital NoReply" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Virtual Hospital - Email Test Successful! 🎉',
            html: `
                <h2>🎉 Congratulations!</h2>
                <p>Your Virtual Hospital email service is working perfectly!</p>
                <p><strong>Configuration:</strong></p>
                <ul>
                    <li>✅ Gmail service configured</li>
                    <li>✅ App Password working</li>
                    <li>✅ Email sending functional</li>
                </ul>
                <p>Your patients will now receive consultation history emails in their Gmail inbox!</p>
                <hr>
                <p><small>Generated by Virtual Hospital Email Test - ${new Date().toLocaleString()}</small></p>
            `,
            text: `
Virtual Hospital Email Test Successful!

Your email service is working perfectly!
Patients will now receive consultation history emails.

Test completed: ${new Date().toLocaleString()}
            `
        };
        
        const result = await transporter.sendMail(testEmailOptions);
        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', result.messageId);
        console.log('📧 Check your Gmail inbox:', process.env.EMAIL_USER);
        console.log('');
        console.log('🎯 Next steps:');
        console.log('1. Check your Gmail inbox for the test email');
        console.log('2. If received, your Virtual Hospital email is ready!');
        console.log('3. Patients can now receive consultation history emails');
        
    } catch (error) {
        console.log('❌ Email test failed!');
        console.log('Error:', error.message);
        console.log('');
        console.log('🔧 Common fixes:');
        console.log('1. Verify 2-Step Verification is enabled');
        console.log('2. Double-check your App Password (16 characters)');
        console.log('3. Make sure EMAIL_USER is your full Gmail address');
        console.log('4. Try generating a new App Password');
    }
}

// Run the test
testEmail();
