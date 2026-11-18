const express = require('express');
const router = express.Router();

const {
  getCompanies,
  getCompanyById,
  updateCompanyProfile,
  uploadCompanyLogo,
} = require('../controllers/companyController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadImage } = require('../middlewares/uploadMiddleware');

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

// Recruiter actions
router.put('/profile', protect, authorize('recruiter', 'admin'), updateCompanyProfile);
router.post(
  '/logo',
  protect,
  authorize('recruiter', 'admin'),
  uploadImage.single('logo'),
  uploadCompanyLogo
);

module.exports = router;
