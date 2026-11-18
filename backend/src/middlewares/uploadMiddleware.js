const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/apiError');

// Ensure destination directories exist
const resumeDir = path.join(__dirname, '../../uploads/resumes');
const logoDir = path.join(__dirname, '../../uploads/logos');

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

// Local Disk Storage Engine
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `logo-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter for Resumes: PDF only
const resumeFilter = (req, file, cb) => {
  const allowedExts = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === 'application/pdf' && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError('Invalid file format. Only PDF (.pdf) documents are accepted.', 400), false);
  }
};

// File filter for Images
const imageFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype.startsWith('image/') && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError('Invalid image format. Only JPG, PNG, and WebP are allowed.', 400), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: resumeFilter,
});

const uploadImage = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: imageFilter,
});

module.exports = {
  uploadResume,
  uploadImage,
};
