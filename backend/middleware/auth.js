import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Check if user is approved (except for admins)
    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(403).json({ 
        message: 'Account pending approval. Please contact an administrator.',
        approvalStatus: user.approvalStatus
      });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      isApproved: user.isApproved,
      approvalStatus: user.approvalStatus
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Admin only middleware
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// Officer or Admin middleware
export const requireOfficer = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'officer') {
    return res.status(403).json({ 
      message: 'Access denied. Officer privileges required.' 
    });
  }
  next();
};

// Beneficiary middleware
export const requireBeneficiary = (req, res, next) => {
  if (req.user.role !== 'beneficiary') {
    return res.status(403).json({ 
      message: 'Access denied. Beneficiary privileges required.' 
    });
  }
  next();
};
