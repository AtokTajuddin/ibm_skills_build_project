import nodemailer from 'nodemailer';
import { IConversation } from '../models/Conversation';

class EmailService {
  private transporter!: nodemailer.Transporter; // Using the definite assignment assertion

  constructor() {
    // Initialize the email service
    this.initializeTransporter();
  }
  
  /**
   * Initialize the email transporter with credentials
   */
  private async initializeTransporter() {
    try {
      // Check if we have email credentials in environment variables
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('Using configured email credentials');
        
        // Check what type of service we should use
        const emailService = process.env.EMAIL_SERVICE?.toLowerCase();
        
        if (emailService === 'gmail') {
          // Use Gmail as the provider
          this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS // This should be an app password for Gmail
            }
          });
          console.log('Gmail email service configured');
        } else if (emailService === 'outlook') {
          // Use Outlook as the provider
          this.transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          console.log('Outlook email service configured');
        } else {
          // Use custom SMTP settings
          this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          console.log('Custom SMTP email service configured');
        }
      } else {
        console.log('No email credentials found, creating test account');
        // Create a test account on Ethereal Email (for development only)
        const testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        
        console.log('Created test email account:', testAccount.user);
        console.log('IMPORTANT: This is a fake email service for testing. Emails will not be delivered to real recipients.');
        console.log('To send real emails, set EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS environment variables.');
      }
    } catch (error) {
      console.error('Error setting up email transporter:', error);
      // Fallback to a basic transporter that will likely fail
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: ''
        }
      });
    }
  }

  /**
   * Generate HTML content for conversation
   */
  private generateConversationHTML(conversation: IConversation): string {
    console.log('Generating HTML for conversation:', {
      id: conversation._id,
      title: conversation.title,
      messageCount: conversation.messages?.length || 0,
      messages: conversation.messages?.map(m => ({ role: m.role, contentLength: m.content?.length || 0 }))
    });
    
    const title = `<h1>${conversation.title || 'Medical Consultation'}</h1>`;
    
    const dateInfo = `
      <p>
        <strong>Date:</strong> ${new Date(conversation.createdAt).toLocaleDateString()}
        <br><strong>Time:</strong> ${new Date(conversation.createdAt).toLocaleTimeString()}
      </p>
    `;
    
    // Check if messages exist and are not empty
    if (!conversation.messages || conversation.messages.length === 0) {
      console.warn('No messages found in conversation for email generation');
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${conversation.title || 'Medical Consultation'}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #2c3e50; }
              .header { margin-bottom: 30px; }
              .error { color: #d9534f; background-color: #f2dede; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              ${title}
              ${dateInfo}
            </div>
            <div class="error">
              <p><strong>Error:</strong> No conversation messages found to include in this email.</p>
              <p>This might indicate a technical issue. Please contact support if this problem persists.</p>
            </div>
          </body>
        </html>
      `;
    }
    
    const messagesHTML = conversation.messages.map((msg, index) => {
      console.log(`Processing message ${index + 1}: role=${msg.role}, contentLength=${msg.content?.length || 0}`);
      
      const role = msg.role === 'user' ? 'Patient' : 'Virtual Doctor';
      const bgColor = msg.role === 'user' ? '#e6f7ff' : '#f6ffed';
      const borderColor = msg.role === 'user' ? '#91d5ff' : '#b7eb8f';
      
      // Ensure content exists
      const content = msg.content || '[No content available]';
      
      return `
        <div style="margin-bottom: 15px; padding: 15px; background-color: ${bgColor}; border-left: 4px solid ${borderColor}; border-radius: 5px;">
          <p style="margin: 0 0 10px 0;"><strong>${role}:</strong> <span style="color: #666; font-size: 0.9em;">${new Date(msg.timestamp).toLocaleTimeString()}</span></p>
          <div style="white-space: pre-wrap; line-height: 1.5;">${content}</div>
        </div>
      `;
    }).join('');
    
    console.log(`Generated HTML for ${conversation.messages.length} messages`);
    
    const disclaimer = `
      <div style="margin-top: 30px; padding: 15px; border-top: 2px solid #ccc; font-size: 12px; color: #666; background-color: #f8f9fa;">
        <p><strong>Disclaimer:</strong> This consultation was conducted with an AI-powered virtual doctor. 
        The information provided should not be considered as professional medical advice. 
        Please consult with a licensed healthcare professional for proper medical advice and treatment.</p>
        <p style="margin-top: 10px;"><strong>Generated by Virtual Hospital</strong> - ${new Date().toISOString().split('T')[0]}</p>
      </div>
    `;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${conversation.title || 'Medical Consultation'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #ffffff;
            }
            h1 { 
              color: #2c3e50; 
              border-bottom: 3px solid #3498db; 
              padding-bottom: 10px; 
            }
            .header { 
              margin-bottom: 30px; 
              background-color: #f8f9fa; 
              padding: 15px; 
              border-radius: 5px; 
            }
            .conversation {
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${title}
            ${dateInfo}
          </div>
          <div class="conversation">
            <h2 style="color: #2c3e50; border-bottom: 1px solid #dee2e6; padding-bottom: 5px;">Conversation History</h2>
            ${messagesHTML}
          </div>
          ${disclaimer}
        </body>
      </html>
    `;
  }

  /**
   * Generate text content for conversation
   */
  private generateTextVersion(conversation: IConversation): string {
    console.log('Generating text version for conversation:', {
      id: conversation._id,
      title: conversation.title,
      messageCount: conversation.messages?.length || 0
    });
    
    let content = `${conversation.title || 'Medical Consultation'}\n`;
    content += `${'='.repeat(50)}\n`;
    content += `Date: ${new Date(conversation.createdAt).toLocaleDateString()}\n`;
    content += `Time: ${new Date(conversation.createdAt).toLocaleTimeString()}\n\n`;
    
    if (!conversation.messages || conversation.messages.length === 0) {
      content += `ERROR: No conversation messages found to include in this email.\n`;
      content += `This might indicate a technical issue. Please contact support if this problem persists.\n\n`;
    } else {
      content += `CONVERSATION HISTORY:\n`;
      content += `${'-'.repeat(30)}\n\n`;
      
      conversation.messages.forEach((msg, index) => {
        const role = msg.role === 'user' ? 'PATIENT' : 'VIRTUAL DOCTOR';
        const timestamp = new Date(msg.timestamp).toLocaleTimeString();
        const messageContent = msg.content || '[No content available]';
        
        content += `${index + 1}. ${role} (${timestamp}):\n`;
        content += `${messageContent}\n\n`;
      });
    }
    
    content += `\n${'='.repeat(50)}\n`;
    content += `DISCLAIMER: This consultation was conducted with an AI-powered virtual doctor. `;
    content += `The information provided should not be considered as professional medical advice. `;
    content += `Please consult with a licensed healthcare professional for proper medical advice and treatment.\n\n`;
    content += `Generated by Virtual Hospital - ${new Date().toISOString().split('T')[0]}`;
    
    console.log(`Generated text version with ${conversation.messages?.length || 0} messages`);
    return content;
  }

  /**
   * Send conversation history via email
   */
  async sendConversationHistory(
    toEmail: string, 
    conversation: IConversation,
    patientName: string
  ): Promise<boolean> {
    try {
      console.log('=== EMAIL SENDING DEBUG INFO ===');
      console.log('Preparing to send email to', toEmail);
      console.log('Email service configuration:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        emailService: process.env.EMAIL_SERVICE || 'not set',
        isUsingRealEmail: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
      });
      
      // If transporter not initialized or auth is missing, reinitialize
      if (!this.transporter || !(this.transporter as any).options?.auth?.user) {
        console.log('Transporter not properly initialized, reinitializing...');
        await this.initializeTransporter();
      }
      
      // Verify the connection to the SMTP server
      try {
        await this.transporter.verify();
        console.log('SMTP connection verified successfully');
      } catch (verifyError) {
        console.error('SMTP connection failed verification:', verifyError);
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          console.error('ERROR: Gmail credentials might be incorrect. Please check:');
          console.error('1. EMAIL_USER is your Gmail address');
          console.error('2. EMAIL_PASS is your Gmail App Password (16 characters)');
          console.error('3. 2-Step Verification is enabled on your Google account');
        }
        throw new Error('Email server connection failed');
      }
      
      const htmlContent = this.generateConversationHTML(conversation);
      const textContent = this.generateTextVersion(conversation);
      
      // Create a proper FROM address
      let fromEmail = process.env.EMAIL_USER || 'noreply@virtualhospital.com';
      let fromName = 'Virtual Hospital NoReply';
      
      // Gmail requires that the "from" address matches the authenticated user
      if (process.env.EMAIL_SERVICE?.toLowerCase() === 'gmail' && process.env.EMAIL_USER) {
        fromEmail = process.env.EMAIL_USER;
        fromName = 'Virtual Hospital NoReply';
        console.log('Using Gmail service with authenticated sender:', fromEmail);
        console.log('Display name set to:', fromName);
      } else {
        console.log('Using test email service - emails will not be delivered to real recipients');
      }
      
      console.log('Email content generated, sending email...');
      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: toEmail,
        subject: `Virtual Hospital - Medical Consultation: ${conversation.title}`,
        text: textContent,
        html: htmlContent,
        headers: {
          'X-Secure': 'true',
          'X-Entity-Ref-ID': conversation._id ? conversation._id.toString() : 'unknown',
          'X-Mailer': 'Virtual Hospital v1.0'
        }
      };
      
      console.log('Sending with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        htmlLength: htmlContent.length,
        textLength: textContent.length
      });
      
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', info.messageId);
      
      // For Ethereal test emails, provide a preview URL
      const testUrl = nodemailer.getTestMessageUrl(info);
      if (testUrl) {
        console.log('⚠️  THIS IS A TEST EMAIL - NOT DELIVERED TO REAL RECIPIENT');
        console.log('Preview URL:', testUrl);
        console.log('📧 To send real emails, configure EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS in .env file');
        console.log('📖 See GMAIL_SETUP.md for detailed instructions');
      } else {
        console.log('✅ REAL EMAIL SENT to', toEmail);
        console.log('📧 Check your Gmail inbox for the consultation history');
      }
      
      console.log('=== END EMAIL DEBUG INFO ===');
      return true;
    } catch (error: any) {
      console.log('=== EMAIL ERROR DEBUG INFO ===');
      console.error('Error sending email:', error.message);
      console.error('Error details:', error);
      
      if (error.code === 'EAUTH') {
        console.error('❌ GMAIL AUTHENTICATION FAILED');
        console.error('This usually means:');
        console.error('1. EMAIL_USER or EMAIL_PASS is incorrect');
        console.error('2. You\'re using your regular password instead of App Password');
        console.error('3. 2-Step Verification is not enabled');
        console.error('📖 See GMAIL_SETUP.md for setup instructions');
      }
      
      // Only try Ethereal as a fallback if we're not already using it
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        try {
          console.log('Attempting to send via test account as fallback...');
          const testAccount = await nodemailer.createTestAccount();
          
          this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass
            }
          });
          
          console.log('Created new test email account:', testAccount.user);
          
          // Try sending again with the new account
          const htmlContent = this.generateConversationHTML(conversation);
          const textContent = this.generateTextVersion(conversation);
          
          const info = await this.transporter.sendMail({
            from: `"Virtual Hospital" <noreply@virtualhospital.com>`,
            to: toEmail,
            subject: `Virtual Hospital - Medical Consultation: ${conversation.title}`,
            text: textContent,
            html: htmlContent
          });
          
          console.log('Test email sent as fallback:', info.messageId);
          const testUrl = nodemailer.getTestMessageUrl(info);
          if (testUrl) {
            console.log('Preview URL:', testUrl);
            console.log('⚠️  IMPORTANT: This is a fake email and will not be delivered to the recipient.');
          }
          
          return true;
        } catch (retryError) {
          console.error('Error on fallback attempt:', retryError);
          return false;
        }
      }
      
      console.log('=== END EMAIL ERROR DEBUG INFO ===');
      return false;
    }
  }

  /**
   * Generate test credentials for development
   */
  async generateTestCredentials(): Promise<{user: string, pass: string, preview: string}> {
    try {
      // Create a test account on Ethereal Email (for development only)
      const testAccount = await nodemailer.createTestAccount();
      
      return {
        user: testAccount.user,
        pass: testAccount.pass,
        preview: `https://ethereal.email/message/`
      };
    } catch (error) {
      console.error('Failed to create test email account:', error);
      return {
        user: '',
        pass: '',
        preview: ''
      };
    }
  }
}

export default new EmailService();
