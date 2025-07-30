import express from 'express';
import {
  getBeneficiaries,
  createBeneficiary,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
  getBeneficiaryAnalytics
} from '../controllers/beneficiaryController.js';

const router = express.Router();

// GET /api/beneficiaries - Get all beneficiaries with filtering
router.get('/', getBeneficiaries);

// POST /api/beneficiaries - Create new beneficiary
router.post('/', createBeneficiary);

// GET /api/beneficiaries/analytics - Get analytics data
router.get('/analytics', getBeneficiaryAnalytics);

// GET /api/beneficiaries/:id - Get beneficiary by ID
router.get('/:id', getBeneficiaryById);

// PUT /api/beneficiaries/:id - Update beneficiary
router.put('/:id', updateBeneficiary);

// DELETE /api/beneficiaries/:id - Delete beneficiary
router.delete('/:id', deleteBeneficiary);

export default router;
