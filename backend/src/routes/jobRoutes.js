const express = require('express');
const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  toggleJobStatus,
} = require('../controllers/jobController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Public endpoints
router.get('/', getJobs);

// Recruiter specific endpoints (Must be before /:id)
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);

// Single Job
router.get('/:id', getJobById);

// Job Mutators
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), toggleJobStatus);

module.exports = router;
