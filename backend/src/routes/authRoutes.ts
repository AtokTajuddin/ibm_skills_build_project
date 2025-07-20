import { Router, Application } from 'express';
import AuthController from '../controllers/authController';
import { RateLimitService } from '../middleware/rateLimitMiddleware';
import { SecurityMiddleware } from '../middleware/securityMiddleware';
import { CSRFProtection } from '../middleware/csrfProtection';
import { InputValidation } from '../middleware/inputValidation';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = Router();

// Apply security middleware to all routes
router.use(SecurityMiddleware.validateRequest());
router.use(SecurityMiddleware.sanitizeInput());
router.use(SecurityMiddleware.detectSuspiciousActivity());

// CSRF token endpoint
router.get('/csrf-token', CSRFProtection.getToken());

// Authentication routes with seamless CSRF protection
router.post('/register', 
    RateLimitService.createRateLimit('register'),
    InputValidation.validate(InputValidation.rules.register),
    CSRFProtection.protect(),
    AuthController.registerUser
);

router.post('/login', 
    RateLimitService.createRateLimit('login'),
    InputValidation.validate(InputValidation.rules.login),
    CSRFProtection.protect(),
    AuthController.loginUser
);

router.post('/refresh', 
    RateLimitService.createRateLimit('refresh'),
    AuthController.refreshToken
);

// Protected routes - REQUIRE AUTHENTICATION ONLY
router.post('/logout', 
    isAuthenticated,
    AuthController.logout
);

router.post('/logout-all', 
    isAuthenticated,
    AuthController.logoutAll
);

router.get('/sessions', 
    isAuthenticated,
    RateLimitService.createRateLimit('api'),
    AuthController.getSessions
);

export default function setAuthRoutes(app: Application) {
    app.use('/api/auth', router);
}