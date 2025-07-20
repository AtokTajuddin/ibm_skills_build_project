import { Request, Response, NextFunction } from 'express';
import { SecureJwtService } from '../utils/secureJwtService';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
  deviceFingerprint?: string;
}

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = SecureJwtService.extractTokenFromHeader(authHeader);

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Access token is required' 
        });
    }

    try {
        const decoded = SecureJwtService.verifySecureToken(token);
        
        User.findById(decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ 
                        success: false,
                        message: 'User not found' 
                    });
                }
                
                // Add session info to user object
                (req as any).user = {
                    ...user.toObject(),
                    sessionId: decoded.sessionId,
                    tokenVersion: decoded.tokenVersion
                };
                
                next();
            })
            .catch(err => {
                console.error('Error finding user:', err);
                res.status(500).json({ 
                    success: false,
                    message: 'Server error' 
                });
            });
    } catch (err) {
        console.error('Token verification error:', err);
        
        let message = 'Invalid or expired token';
        if (err instanceof Error) {
            if (err.message.includes('Session not found')) {
                message = 'Session expired. Please login again.';
            } else if (err.message.includes('Device fingerprint mismatch')) {
                message = 'Security violation detected. Please login again.';
            }
        }
        
        res.status(401).json({ 
            success: false,
            message 
        });
    }
};