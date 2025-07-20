import { Router } from 'express';
import downloadController from '../controllers/downloadController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = Router();

// Download consultation as HTML file
router.get('/consultation/:id/download', isAuthenticated, (req, res) => {
  downloadController.downloadConsultationHTML(req, res);
});

// Get consultation data for frontend display
router.get('/consultation/:id/data', isAuthenticated, (req, res) => {
  downloadController.getConsultationData(req, res);
});

export default router;
