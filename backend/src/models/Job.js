const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Job must be linked to a company'],
    },
    companyName: {
      type: String,
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed job description'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skillsRequired: {
      type: [String],
      required: [true, 'Please specify at least one required skill'],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'remote', 'internship'],
      default: 'full-time',
    },
    workplaceType: {
      type: String,
      enum: ['on-site', 'hybrid', 'remote'],
      default: 'remote',
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      default: 'mid',
    },
    category: {
      type: String,
      default: 'Engineering',
    },
    location: {
      type: String,
      required: [true, 'Please specify job location or Remote'],
    },
    minSalary: {
      type: Number,
      default: 0,
    },
    maxSalary: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, 'Openings must be at least 1'],
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approved by default, flaggable by admin
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Search & Feed Indexes
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text', location: 'text' });

module.exports = mongoose.model('Job', JobSchema);
