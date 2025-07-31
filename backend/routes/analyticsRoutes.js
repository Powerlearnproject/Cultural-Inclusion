import express from 'express';
import { 
  generateAnalytics, 
  getAnalytics, 
  getRealTimeMetrics, 
  getVulnerabilityInsights 
} from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes require admin access
router.use(auth);

// Analytics endpoints
router.post('/generate', generateAnalytics);
router.get('/data', getAnalytics);
router.get('/real-time', getRealTimeMetrics);
router.get('/vulnerability-insights', getVulnerabilityInsights);

export default router; 