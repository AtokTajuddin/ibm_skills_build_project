import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
  username?: string;
  provider?: string;
}

export class JwtService {
  private static readonly SECRET = process.env.JWT_SECRET as string;
  private static readonly DEFAULT_EXPIRY = '7d'; // 7 days for better user experience

  /**
   * Generate a JWT token for user authentication
   */
  static generateToken(payload: JwtPayload, expiresIn: string = this.DEFAULT_EXPIRY): string {
    if (!this.SECRET) {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }

    return jwt.sign(payload, this.SECRET, { expiresIn } as SignOptions);
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): JwtPayload {
    if (!this.SECRET) {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }

    try {
      return jwt.verify(token, this.SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate a refresh token (longer expiry)
   */
  static generateRefreshToken(payload: JwtPayload): string {
    return this.generateToken(payload, '30d'); // 30 days for refresh token
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    // Handle "Bearer <token>" format
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    // Handle direct token
    return authHeader;
  }
}

export default JwtService;
