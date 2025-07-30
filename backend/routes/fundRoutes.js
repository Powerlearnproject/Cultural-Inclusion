import express from 'express';
import {
  getFunds,
  createFund,
  getFundById,
  updateFund,
  deleteFund,
  getFundAnalytics
} from '../controllers/fundController.js';

const router = express.Router();

// GET /api/funds - Get all funds with filtering
router.get('/', getFunds);

// POST /api/funds - Create new fund allocation
router.post('/', createFund);

// GET /api/funds/analytics - Get fund analytics
router.get('/analytics', getFundAnalytics);

// GET /api/funds/:id - Get fund by ID
router.get('/:id', getFundById);

// PUT /api/funds/:id - Update fund
router.put('/:id', updateFund);

// DELETE /api/funds/:id - Delete fund
router.delete('/:id', deleteFund);

export default router; 