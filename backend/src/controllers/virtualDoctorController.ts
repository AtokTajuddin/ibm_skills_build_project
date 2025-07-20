import { Request, Response } from 'express';
import axios from 'axios';
import Conversation from '../models/Conversation';
import emailService from '../utils/emailService';
import mongoose from 'mongoose';

export class VirtualDoctorController {
  /**
   * Send a message to the virtual doctor
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const { message, conversationId } = req.body;
      // Cast req.user to any to avoid TypeScript errors
      const userId = req.user ? (req.user as any)._id : null;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Get LLM API key from environment variables
      const apiKey = process.env.LLM_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: 'LLM API key not configured' });
      }
      
      // Call the OpenRouter.ai API
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "nousresearch/deephermes-3-llama-3-8b-preview:free", // Using the specified model
          messages: [
            {
              role: "system",
              content: `Hi ai you are a virtual doctor maestro, besides being an expert doctor you are also a professor in indonesia so of course you are very expert in the field of medicine and biology. You are an advanced virtual doctor assistant for a virtual hospital in Indonesia. give a detailed explanation to someone who talks to you you can also freely add analogies to facilitate the explanation.

Important guidelines:
1. Provide thorough, detailed responses to medical queries while clarifying you are an AI assistant, not a real doctor
2. When analyzing symptoms, consider multiple possible causes and explain each one in detail
3. Include relevant medical information such as common symptoms, treatment options, and preventive measures
4. Recommend specific Indonesian healthcare resources like Halodoc, Alodokter, or KlikDokter when appropriate
5. For emergency situations, explain why immediate care is needed and what steps to take
6. Respond in the same language as the user's question (Bahasa Indonesia or English)
7. Avoid giving generic, limited responses - always aim to be comprehensive and educational
8. Structure longer responses with clear sections and bullet points when appropriate`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 2000,
          temperature: 0.4,
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://virtualhospital.com', // Your site URL
            'X-Title': 'Virtual Hospital' // Your application name
          }
        }
      );
      
      // Extract response from the API
      let aiResponse = '';
      
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        aiResponse = response.data.choices[0].message.content || '';
      } else {
        console.error('Unexpected API response format:', response.data);
        aiResponse = 'I apologize, but I encountered an issue processing your request.';
      }
      
      // Save conversation to database if user is authenticated
      let savedConversation = null;
      if (userId) {
        try {
          if (conversationId) {
            // Update existing conversation
            savedConversation = await Conversation.findById(conversationId);
            
            if (savedConversation) {
              savedConversation.messages.push(
                { role: 'user', content: message, timestamp: new Date() },
                { role: 'assistant', content: aiResponse, timestamp: new Date() }
              );
              savedConversation.updatedAt = new Date();
              await savedConversation.save();
            }
          } else {
            // Create new conversation
            savedConversation = await Conversation.create({
              userId,
              messages: [
                { role: 'user', content: message, timestamp: new Date() },
                { role: 'assistant', content: aiResponse, timestamp: new Date() }
              ],
              title: `Consultation ${new Date().toLocaleDateString()}`,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        } catch (dbError) {
          console.error('Error saving conversation:', dbError);
          // Continue even if saving fails - don't block the response
        }
      }

      res.status(200).json({
        response: aiResponse,
        conversationId: savedConversation?._id || null
      });
    } catch (error: any) {
      console.error('Error calling LLM API:', error);
      res.status(500).json({ 
        error: 'Failed to process your request',
        details: error.response?.data?.error || error.message || 'Unknown error'
      });
    }
  }

  /**
   * Get conversation history for a user
   */
  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?._id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const conversations = await Conversation.find({ userId })
        .select('_id title createdAt updatedAt')
        .sort({ updatedAt: -1 });

      res.status(200).json(conversations);
    } catch (error) {
      console.error('Error retrieving conversations:', error);
      res.status(500).json({ error: 'Failed to retrieve conversations' });
    }
  }

  /**
   * Get a specific conversation by ID
   */
  async getConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const conversation = await Conversation.findOne({
        _id: id,
        userId
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.status(200).json(conversation);
    } catch (error) {
      console.error('Error retrieving conversation:', error);
      res.status(500).json({ error: 'Failed to retrieve conversation' });
    }
  }

  /**
   * Email conversation history to the user
   */
  async emailConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const userId = (req.user as any)?._id;
      
      console.log(`Attempting to email conversation ${id} to ${email}`);
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Validate email
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: 'Valid email address is required' });
      }

      // Find the conversation
      console.log(`Finding conversation ${id} for user ${userId}`);
      const conversation = await Conversation.findOne({
        _id: id,
        userId
      });

      if (!conversation) {
        console.log(`Conversation ${id} not found for user ${userId}`);
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      console.log(`Found conversation with title: ${conversation.title}`);
      console.log(`Conversation has ${conversation.messages?.length || 0} messages`);
      console.log('Conversation messages preview:', conversation.messages?.map((msg, i) => ({
        index: i + 1,
        role: msg.role,
        contentLength: msg.content?.length || 0,
        timestamp: msg.timestamp
      })));

      // Get user name for email
      const user = await mongoose.model('User').findById(userId);
      const patientName = user?.name || user?.username || 'Patient';
      console.log(`Using patient name: ${patientName}`);

      // Generate and send email
      console.log(`Sending email to ${email}`);
      const emailSuccess = await emailService.sendConversationHistory(
        email,
        conversation,
        patientName
      );

      // Track the email sending in the conversation history
      try {
        // Use the method if it exists on the document instance
        // TypeScript doesn't recognize methods added via schema.methods
        // so we need to use a type assertion
        const conversationDoc = conversation as any;
        if (typeof conversationDoc.addEmailHistory === 'function') {
          await conversationDoc.addEmailHistory(email, emailSuccess);
          console.log('Email history tracked using model method');
        } else {
          // Fallback if the method isn't available
          if (!conversation.emailHistory) {
            conversation.emailHistory = [];
          }
          
          conversation.emailHistory.push({
            sentTo: email,
            sentAt: new Date(),
            success: emailSuccess
          });
          
          await conversation.save();
          console.log('Email history added directly to conversation document');
        }
      } catch (trackingError) {
        console.error('Failed to track email history:', trackingError);
        // Continue even if tracking fails
      }

      if (!emailSuccess) {
        console.log('Email service returned failure');
        return res.status(500).json({ error: 'Failed to send email' });
      }

      console.log('Email sent successfully');
      res.status(200).json({
        success: true,
        message: 'Conversation history sent to your email'
      });
    } catch (error: any) {
      console.error('Error emailing conversation:', error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      res.status(500).json({ 
        error: 'Failed to send email',
        details: error.message || 'Unknown error'
      });
    }
  }

  /**
   * Set up test email credentials (development only)
   */
  async setupTestEmail(req: Request, res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Not available in production' });
    }

    try {
      const credentials = await emailService.generateTestCredentials();
      res.status(200).json(credentials);
    } catch (error) {
      console.error('Error setting up test email:', error);
      res.status(500).json({ error: 'Failed to set up test email' });
    }
  }
}
