const Company = require('../models/Company');
const Job = require('../models/Job');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * @desc    Get all companies with active job counts
 * @route   GET /api/companies
 * @access  Public
 */
const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    const companiesWithJobs = await Promise.all(
      companies.map(async (company) => {
        const openJobsCount = await Job.countDocuments({
          company: company._id,
          status: 'active',
        });
        return {
          ...company.toObject(),
          openJobsCount,
        };
      })
    );

    return ApiResponse.success(res, companiesWithJobs, 'Companies retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single company profile and its active job openings
 * @route   GET /api/companies/:id
 * @access  Public
 */
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) throw ApiError.notFound('Company not found.');

    const jobs = await Job.find({ company: company._id, status: 'active' }).sort({
      createdAt: -1,
    });

    return ApiResponse.success(res, { company, jobs }, 'Company profile retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update company profile
 * @route   PUT /api/companies/profile
 * @access  Private (Recruiter)
 */
const updateCompanyProfile = async (req, res, next) => {
  try {
    let company = await Company.findOne({ recruiter: req.user._id });

    if (!company) {
      company = await Company.create({
        ...req.body,
        recruiter: req.user._id,
      });
      req.user.company = company._id;
      await req.user.save();
    } else {
      company = await Company.findByIdAndUpdate(company._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    return ApiResponse.success(res, company, 'Company profile updated.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Upload company logo
 * @route   POST /api/companies/logo
 * @access  Private (Recruiter)
 */
const uploadCompanyLogo = async (req, res, next) => {
  try {
    if (!req.file) throw ApiError.badRequest('Please upload a company logo image.');

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    let company = await Company.findOne({ recruiter: req.user._id });

    if (!company) {
      company = await Company.create({
        name: `${req.user.name}'s Company`,
        recruiter: req.user._id,
        logoUrl,
      });
      req.user.company = company._id;
      await req.user.save();
    } else {
      company.logoUrl = logoUrl;
      await company.save();
    }

    return ApiResponse.success(res, { logoUrl, company }, 'Company logo uploaded.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  updateCompanyProfile,
  uploadCompanyLogo,
};
