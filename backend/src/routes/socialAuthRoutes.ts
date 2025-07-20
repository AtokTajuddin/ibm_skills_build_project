import { Router, Application } from 'express';
import { SocialAuthController } from '../controllers/socialAuthController';

const router = Router();
const socialAuthController = new SocialAuthController();

router.post('/google', socialAuthController.verifyGoogleToken.bind(socialAuthController));

export default function setSocialAuthRoutes(app: Application) {
  app.use('/api/auth/social', router);
}
