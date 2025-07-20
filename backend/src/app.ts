import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import setAuthRoutes from './routes/authRoutes';
import setVirtualDoctorRoutes from './routes/virtualDoctorRoutes';
import firebaseAuthRoutes from './routes/firebaseAuthRoutes';
import downloadRoutes from './routes/downloadRoutes';
import { SecurityMiddleware } from './middleware/securityMiddleware';
import { RateLimitService } from './middleware/rateLimitMiddleware';
import { SecureJwtService } from './utils/secureJwtService';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware - helmet for basic security headers
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

// Trust proxy for proper IP detection
app.set('trust proxy', 1);

// Global security middleware
app.use(SecurityMiddleware.validateRequest());

// Health check endpoint (no rate limiting needed)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '2.0.0-secure'
    });
});

// Rate limiting for other API routes
app.use('/api/auth', RateLimitService.createRateLimit('api'));

// Middleware
app.use(bodyParser.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        // Prevent JSON pollution attacks
        if (buf.length > 10 * 1024 * 1024) {
            throw new Error('Request entity too large');
        }
    }
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({ 
    secret: process.env.JWT_SECRET || 'your_secret_key', 
    resave: false, 
    saveUninitialized: false,
    name: 'sessionId', // Change default session name
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
    exposedHeaders: ['X-Request-ID']
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual_hospital')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Cleanup expired sessions periodically
setInterval(() => {
    const cleanedCount = SecureJwtService.cleanupExpiredSessions();
    if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
}, 60 * 60 * 1000); // Every hour

// Routes
setAuthRoutes(app);
setVirtualDoctorRoutes(app);
app.use('/api/auth', firebaseAuthRoutes);
app.use('/api/download', downloadRoutes);

// Health check endpoint (no rate limiting needed)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '2.0.0-secure'
    });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Secure Virtual Hospital Server running on http://localhost:${PORT}`);
    console.log(`🔒 Security features enabled: Rate limiting, JWT per-user secrets, Session management`);
    console.log(`📊 Health check available at: http://localhost:${PORT}/api/health`);
});