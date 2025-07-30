import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const registerUser = (req, res) => {
  // Registration logic
  res.send('Register user');
};

export const loginUser = (req, res) => {
  // Login logic
  res.send('Login user');
};
