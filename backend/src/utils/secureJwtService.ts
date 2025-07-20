import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

type StringValue = string;

export interface JwtPayload {
  id: string;
  email: string;
  username?: string;
  provider?: string;
  sessionId: string;
  tokenVersion: number;
}

export interface SecureJwtOptions {
  expiresIn?: string | number;
  rotateToken?: boolean;
  deviceFingerprint?: string;
}

export class SecureJwtService {
  private static readonly BASE_SECRET = process.env.JWT_SECRET as string;
  private static readonly DEFAULT_EXPIRY = '15m'; // Short-lived tokens for security
  private static readonly REFRESH_EXPIRY = '7d';
  
  // Store active sessions in memory (in production, use Redis)
  private static activeSessions = new Map<string, {
    userId: string;
    sessionId: string;
    tokenVersion: number;
    lastActivity: Date;
    deviceFingerprint?: string;
  }>();

  /**
   * Generate a unique secret for each user + session
   */
  private static generateUserSecret(userId: string, sessionId: string): string {
    if (!this.BASE_SECRET) {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }
    
    // Combine base secret with user ID and session ID for unique secret per session
    return crypto
      .createHash('sha256')
      .update(`${this.BASE_SECRET}:${userId}:${sessionId}`)
      .digest('hex');
  }

  /**
   * Generate a secure session ID
   */
  private static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate device fingerprint from request headers
   */
  static generateDeviceFingerprint(userAgent?: string, ip?: string): string {
    const fingerprint = `${userAgent || 'unknown'}:${ip || 'unknown'}`;
    return crypto.createHash('sha256').update(fingerprint).digest('hex');
  }

  /**
   * Generate secure JWT token with unique secret per user
   */
  static generateSecureToken(
    payload: Omit<JwtPayload, 'sessionId' | 'tokenVersion'>,
    options: SecureJwtOptions = {}
  ): { token: string; refreshToken: string; sessionId: string } {
    const sessionId = this.generateSessionId();
    const tokenVersion = Math.floor(Date.now() / 1000); // Unix timestamp as version
    
    const fullPayload: JwtPayload = {
      ...payload,
      sessionId,
      tokenVersion
    };

    // Store session info
    this.activeSessions.set(sessionId, {
      userId: payload.id,
      sessionId,
      tokenVersion,
      lastActivity: new Date(),
      deviceFingerprint: options.deviceFingerprint
    });

    const userSecret = this.generateUserSecret(payload.id, sessionId);
    
    // Generate access token (short-lived)
    const signOptions: any = { 
      expiresIn: options.expiresIn || this.DEFAULT_EXPIRY,
      issuer: 'virtual-hospital',
      audience: payload.id,
      algorithm: 'HS256'
    };
    
    const token = jwt.sign(fullPayload, userSecret, signOptions);
    
    // Generate refresh token (longer-lived)
    const refreshPayload = {
      id: payload.id,
      sessionId,
      type: 'refresh'
    };
    
    const refreshToken = jwt.sign(
      refreshPayload, 
      userSecret, 
      { expiresIn: this.REFRESH_EXPIRY, algorithm: 'HS256' }
    );

    return { token, refreshToken, sessionId };
  }

  /**
   * Verify JWT token with user-specific secret
   */
  static verifySecureToken(token: string): JwtPayload {
    if (!this.BASE_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      // First decode without verification to get sessionId
      const decoded = jwt.decode(token) as JwtPayload;
      
      if (!decoded || !decoded.sessionId || !decoded.id) {
        throw new Error('Invalid token structure');
      }

      // Check if session exists and is valid
      const session = this.activeSessions.get(decoded.sessionId);
      if (!session || session.userId !== decoded.id) {
        throw new Error('Session not found or invalid');
      }

      // Generate user secret and verify token
      const userSecret = this.generateUserSecret(decoded.id, decoded.sessionId);
      const verified = jwt.verify(token, userSecret, {
        issuer: 'virtual-hospital',
        audience: decoded.id,
        algorithms: ['HS256']
      }) as JwtPayload;

      // Update last activity
      session.lastActivity = new Date();
      this.activeSessions.set(decoded.sessionId, session);

      return verified;
    } catch (error) {
      throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh token
   */
  static refreshToken(refreshToken: string, deviceFingerprint?: string): { token: string; refreshToken: string } {
    try {
      // Decode refresh token to get session info
      const decoded = jwt.decode(refreshToken) as any;
      
      if (!decoded || decoded.type !== 'refresh' || !decoded.sessionId) {
        throw new Error('Invalid refresh token');
      }

      const session = this.activeSessions.get(decoded.sessionId);
      if (!session) {
        throw new Error('Session expired');
      }

      // Verify device fingerprint if provided
      if (deviceFingerprint && session.deviceFingerprint && session.deviceFingerprint !== deviceFingerprint) {
        throw new Error('Device fingerprint mismatch');
      }

      // Verify refresh token
      const userSecret = this.generateUserSecret(decoded.id, decoded.sessionId);
      jwt.verify(refreshToken, userSecret, { algorithms: ['HS256'] });

      // Generate new tokens
      const newTokenVersion = Math.floor(Date.now() / 1000);
      session.tokenVersion = newTokenVersion;
      session.lastActivity = new Date();

      const newPayload: JwtPayload = {
        id: decoded.id,
        email: session.userId, // You might want to store email in session
        sessionId: decoded.sessionId,
        tokenVersion: newTokenVersion
      };

      const newToken = jwt.sign(newPayload, userSecret, {
        expiresIn: this.DEFAULT_EXPIRY,
        issuer: 'virtual-hospital',
        audience: decoded.id,
        algorithm: 'HS256'
      });

      const newRefreshToken = jwt.sign(
        { id: decoded.id, sessionId: decoded.sessionId, type: 'refresh' },
        userSecret,
        { expiresIn: this.REFRESH_EXPIRY, algorithm: 'HS256' }
      );

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Invalidate session (logout)
   */
  static invalidateSession(sessionId: string): boolean {
    return this.activeSessions.delete(sessionId);
  }

  /**
   * Invalidate all user sessions
   */
  static invalidateAllUserSessions(userId: string): number {
    let count = 0;
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.userId === userId) {
        this.activeSessions.delete(sessionId);
        count++;
      }
    }
    return count;
  }

  /**
   * Clean up expired sessions
   */
  static cleanupExpiredSessions(): number {
    const now = new Date();
    const expiredThreshold = 24 * 60 * 60 * 1000; // 24 hours
    let count = 0;

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > expiredThreshold) {
        this.activeSessions.delete(sessionId);
        count++;
      }
    }

    return count;
  }

  /**
   * Get active sessions for user
   */
  static getUserSessions(userId: string): Array<{
    sessionId: string;
    lastActivity: Date;
    deviceFingerprint?: string;
  }> {
    const sessions = [];
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.userId === userId) {
        sessions.push({
          sessionId,
          lastActivity: session.lastActivity,
          deviceFingerprint: session.deviceFingerprint
        });
      }
    }
    return sessions;
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return authHeader;
  }
}

export default SecureJwtService;
