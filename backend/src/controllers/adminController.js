const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * @desc    Get overall platform analytics & metrics
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSeekers = await User.countDocuments({ role: 'job_seeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const hiredCount = await Application.countDocuments({ status: 'hired' });

    // Application status breakdown
    const statusBreakdown = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('applicant', 'name email avatarUrl')
      .populate('job', 'title companyName')
      .sort({ createdAt: -1 })
      .limit(5);

    return ApiResponse.success(
      res,
      {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        activeJobs,
        totalApplications,
        hiredCount,
        statusBreakdown,
        recentApplications,
      },
      'Platform analytics retrieved.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all users with search, role filter, status filter & pagination
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.success(
      res,
      {
        users,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
      'Users retrieved.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle user status (activate / deactivate)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin only)
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found.');

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      throw ApiError.badRequest('Admins cannot deactivate their own active account.');
    }

    user.status = user.status === 'active' ? 'deactivated' : 'active';
    await user.save();

    return ApiResponse.success(res, user, `User account ${user.status}.`);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all jobs for moderation (with approval toggle)
 * @route   GET /api/admin/jobs
 * @access  Private (Admin only)
 */
const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { status, isApproved, search, page = 1, limit = 15 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.success(
      res,
      {
        jobs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
      'Jobs retrieved for admin moderation.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle job approval / flag status
 * @route   PATCH /api/admin/jobs/:id/approve
 * @access  Private (Admin only)
 */
const toggleJobApproval = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw ApiError.notFound('Job posting not found.');

    job.isApproved = !job.isApproved;
    await job.save();

    return ApiResponse.success(
      res,
      job,
      `Job has been ${job.isApproved ? 'approved' : 'flagged and hidden'}.`
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
  getAllJobsAdmin,
  toggleJobApproval,
};
