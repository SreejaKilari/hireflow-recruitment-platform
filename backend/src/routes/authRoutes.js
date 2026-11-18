const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  uploadUserResume,
  uploadUserAvatar,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');
const { uploadResume, uploadImage } = require('../middlewares/uploadMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/upload-resume', protect, uploadResume.single('resume'), uploadUserResume);
router.post('/upload-avatar', protect, uploadImage.single('avatar'), uploadUserAvatar);

module.exports = router;
