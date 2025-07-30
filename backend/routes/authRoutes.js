import express from 'express';
const router = express.Router();

// TODO: Add controller imports

router.post('/register', (req, res) => {
  // Registration logic
  res.send('Register endpoint');
});

router.post('/login', (req, res) => {
  // Login logic
  res.send('Login endpoint');
});

export default router;
