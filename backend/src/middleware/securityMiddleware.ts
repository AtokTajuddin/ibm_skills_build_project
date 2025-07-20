import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface SecurityRequest extends Request {
  deviceFingerprint?: string;
  securityContext?: {
    ip: string;
    userAgent: string;
    timestamp: number;
    requestId: string;
  };
}

export class SecurityMiddleware {
  /**
   * Generate request ID for tracking
   */
  private static generateRequestId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Validate request origin and headers
   */
  static validateRequest() {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Generate request ID
      const requestId = this.generateRequestId();
      res.setHeader('X-Request-ID', requestId);

      // Extract client info
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      // Create security context
      req.securityContext = {
        ip,
        userAgent,
        timestamp: Date.now(),
        requestId
      };

      // Generate device fingerprint
      req.deviceFingerprint = crypto
        .createHash('sha256')
        .update(`${userAgent}:${ip}`)
        .digest('hex');

      next();
    };
  }

  /**
   * Validate CSRF token for state-changing operations
   */
  static validateCSRF() {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      // Skip CSRF for GET requests
      if (req.method === 'GET') {
        return next();
      }

      const csrfToken = req.get('X-CSRF-Token') || req.body.csrfToken;
      const sessionToken = req.get('Authorization');

      if (!csrfToken) {
        return res.status(403).json({
          success: false,
          message: 'CSRF token required'
        });
      }

      // Validate CSRF token format and origin
      if (!this.isValidCSRFToken(csrfToken, sessionToken)) {
        return res.status(403).json({
          success: false,
          message: 'Invalid CSRF token'
        });
      }

      next();
    };
  }

  /**
   * Validate CSRF token
   */
  private static isValidCSRFToken(csrfToken: string, sessionToken?: string): boolean {
    try {
      // Basic validation - in production, you might want more sophisticated validation
      const decoded = Buffer.from(csrfToken, 'base64').toString('utf-8');
      const parts = decoded.split(':');
      
      if (parts.length !== 3) return false;
      
      const [timestamp, nonce, signature] = parts;
      const tokenAge = Date.now() - parseInt(timestamp);
      
      // Token should not be older than 1 hour
      if (tokenAge > 60 * 60 * 1000) return false;
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const signature = crypto
      .createHash('sha256')
      .update(`${timestamp}:${nonce}`)
      .digest('hex');
    
    const token = `${timestamp}:${nonce}:${signature}`;
    return Buffer.from(token).toString('base64');
  }

  /**
   * Input sanitization middleware
   */
  static sanitizeInput() {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      // Sanitize common attack patterns
      const sanitize = (obj: any): any => {
        if (typeof obj === 'string') {
          // Remove potential XSS patterns
          let sanitized = obj
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/<iframe[^>]*>/gi, '')
            .replace(/<object[^>]*>/gi, '')
            .replace(/<embed[^>]*>/gi, '')
            .replace(/eval\s*\(/gi, '')
            .replace(/function\s*\(/gi, '')
            .replace(/setTimeout\s*\(/gi, '')
            .replace(/setInterval\s*\(/gi, '')
            
            // Remove SQL injection patterns
            .replace(/union\s+select/gi, '')
            .replace(/drop\s+table/gi, '')
            .replace(/delete\s+from/gi, '')
            .replace(/insert\s+into/gi, '')
            .replace(/update\s+set/gi, '')
            .replace(/'\s*or\s*'1'\s*=\s*'1/gi, '')
            .replace(/'\s*or\s*1\s*=\s*1/gi, '')
            .replace(/--\s*$/gi, '')
            .replace(/\/\*.*\*\//gi, '')
            .replace(/;\s*drop/gi, '')
            .replace(/;\s*delete/gi, '')
            .replace(/;\s*insert/gi, '')
            .replace(/;\s*update/gi, '')
            
            // Remove command injection patterns
            .replace(/;\s*cat\s+/gi, '')
            .replace(/;\s*ls\s+/gi, '')
            .replace(/;\s*pwd/gi, '')
            .replace(/;\s*whoami/gi, '')
            .replace(/\|\s*nc\s+/gi, '')
            .replace(/&&\s*cat\s+/gi, '')
            .replace(/`[^`]*`/g, '')
            .replace(/\$\([^)]*\)/g, '')
            .trim();
            
          return sanitized;
        }
        
        if (Array.isArray(obj)) {
          return obj.map(sanitize);
        }
        
        if (obj && typeof obj === 'object') {
          const sanitized: any = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              sanitized[key] = sanitize(obj[key]);
            }
          }
          return sanitized;
        }
        
        return obj;
      };

      // Sanitize request body
      if (req.body) {
        req.body = sanitize(req.body);
      }

      // Sanitize query parameters
      if (req.query) {
        req.query = sanitize(req.query);
      }

      next();
    };
  }

  /**
   * Suspicious activity detection
   */
  static detectSuspiciousActivity() {
    const suspiciousPatterns = [
      // SQL Injection patterns
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,
      /update\s+set/i,
      /or\s+1\s*=\s*1/i,
      /'\s*or\s*'1'\s*=\s*'1/i,
      /'\s*or\s*1\s*=\s*1\s*--/i,
      /'\s*;\s*drop/i,
      /'\s*;\s*delete/i,
      /'\s*;\s*insert/i,
      /'\s*;\s*update/i,
      /\/\*.*\*\//i,
      /--\s*$/i,
      /'\s*\|\|\s*'/i,
      
      // XSS patterns
      /<script/i,
      /<\/script>/i,
      /javascript:/i,
      /eval\(/i,
      /function\(/i,
      /onclick\s*=/i,
      /onload\s*=/i,
      /onerror\s*=/i,
      /onmouseover\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /vbscript:/i,
      /data:text\/html/i,
      
      // Command injection
      /;\s*cat\s+/i,
      /;\s*ls\s+/i,
      /;\s*pwd/i,
      /;\s*whoami/i,
      /\|\s*nc\s+/i,
      /\|\s*netcat\s+/i,
      /&&\s*cat\s+/i,
      /`.*`/i,
      /\$\(.*\)/i
    ];

    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      const checkSuspicious = (value: string): boolean => {
        return suspiciousPatterns.some(pattern => pattern.test(value));
      };

      const checkObject = (obj: any): boolean => {
        if (typeof obj === 'string') {
          return checkSuspicious(obj);
        }
        
        if (Array.isArray(obj)) {
          return obj.some(checkObject);
        }
        
        if (obj && typeof obj === 'object') {
          return Object.values(obj).some(checkObject);
        }
        
        return false;
      };

      // Check for suspicious patterns in request
      let suspicious = false;
      
      if (req.body && checkObject(req.body)) suspicious = true;
      if (req.query && checkObject(req.query)) suspicious = true;
      if (req.url && checkSuspicious(req.url)) suspicious = true;

      if (suspicious) {
        console.warn(`🚨 SECURITY ALERT: Suspicious activity detected from ${req.securityContext?.ip}:`, {
          url: req.url,
          method: req.method,
          userAgent: req.securityContext?.userAgent,
          timestamp: new Date().toISOString(),
          requestId: req.securityContext?.requestId
        });

        // Log to security monitoring system (implement as needed)
        // SecurityLogger.logSuspiciousActivity(req.securityContext);

        return res.status(400).json({
          success: false,
          message: 'Invalid request detected',
          requestId: req.securityContext?.requestId
        });
      }

      next();
    };
  }
}

export default SecurityMiddleware;
