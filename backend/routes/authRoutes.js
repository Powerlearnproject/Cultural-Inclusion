import express from 'express';
import { registerUser, loginUser, getUserProfile, verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', verifyToken, getUserProfile);

export default router;
