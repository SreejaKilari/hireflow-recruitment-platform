const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

// Helper to sign JWT token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'hireflow_super_secret_jwt_key_2026_production_grade',
    { expiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d' }
  );

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    headline: user.headline,
    bio: user.bio,
    skills: user.skills,
    resumeUrl: user.resumeUrl,
    resumeOriginalName: user.resumeOriginalName,
    phone: user.phone,
    location: user.location,
    company: user.company,
    status: user.status,
  };

  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data: {
      token,
      user: userData,
    },
  });
};

/**
 * @desc    Register a new user (Job Seeker or Recruiter)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'job_seeker', companyName, companyWebsite } = req.body;

    if (!name || !email || !password) {
      throw ApiError.badRequest('Please provide name, email, and password.');
    }

    // Security requirement: Never allow public registration to create an admin
    if (role === 'admin') {
      throw ApiError.forbidden('Admin accounts cannot be registered via public signup.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'recruiter' ? 'recruiter' : 'job_seeker',
    });

    // If recruiter, automatically create initial Company entity
    if (role === 'recruiter') {
      const company = await Company.create({
        name: companyName || `${name}'s Company`,
        website: companyWebsite || '',
        recruiter: user._id,
      });
      user.company = company._id;
      await user.save();
    }

    sendTokenResponse(user, 201, res, 'Account created successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Please provide email and password.');
    }

    const user = await User.findOne({ email }).select('+password').populate('company');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (user.status === 'deactivated') {
      throw ApiError.forbidden('Your account is deactivated. Contact platform administration.');
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('company');
    return ApiResponse.success(res, { user }, 'Profile loaded');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      headline,
      bio,
      skills,
      phone,
      location,
      education,
      experience,
    } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (headline !== undefined) fieldsToUpdate.headline = headline;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (skills !== undefined) fieldsToUpdate.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (location !== undefined) fieldsToUpdate.location = location;
    if (education !== undefined) fieldsToUpdate.education = education;
    if (experience !== undefined) fieldsToUpdate.experience = experience;

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate('company');

    return ApiResponse.success(res, { user }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Upload Job Seeker Resume (PDF)
 * @route   POST /api/auth/upload-resume
 * @access  Private (Job Seeker)
 */
const uploadUserResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('Please select a PDF file to upload.');
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const resumeOriginalName = req.file.originalname;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl, resumeOriginalName },
      { new: true }
    );

    return ApiResponse.success(
      res,
      { resumeUrl, resumeOriginalName, user },
      'Resume uploaded successfully.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Upload User Avatar / Profile Image
 * @route   POST /api/auth/upload-avatar
 * @access  Private
 */
const uploadUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('Please upload an image file.');
    }

    const avatarUrl = `/uploads/logos/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatarUrl }, { new: true });

    return ApiResponse.success(res, { avatarUrl, user }, 'Avatar updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Forgot Password - generate token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't leak user existence in production; return success message
      return ApiResponse.success(
        res,
        null,
        'If an account with that email exists, password reset instructions have been generated.'
      );
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // For ease of local development and interview demonstrations, return token in response data
    return ApiResponse.success(
      res,
      { resetToken },
      'Password reset token generated successfully.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired password reset token.');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful. Please sign in.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  uploadUserResume,
  uploadUserAvatar,
  forgotPassword,
  resetPassword,
};
