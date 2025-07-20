import { Request, Response } from 'express';
import User from '../models/User';
import { SecureJwtService } from '../utils/secureJwtService';
import { SecurityRequest } from '../middleware/securityMiddleware';

export class FirebaseAuthController {
    
    public async firebaseLogin(req: SecurityRequest, res: Response) {
        try {
            const { displayName, email, photoURL, uid } = req.body;

            console.log('Firebase login attempt:', { email, displayName, uid });

            if (!email || !uid) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Email and UID are required' 
                });
            }

            // Find or create user in our database
            let user = await User.findOne({ email });
            let isNewUser = false;

            if (!user) {
                isNewUser = true;
                user = new User({
                    username: displayName || email.split('@')[0],
                    email,
                    provider: 'firebase',
                    socialAuth: { 
                        firebaseUid: uid
                    },
                    profilePicture: photoURL,
                    password: undefined
                });
                await user.save();
                console.log('Created new Firebase user:', email);
            } else {
                // Update existing user with Firebase info
                if (!user.socialAuth?.firebaseUid) {
                    user.socialAuth = user.socialAuth || {};
                    user.socialAuth.firebaseUid = uid;
                }
                
                // Update profile picture if provided
                if (photoURL && (!user.profilePicture || user.profilePicture !== photoURL)) {
                    user.profilePicture = photoURL;
                }
                
                user.provider = 'firebase';
                await user.save();
                console.log('Updated existing Firebase user:', email);
            }

            // Generate secure JWT tokens
            const tokenData = SecureJwtService.generateSecureToken({
                id: (user._id as any).toString(),
                email: user.email,
                username: user.username || displayName || '',
                provider: 'firebase'
            }, {
                deviceFingerprint: req.deviceFingerprint
            });

            res.json({
                success: true,
                token: tokenData.token,
                refreshToken: tokenData.refreshToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    provider: user.provider
                },
                isNewUser
            });

        } catch (error: any) {
            console.error('Firebase authentication error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Firebase authentication failed'
            });
        }
    }

    // Health check endpoint
    public async firebaseStatus(req: Request, res: Response) {
        try {
            res.json({
                status: 'Ready - Secure Firebase auth',
                projectId: process.env.FIREBASE_PROJECT_ID || 'virtual-hospital-project',
                message: 'Using frontend Firebase authentication with secure JWT'
            });
        } catch (error: any) {
            res.status(500).json({ 
                success: false,
                message: 'Firebase status check failed'
            });
        }
    }
}
