import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export class SocialAuthController {
  async verifyGoogleToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
      
      // Verify the token with Google
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
      );
      
      const { sub, email, name, picture } = googleResponse.data;
      
      if (!email) {
        return res.status(400).json({ message: 'Email not available from Google' });
      }
      
      // Check if user exists
      let user = await User.findOne({ email });
      let isNewUser = false;
      
      if (!user) {
        isNewUser = true;
        // Create new user
        user = new User({
          username: name || email.split('@')[0],
          email,
          provider: 'google',
          socialAuth: { googleId: sub },
          password: undefined // No password for social login
        });
        await user.save();
      } else if (!user.socialAuth?.googleId) {
        // Update existing user with Google ID
        user.socialAuth = user.socialAuth || {};
        user.socialAuth.googleId = sub;
        await user.save();
      }
      
      // Generate JWT token
      const authToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );
      
      res.status(200).json({
        message: isNewUser ? 'User created successfully' : 'Login successful',
        token: authToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          provider: user.provider
        }
      });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ message: 'Google authentication failed', error });
    }
  }
}
