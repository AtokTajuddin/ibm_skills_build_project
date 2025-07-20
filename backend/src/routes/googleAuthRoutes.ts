import { Router, Application } from 'express';
import { GoogleAuthController } from '../controllers/googleAuthController';

const router = Router();
const googleAuthController = new GoogleAuthController();

export function setGoogleAuthRoutes(app: Application) {
    app.use('/auth/google', router);
    
    router.get('/', googleAuthController.googleLogin.bind(googleAuthController));
    router.get('/callback', googleAuthController.googleCallback.bind(googleAuthController));
    
    // Add the Google One Tap route
    app.post('/auth/google-onetap', googleAuthController.googleOneTap.bind(googleAuthController));
}