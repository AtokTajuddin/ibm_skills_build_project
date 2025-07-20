import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleAuthController {
    async googleLogin(req: Request, res: Response) {
        const url = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        });
        res.redirect(url);
    }

    /**
     * Handle Google One Tap Sign-In
     */
    async googleOneTap(req: Request, res: Response) {
        try {
            const { credential } = req.body;
            
            if (!credential) {
                return res.status(400).json({ message: 'No credential provided' });
            }

            // Verify the Google One Tap credential (JWT)
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                return res.status(400).json({ message: 'Invalid credential from Google' });
            }

            let user = await User.findOne({ email: payload.email });
            let isNewUser = false;

            if (!user) {
                isNewUser = true;
                user = new User({
                    username: payload.name || payload.email.split('@')[0],
                    email: payload.email,
                    name: payload.name,
                    provider: 'google',
                    socialAuth: { googleId: payload.sub },
                    password: undefined,
                    profilePicture: payload.picture
                });
                await user.save();
                console.log('New Google user created:', payload.email);
            } else if (!user.socialAuth?.googleId) {
                // Link Google account to existing user
                user.socialAuth = user.socialAuth || {};
                user.socialAuth.googleId = payload.sub;
                user.provider = 'google';
                if (payload.picture && !user.profilePicture) {
                    user.profilePicture = payload.picture;
                }
                await user.save();
                console.log('Linked Google account to existing user:', payload.email);
            } else {
                console.log('Existing Google user logged in:', payload.email);
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET as string,
                { expiresIn: '24h' } // Longer expiration for better UX
            );

            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    profilePicture: user.profilePicture,
                    provider: user.provider
                },
                isNewUser
            });
        } catch (error) {
            console.error('Google One Tap authentication error:', error);
            res.status(500).json({ 
                message: 'Google authentication failed', 
                error: (error as Error).message 
            });
        }
    }    async googleCallback(req: Request, res: Response) {
        try {
            const { code } = req.query;
            const { tokens } = await client.getToken(code as string);
            client.setCredentials(tokens);

            if (!tokens.id_token) {
                return res.status(400).json({ message: 'No ID token found in Google response' });
            }

            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                return res.status(400).json({ message: 'Invalid user data from Google' });
            }

            let user = await User.findOne({ email: payload.email });
            let isNewUser = false;

            if (!user) {
                isNewUser = true;
                user = new User({
                    username: payload.name || payload.email.split('@')[0],
                    email: payload.email,
                    name: payload.name,
                    provider: 'google',
                    socialAuth: { googleId: payload.sub },
                    password: undefined,
                    profilePicture: payload.picture
                });
                await user.save();
                console.log('New Google user created via callback:', payload.email);
            } else if (!user.socialAuth?.googleId) {
                // Link Google account to existing user
                user.socialAuth = user.socialAuth || {};
                user.socialAuth.googleId = payload.sub;
                user.provider = 'google';
                if (payload.picture && !user.profilePicture) {
                    user.profilePicture = payload.picture;
                }
                await user.save();
                console.log('Linked Google account to existing user via callback:', payload.email);
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET as string,
                { expiresIn: '24h' }
            );

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&isNewUser=${isNewUser}`);
        } catch (error) {
            console.error('Google authentication error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
        }
    }
}