import express from 'express';
const router = express.Router();

// TODO: Add controller imports

router.get('/', (req, res) => {
  res.send('Get all beneficiaries');
});

router.post('/', (req, res) => {
  res.send('Create beneficiary');
});

// Add more routes as needed

export default router;
