const express = require('express');
const router = express.Router();

const {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  getAllJobsAdmin,
  toggleJobApproval,
} = require('../controllers/adminController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// All admin routes require authentication and role === 'admin'
router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/jobs', getAllJobsAdmin);
router.patch('/jobs/:id/approve', toggleJobApproval);

module.exports = router;
