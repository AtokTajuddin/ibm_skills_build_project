import { Router, Application } from 'express';
import { VirtualDoctorController } from '../controllers/virtualDoctorController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = Router();
const virtualDoctorController = new VirtualDoctorController();

// Protected routes - require authentication
router.post('/message', isAuthenticated, virtualDoctorController.sendMessage.bind(virtualDoctorController));
router.get('/conversations', isAuthenticated, virtualDoctorController.getConversations.bind(virtualDoctorController));
router.get('/conversations/:id', isAuthenticated, virtualDoctorController.getConversation.bind(virtualDoctorController));

export default function setVirtualDoctorRoutes(app: Application) {
  app.use('/api/virtual-doctor', router);
}
