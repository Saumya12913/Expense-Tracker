const jwt = require('jsonwebtoken');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const Storage = require('../models/storageAdapter');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authentication token provided',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'auspify_super_secret_jwt_key_2026_finflow_secure'
    );

    const { isMongoConnected } = getDBStatus();
    let user;

    if (isMongoConnected) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = await Storage.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session has expired or user no longer exists',
      });
    }

    // Attach user to request
    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      preferredCurrency: user.preferredCurrency || 'INR',
      monthlySavingsGoal: user.monthlySavingsGoal || 20000,
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid or expired token',
    });
  }
};

module.exports = { protect };
