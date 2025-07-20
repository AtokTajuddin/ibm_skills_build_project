import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export interface ValidationRules {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'email' | 'password' | 'username' | 'url' | 'uuid';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    sanitize?: boolean;
  };
}

export class InputValidation {
  /**
   * Strong password validation
   */
  private static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Username validation (alphanumeric + underscore, 3-20 chars)
   */
  private static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * Sanitize string to prevent injections
   */
  private static sanitizeString(str: string): string {
    return validator.escape(str)
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/vbscript:/gi, '') // Remove vbscript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/data:(?!image\/)/gi, '') // Only allow data: for images
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/--.*$/gm, '') // Remove -- comments
      .replace(/;\s*(drop|delete|insert|update|create|alter|truncate)/gi, '') // Remove dangerous SQL
      .trim();
  }

  /**
   * Validate field based on rules
   */
  private static validateField(value: any, rules: ValidationRules[string], fieldName: string): { valid: boolean; error?: string; sanitized?: any } {
    // Check if required
    if (rules.required && (value === undefined || value === null || value === '')) {
      return { valid: false, error: `${fieldName} is required` };
    }

    // Skip validation if not required and empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return { valid: true, sanitized: value };
    }

    // Convert to string for validation
    const strValue = String(value);

    // Length validation
    if (rules.minLength && strValue.length < rules.minLength) {
      return { valid: false, error: `${fieldName} must be at least ${rules.minLength} characters` };
    }

    if (rules.maxLength && strValue.length > rules.maxLength) {
      return { valid: false, error: `${fieldName} must not exceed ${rules.maxLength} characters` };
    }

    // Type-specific validation
    switch (rules.type) {
      case 'email':
        if (!validator.isEmail(strValue)) {
          return { valid: false, error: `${fieldName} must be a valid email address` };
        }
        break;

      case 'password':
        if (!this.isStrongPassword(strValue)) {
          return { 
            valid: false, 
            error: `${fieldName} must be at least 8 characters with uppercase, lowercase, number, and special character` 
          };
        }
        break;

      case 'username':
        if (!this.isValidUsername(strValue)) {
          return { 
            valid: false, 
            error: `${fieldName} must be 3-20 characters, alphanumeric and underscore only` 
          };
        }
        break;

      case 'url':
        if (!validator.isURL(strValue)) {
          return { valid: false, error: `${fieldName} must be a valid URL` };
        }
        break;

      case 'uuid':
        if (!validator.isUUID(strValue)) {
          return { valid: false, error: `${fieldName} must be a valid UUID` };
        }
        break;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(strValue)) {
      return { valid: false, error: `${fieldName} format is invalid` };
    }

    // Sanitization
    let sanitized = value;
    if (rules.sanitize && typeof value === 'string') {
      sanitized = this.sanitizeString(strValue);
    }

    return { valid: true, sanitized };
  }

  /**
   * Create validation middleware
   */
  static validate(rules: ValidationRules) {
    return (req: Request, res: Response, next: NextFunction) => {
      const errors: string[] = [];
      const sanitizedData: any = {};

      // Validate each field
      for (const [fieldName, fieldRules] of Object.entries(rules)) {
        const value = req.body[fieldName];
        const result = this.validateField(value, fieldRules, fieldName);

        if (!result.valid) {
          errors.push(result.error!);
        } else {
          sanitizedData[fieldName] = result.sanitized;
        }
      }

      // Return errors if any
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      // Update request body with sanitized data
      req.body = { ...req.body, ...sanitizedData };
      next();
    };
  }

  /**
   * Common validation rules
   */
  static rules = {
    register: {
      username: { required: true, type: 'username' as const, sanitize: true },
      email: { required: true, type: 'email' as const, sanitize: true },
      password: { required: true, type: 'password' as const }
    },
    login: {
      email: { required: true, type: 'email' as const, sanitize: true },
      password: { required: true, type: 'string' as const, minLength: 1 }
    },
    firebaseLogin: {
      email: { required: true, type: 'email' as const, sanitize: true },
      uid: { required: true, type: 'string' as const, minLength: 1, sanitize: true },
      displayName: { required: false, type: 'string' as const, maxLength: 100, sanitize: true }
    }
  };
}

export default InputValidation;
