const express = require('express');
const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus,
  getRecruiterStats,
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadResume } = require('../middlewares/uploadMiddleware');

// Seeker routes
router.post(
  '/:jobId/apply',
  protect,
  authorize('job_seeker'),
  uploadResume.single('resume'),
  applyForJob
);
router.get('/my-applications', protect, authorize('job_seeker'), getMyApplications);
router.delete('/:id/withdraw', protect, authorize('job_seeker'), withdrawApplication);

// Recruiter routes
router.get('/stats/recruiter', protect, authorize('recruiter', 'admin'), getRecruiterStats);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
