import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { SecureJwtService } from '../utils/secureJwtService';
import { RateLimitService } from '../middleware/rateLimitMiddleware';
import { SecurityRequest } from '../middleware/securityMiddleware';

class AuthController {
    async registerUser(req: SecurityRequest, res: Response) {
        const { username, email, password } = req.body;
        const ip = req.securityContext?.ip || 'unknown';

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false,
                    message: 'User with this email already exists' 
                });
            }

            // Hash password with higher salt rounds for security
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({ 
                username, 
                email, 
                password: hashedPassword,
                provider: 'local'
            });
            await newUser.save();
            
            // Generate secure JWT tokens
            const tokenData = SecureJwtService.generateSecureToken({
                id: (newUser._id as any).toString(),
                email: newUser.email,
                username: newUser.username || newUser.name || '',
                provider: 'local'
            }, {
                deviceFingerprint: req.deviceFingerprint
            });
            
            // Reset rate limit for successful registration
            RateLimitService.resetLimit(ip, email, 'register');
            
            res.status(201).json({ 
                success: true,
                message: 'User registered successfully',
                token: tokenData.token,
                refreshToken: tokenData.refreshToken,
                user: {
                    id: newUser._id,
                    username: newUser.username || newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error registering user' 
            });
        }
    }

    async loginUser(req: SecurityRequest, res: Response) {
        const { email, password } = req.body;
        const ip = req.securityContext?.ip || 'unknown';

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Invalid credentials' // Don't reveal if user exists
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid credentials' 
                });
            }

            // Generate secure JWT tokens
            const tokenData = SecureJwtService.generateSecureToken({
                id: (user._id as any).toString(),
                email: user.email,
                username: user.username || user.name || '',
                provider: user.provider || 'local'
            }, {
                deviceFingerprint: req.deviceFingerprint
            });

            // Reset rate limit for successful login
            RateLimitService.resetLimit(ip, email, 'login');

            res.status(200).json({ 
                success: true,
                message: 'Login successful', 
                token: tokenData.token,
                refreshToken: tokenData.refreshToken,
                user: {
                    id: user._id,
                    username: user.username || user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error logging in' 
            });
        }
    }

    async refreshToken(req: SecurityRequest, res: Response) {
        const { refreshToken } = req.body;

        try {
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            const tokenData = SecureJwtService.refreshToken(
                refreshToken, 
                req.deviceFingerprint
            );

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                token: tokenData.token,
                refreshToken: tokenData.refreshToken
            });
        } catch (error) {
            console.error('Token refresh error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
    }

    async logout(req: any, res: Response) {
        try {
            const sessionId = req.user?.sessionId;
            
            if (sessionId) {
                SecureJwtService.invalidateSession(sessionId);
            }

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging out'
            });
        }
    }

    async logoutAll(req: any, res: Response) {
        try {
            const userId = req.user?.id;
            
            if (userId) {
                const sessionsRemoved = SecureJwtService.invalidateAllUserSessions(userId);
                res.status(200).json({
                    success: true,
                    message: `Logged out from ${sessionsRemoved} sessions`
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error('Logout all error:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging out from all sessions'
            });
        }
    }

    async getSessions(req: any, res: Response) {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const sessions = SecureJwtService.getUserSessions(userId);
            
            res.status(200).json({
                success: true,
                sessions: sessions.map(session => ({
                    sessionId: session.sessionId,
                    lastActivity: session.lastActivity,
                    deviceFingerprint: session.deviceFingerprint
                }))
            });
        } catch (error) {
            console.error('Get sessions error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching sessions'
            });
        }
    }
}

export default new AuthController();