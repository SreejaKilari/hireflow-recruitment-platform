const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications/:jobId/apply
 * @access  Private (Job Seeker)
 */
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      throw ApiError.notFound('Job posting not found.');
    }

    if (job.status !== 'active') {
      throw ApiError.badRequest('This job posting is closed and no longer accepting applications.');
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existing) {
      throw ApiError.conflict('You have already submitted an application for this position.');
    }

    // Determine resume URL (either new upload or profile resume)
    let resumeUrl = req.user.resumeUrl;
    let resumeOriginalName = req.user.resumeOriginalName || 'Resume.pdf';

    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      resumeOriginalName = req.file.originalname;
    }

    if (!resumeUrl) {
      throw ApiError.badRequest('Please upload a PDF resume or attach one in your profile.');
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl,
      resumeOriginalName,
      coverLetter: coverLetter || '',
      status: 'applied',
      statusHistory: [
        {
          status: 'applied',
          comment: 'Application submitted by candidate.',
        },
      ],
    });

    // Notify recruiter
    await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      message: `${req.user.name} applied for "${job.title}".`,
      type: 'new_application',
      link: `/recruiter/jobs/${job._id}/applications`,
    });

    return ApiResponse.created(res, application, 'Application submitted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all applications submitted by logged-in job seeker
 * @route   GET /api/applications/my-applications
 * @access  Private (Job Seeker)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logoUrl location website' },
      })
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, applications, 'Applications retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Withdraw job application
 * @route   DELETE /api/applications/:id/withdraw
 * @access  Private (Job Seeker)
 */
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      throw ApiError.notFound('Application not found.');
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('You are not authorized to withdraw this application.');
    }

    if (['shortlisted', 'interview_scheduled', 'hired'].includes(application.status)) {
      throw ApiError.badRequest(
        `Cannot withdraw application after reaching '${application.status}' phase.`
      );
    }

    await Application.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Application withdrawn successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all applications for a specific job (Recruiter ATS)
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter owner or Admin)
 */
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      throw ApiError.notFound('Job posting not found.');
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw ApiError.forbidden('You are not authorized to view candidates for this job.');
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email phone location headline skills avatarUrl')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, { job, applications }, 'Candidates retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update application status & internal notes (Recruiter ATS)
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Recruiter owner or Admin)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes, comment } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      throw ApiError.notFound('Application not found.');
    }

    if (
      application.job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw ApiError.forbidden('Not authorized to update this candidate.');
    }

    const previousStatus = application.status;

    if (status) {
      application.status = status;
      application.statusHistory.push({
        status,
        comment: comment || `Status updated from ${previousStatus} to ${status}.`,
        updatedAt: new Date(),
      });
    }

    if (notes !== undefined) {
      application.notes = notes;
    }

    await application.save();

    // Trigger candidate in-app notification if status changed
    if (status && status !== previousStatus) {
      const readableStatus = status.replace('_', ' ').toUpperCase();
      await Notification.create({
        recipient: application.applicant,
        sender: req.user._id,
        message: `Your application status for "${application.job.title}" has been updated to ${readableStatus}.`,
        type: 'application_status',
        link: '/seeker/applications',
      });
    }

    return ApiResponse.success(res, application, 'Application status updated.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get recruiter pipeline statistics
 * @route   GET /api/applications/stats/recruiter
 * @access  Private (Recruiter)
 */
const getRecruiterStats = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map((j) => j._id);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'active').length;
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const shortlistedCandidates = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'shortlisted',
    });
    const rejectedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'rejected',
    });
    const hiredCandidates = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'hired',
    });

    return ApiResponse.success(
      res,
      {
        totalJobs,
        activeJobs,
        totalApplications,
        shortlistedCandidates,
        rejectedApplications,
        hiredCandidates,
      },
      'Recruiter statistics retrieved.'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus,
  getRecruiterStats,
};
