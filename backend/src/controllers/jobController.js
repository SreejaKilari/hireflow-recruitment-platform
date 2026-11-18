const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * @desc    Get all active jobs with filtering, search, sorting & pagination
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      category,
      jobType,
      experienceLevel,
      workplaceType,
      minSalary,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'active', isApproved: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skillsRequired: { $regex: keyword, $options: 'i' } },
        { companyName: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.$or = (query.$or || []).concat([
        { location: { $regex: location, $options: 'i' } },
        { workplaceType: { $regex: location, $options: 'i' } },
      ]);
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (workplaceType) {
      query.workplaceType = workplaceType;
    }

    if (minSalary) {
      query.maxSalary = { $gte: Number(minSalary) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'salaryHigh') {
      sortOption = { maxSalary: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('company', 'name logoUrl location website description industry')
      .sort(sortOption)
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
      'Jobs retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('recruiter', 'name email');

    if (!job) {
      throw ApiError.notFound('Job posting not found.');
    }

    let hasApplied = false;
    if (req.user) {
      const application = await Application.findOne({
        job: job._id,
        applicant: req.user._id,
      });
      if (application) hasApplied = true;
    }

    return ApiResponse.success(res, { ...job.toObject(), hasApplied }, 'Job details retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private (Recruiter only)
 */
const createJob = async (req, res, next) => {
  try {
    let company = await Company.findOne({ recruiter: req.user._id });

    if (!company) {
      company = await Company.create({
        name: `${req.user.name}'s Company`,
        recruiter: req.user._id,
      });
      req.user.company = company._id;
      await req.user.save();
    }

    const {
      title,
      description,
      responsibilities,
      skillsRequired,
      qualifications,
      jobType,
      workplaceType,
      experienceLevel,
      category,
      location,
      minSalary,
      maxSalary,
      currency,
      openings,
      deadline,
      status,
    } = req.body;

    if (!title || !description || !location) {
      throw ApiError.badRequest('Please provide title, description, and location.');
    }

    const skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : (skillsRequired || '').split(',').map((s) => s.trim()).filter(Boolean);

    const respList = Array.isArray(responsibilities)
      ? responsibilities
      : (responsibilities || '').split('\n').map((r) => r.trim()).filter(Boolean);

    const job = await Job.create({
      title,
      company: company._id,
      companyName: company.name,
      recruiter: req.user._id,
      description,
      responsibilities: respList,
      skillsRequired: skills.length > 0 ? skills : ['General Tech'],
      qualifications: qualifications || [],
      jobType: jobType || 'full-time',
      workplaceType: workplaceType || 'remote',
      experienceLevel: experienceLevel || 'mid',
      category: category || 'Engineering',
      location,
      minSalary: minSalary || 0,
      maxSalary: maxSalary || 0,
      currency: currency || 'USD',
      openings: openings || 1,
      deadline: deadline || null,
      status: status || 'active',
    });

    return ApiResponse.created(res, job, 'Job created successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update existing job posting
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiter owner or Admin)
 */
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      throw ApiError.notFound('Job posting not found.');
    }

    // Security check: Only the recruiter who created the job or an admin can update it
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw ApiError.forbidden('You are not authorized to update this job posting.');
    }

    if (req.body.skillsRequired && !Array.isArray(req.body.skillsRequired)) {
      req.body.skillsRequired = req.body.skillsRequired.split(',').map((s) => s.trim());
    }
    if (req.body.responsibilities && !Array.isArray(req.body.responsibilities)) {
      req.body.responsibilities = req.body.responsibilities.split('\n').map((r) => r.trim());
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return ApiResponse.success(res, job, 'Job updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete job posting
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter owner or Admin)
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      throw ApiError.notFound('Job posting not found.');
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw ApiError.forbidden('You are not authorized to delete this job posting.');
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also remove associated applications
    await Application.deleteMany({ job: req.params.id });

    return ApiResponse.success(res, null, 'Job deleted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all jobs for logged-in recruiter with application metrics
 * @route   GET /api/jobs/my-jobs
 * @access  Private (Recruiter only)
 */
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

    // Aggregate application counts for each job
    const jobsWithMetrics = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({ job: job._id });
        const shortlistedCount = await Application.countDocuments({
          job: job._id,
          status: 'shortlisted',
        });
        const hiredCount = await Application.countDocuments({
          job: job._id,
          status: 'hired',
        });
        return {
          ...job.toObject(),
          totalApplications,
          shortlistedCount,
          hiredCount,
        };
      })
    );

    return ApiResponse.success(res, jobsWithMetrics, 'Recruiter jobs retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle job active / closed status
 * @route   PATCH /api/jobs/:id/status
 * @access  Private (Recruiter owner)
 */
const toggleJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw ApiError.notFound('Job posting not found.');

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw ApiError.forbidden('Not authorized to modify this job.');
    }

    job.status = job.status === 'active' ? 'closed' : 'active';
    await job.save();

    return ApiResponse.success(res, job, `Job status updated to ${job.status}.`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  toggleJobStatus,
};
