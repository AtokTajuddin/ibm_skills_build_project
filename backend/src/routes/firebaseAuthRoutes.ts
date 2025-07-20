import express from 'express';
import { FirebaseAuthController } from '../controllers/firebaseAuthController';
import { RateLimitService } from '../middleware/rateLimitMiddleware';
import { SecurityMiddleware } from '../middleware/securityMiddleware';
import { CSRFProtection } from '../middleware/csrfProtection';
import { InputValidation } from '../middleware/inputValidation';

const router = express.Router();
const firebaseAuthController = new FirebaseAuthController();

// Apply security middleware
router.use(SecurityMiddleware.validateRequest());
router.use(SecurityMiddleware.sanitizeInput());
router.use(SecurityMiddleware.detectSuspiciousActivity());

// Firebase authentication routes (CSRF exempt - Firebase has own token validation)
router.post('/firebase-login', 
    RateLimitService.createRateLimit('login'),
    InputValidation.validate(InputValidation.rules.firebaseLogin),
    // No CSRF protection - Firebase tokens provide sufficient validation
    firebaseAuthController.firebaseLogin.bind(firebaseAuthController)
);

router.get('/firebase-status', 
    firebaseAuthController.firebaseStatus.bind(firebaseAuthController)
);

export default router;
