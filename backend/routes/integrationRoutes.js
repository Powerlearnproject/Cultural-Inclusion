import express from 'express';
import { 
  exportData, 
  generateReport, 
  externalAPI, 
  mobileSync, 
  validateData 
} from '../controllers/integrationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All integration routes require authentication
router.use(auth);

// Data export and reporting
router.post('/export', exportData);
router.post('/reports', generateReport);
router.post('/validate', validateData);

// External API integrations
router.post('/external-api', externalAPI);

// Mobile app sync
router.post('/mobile-sync', mobileSync);

export default router; 