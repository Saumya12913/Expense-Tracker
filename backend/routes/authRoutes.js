const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  demoLogin,
  getMe,
  updateProfile,
  seedData,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo', demoLogin);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/seed', protect, seedData);

module.exports = router;
