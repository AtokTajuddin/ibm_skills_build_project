import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import User from '../models/User';

export class DownloadController {
  
  /**
   * Download consultation history as HTML file
   */
  async downloadConsultationHTML(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      console.log(`Generating HTML download for conversation ${id}, user ${userId}`);

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Find the conversation
      const conversation = await Conversation.findOne({ 
        _id: id, 
        userId: userId 
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found or access denied' });
      }

      // Get user info for personalization
      const user = await User.findById(userId);
      const patientName = user?.username || user?.name || 'Patient';

      // Generate HTML content
      const htmlContent = this.generateConsultationHTML(conversation, patientName);
      
      // Set headers for file download
      const filename = `consultation_${conversation.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'history'}_${new Date().toISOString().split('T')[0]}.html`;
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', Buffer.byteLength(htmlContent, 'utf8'));
      
      console.log(`📥 Sending HTML download: ${filename}`);
      res.send(htmlContent);

    } catch (error: any) {
      console.error('Download error:', error);
      res.status(500).json({ 
        error: 'Failed to generate consultation download', 
        message: error.message 
      });
    }
  }

  /**
   * Get consultation data as JSON for frontend display
   */
  async getConsultationData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Find the conversation
      const conversation = await Conversation.findOne({ 
        _id: id, 
        userId: userId 
      });

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found or access denied' });
      }

      // Get user info
      const user = await User.findById(userId);
      const patientName = user?.username || user?.name || 'Patient';

      res.json({
        success: true,
        consultation: {
          id: conversation._id,
          title: conversation.title,
          date: conversation.createdAt,
          patientName: patientName,
          messages: conversation.messages,
          messageCount: conversation.messages?.length || 0
        }
      });

    } catch (error: any) {
      console.error('Get consultation data error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve consultation data', 
        message: error.message 
      });
    }
  }

  /**
   * Generate beautiful HTML for consultation
   */
  private generateConsultationHTML(conversation: any, patientName: string): string {
    const title = conversation.title || 'Medical Consultation';
    const date = new Date(conversation.createdAt);
    
    const messagesHTML = conversation.messages?.map((msg: any, index: number) => {
      const role = msg.role === 'user' ? 'Patient' : 'Virtual Doctor';
      const bgColor = msg.role === 'user' ? '#e6f7ff' : '#f6ffed';
      const borderColor = msg.role === 'user' ? '#1890ff' : '#52c41a';
      const content = msg.content || '[No content available]';
      const timestamp = new Date(msg.timestamp);
      
      return `
        <div class="message-box" style="margin-bottom: 20px; padding: 20px; background-color: ${bgColor}; border-left: 5px solid ${borderColor}; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div class="message-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: ${borderColor}; font-size: 16px;">${role}</strong>
            <span style="color: #666; font-size: 14px;">${timestamp.toLocaleString()}</span>
          </div>
          <div class="message-content" style="white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${content}</div>
        </div>
      `;
    }).join('') || '<p style="text-align: center; color: #999;">No messages found in this consultation.</p>';

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} - Virtual Hospital</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              max-width: 900px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #f8f9fa;
              color: #333;
            }
            
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            
            .header { 
              text-align: center;
              margin-bottom: 40px; 
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 8px;
            }
            
            .header h1 { 
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            
            .consultation-info {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border: 1px solid #dee2e6;
            }
            
            .consultation-info h2 {
              margin-top: 0;
              color: #495057;
              font-size: 20px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-top: 15px;
            }
            
            .info-item {
              padding: 10px;
              background-color: white;
              border-radius: 6px;
              border: 1px solid #e9ecef;
            }
            
            .info-label {
              font-weight: 600;
              color: #6c757d;
              font-size: 14px;
              margin-bottom: 5px;
            }
            
            .info-value {
              font-size: 16px;
              color: #212529;
            }
            
            .conversation-section {
              margin: 30px 0;
            }
            
            .conversation-section h2 {
              color: #495057;
              border-bottom: 3px solid #007bff;
              padding-bottom: 10px;
              margin-bottom: 25px;
            }
            
            .disclaimer { 
              margin-top: 40px; 
              padding: 20px; 
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              font-size: 14px; 
              color: #856404;
            }
            
            .disclaimer h3 {
              margin-top: 0;
              color: #856404;
            }
            
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              background-color: #f8f9fa;
              border-radius: 8px;
              font-size: 12px;
              color: #6c757d;
            }
            
            @media print {
              body { background-color: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 Virtual Hospital</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Medical Consultation Report</p>
            </div>
            
            <div class="consultation-info">
              <h2>📋 Consultation Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Patient Name</div>
                  <div class="info-value">${patientName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Consultation Title</div>
                  <div class="info-value">${title}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Date</div>
                  <div class="info-value">${date.toLocaleDateString()}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Time</div>
                  <div class="info-value">${date.toLocaleTimeString()}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Messages</div>
                  <div class="info-value">${conversation.messages?.length || 0} exchanges</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Generated</div>
                  <div class="info-value">${new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <div class="conversation-section">
              <h2>💬 Conversation History</h2>
              ${messagesHTML}
            </div>
            
            <div class="disclaimer">
              <h3>⚠️ Important Medical Disclaimer</h3>
              <p><strong>This consultation was conducted with an AI-powered virtual doctor.</strong> The information provided should not be considered as professional medical advice, diagnosis, or treatment.</p>
              <p>Always consult with a qualified healthcare professional for proper medical advice, diagnosis, and treatment. In case of emergency, contact your local emergency services immediately.</p>
              <p>The Virtual Hospital AI is designed to provide general health information and guidance, but cannot replace the expertise of licensed medical professionals.</p>
            </div>
            
            <div class="footer">
              <p><strong>Virtual Hospital</strong> - AI-Powered Healthcare Consultation Platform</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default new DownloadController();
