import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimitService {
  private static limits = new Map<string, RateLimitEntry>();
  
  // Rate limit configurations
  private static readonly CONFIGS = {
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
    register: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
    refresh: { maxAttempts: 10, windowMs: 60 * 60 * 1000 }, // 10 attempts per hour
    api: { maxAttempts: 100, windowMs: 60 * 60 * 1000 } // 100 requests per hour
  };

  /**
   * Generate rate limit key from IP and identifier
   */
  private static generateKey(ip: string, identifier: string, type: string): string {
    return `${type}:${ip}:${identifier}`;
  }

  /**
   * Check if rate limit is exceeded
   */
  private static isRateLimited(key: string, config: { maxAttempts: number; windowMs: number }): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry) {
      // First request
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        blocked: false
      });
      return false;
    }

    // Check if window has expired
    if (now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        blocked: false
      });
      return false;
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.maxAttempts) {
      entry.blocked = true;
      return true;
    }

    return false;
  }

  /**
   * Clean up expired entries
   */
  private static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Rate limit middleware factory
   */
  static createRateLimit(type: keyof typeof RateLimitService.CONFIGS) {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const identifier = (req.body && (req.body.email || req.body.username)) || req.query.email || 'anonymous';
      const key = this.generateKey(ip, identifier, type);
      const config = this.CONFIGS[type];

      // Clean up expired entries periodically
      if (Math.random() < 0.01) { // 1% chance
        this.cleanup();
      }

      if (this.isRateLimited(key, config)) {
        const entry = this.limits.get(key)!;
        const resetInSeconds = Math.ceil((entry.resetTime - Date.now()) / 1000);
        
        return res.status(429).json({
          success: false,
          message: 'Too many attempts. Please try again later.',
          retryAfter: resetInSeconds
        });
      }

      next();
    };
  }

  /**
   * Reset rate limit for a specific key (useful for successful operations)
   */
  static resetLimit(ip: string, identifier: string, type: string): void {
    const key = this.generateKey(ip, identifier, type);
    this.limits.delete(key);
  }

  /**
   * Get current rate limit status
   */
  static getStatus(ip: string, identifier: string, type: string): {
    attempts: number;
    maxAttempts: number;
    resetTime: number;
    blocked: boolean;
  } | null {
    const key = this.generateKey(ip, identifier, type);
    const entry = this.limits.get(key);
    const config = this.CONFIGS[type as keyof typeof this.CONFIGS];

    if (!entry) {
      return {
        attempts: 0,
        maxAttempts: config.maxAttempts,
        resetTime: Date.now() + config.windowMs,
        blocked: false
      };
    }

    return {
      attempts: entry.count,
      maxAttempts: config.maxAttempts,
      resetTime: entry.resetTime,
      blocked: entry.blocked
    };
  }
}

export default RateLimitService;
