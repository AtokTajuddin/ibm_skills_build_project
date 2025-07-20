import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
  tags?: string[];
  lastMessageAt?: Date;
  emailHistory?: {
    sentTo: string;
    sentAt: Date;
    success: boolean;
  }[];
  addEmailHistory?: (email: string, success: boolean) => Promise<any>;
}

const ConversationSchema = new Schema<IConversation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  title: {
    type: String,
    default: 'Medical Consultation'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: String,
    default: null
  },
  tags: [{
    type: String
  }],
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  emailHistory: [{
    sentTo: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    success: Boolean
  }]
});

// Add a method to track email history
ConversationSchema.methods.addEmailHistory = function(email: string, success: boolean) {
  if (!this.emailHistory) {
    this.emailHistory = [];
  }
  
  this.emailHistory.push({
    sentTo: email,
    sentAt: new Date(),
    success: success
  });
  
  return this.save();
};

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
