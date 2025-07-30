import express from 'express';
const router = express.Router();

// TODO: Add controller imports

router.get('/', (req, res) => {
  res.send('Get all surveys');
});

router.post('/', (req, res) => {
  res.send('Create survey');
});

// Add more routes as needed

export default router;
