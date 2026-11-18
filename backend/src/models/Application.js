const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Application must include a resume URL'],
    },
    resumeOriginalName: {
      type: String,
      default: 'Resume.pdf',
    },
    coverLetter: {
      type: String,
      default: '',
      maxlength: [3000, 'Cover letter cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: [
        'applied',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'rejected',
        'hired',
      ],
      default: 'applied',
    },
    notes: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same job by the same user
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
ApplicationSchema.index({ applicant: 1, createdAt: -1 });
ApplicationSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
