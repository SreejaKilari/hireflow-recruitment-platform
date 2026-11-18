import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Globe
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { SAMPLE_JOBS } from '../../utils/sampleData';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isJobSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        if (res?.data) {
          setJob(res.data);
          if (res.data.hasApplied) setHasApplied(true);
        } else {
          // fallback to sample jobs
          const found = SAMPLE_JOBS.find((j) => j._id === id) || SAMPLE_JOBS[0];
          setJob(found);
        }
      } catch {
        const found = SAMPLE_JOBS.find((j) => j._id === id) || SAMPLE_JOBS[0];
        setJob(found);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in as a Job Seeker to submit an application');
      navigate('/login');
      return;
    }
    if (!isJobSeeker) {
      toast.error('Only Job Seekers can apply for open positions');
      return;
    }

    try {
      setApplying(true);
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await api.post(`/applications/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Your application was submitted successfully!');
      setHasApplied(true);
      setApplyModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this opening at ${job?.company?.name || job?.companyName} on HireFlow`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <Spinner text="Loading job details..." />;
  }

  if (!job) {
    return (
      <div className="app-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Job Not Found</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
          The requested job posting may have expired or been removed.
        </p>
        <Link to="/jobs" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          <Button variant="primary">Browse Open Jobs</Button>
        </Link>
      </div>
    );
  }

  const companyName = job.company?.name || job.companyName || 'Verified Employer';
  const logoUrl = job.company?.logoUrl || job.logoUrl;

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </button>

      {/* TOP HEADER CARD */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Building2 size={36} color="var(--color-primary)" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                {companyName}
              </span>
              <Badge variant="success">Verified Employer</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {job.title}
            </h1>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                marginTop: '0.85rem',
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} color="var(--color-accent)" />
                {job.location}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={16} color="var(--color-primary)" />
                {job.jobType ? job.jobType.replace('-', ' ') : 'Full-time'} ({job.workplaceType || 'Remote'})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <DollarSign size={16} color="var(--color-success)" />
                ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k / year
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="outline" icon={<Share2 size={16} />} onClick={handleShare}>
            Share
          </Button>

          {hasApplied ? (
            <Button variant="primary" disabled style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
              <CheckCircle2 size={18} />
              Application Submitted
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setApplyModalOpen(true)}
            >
              Apply for this Role
            </Button>
          )}
        </div>
      </div>

      {/* TWO-COLUMN DETAILS & SIDEBAR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* LEFT COLUMN: DESCRIPTION, RESPONSIBILITIES, SKILLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Role Overview
            </h3>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
              {job.description}
            </p>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                Key Responsibilities
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {job.responsibilities.map((resp, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color="var(--color-accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Skills & Qualifications
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(job.skillsRequired || []).map((skill, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.45rem 1rem',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: JOB SUMMARY & COMPANY CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Details Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              Job Snapshot
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Experience:</span>
                <span style={{ fontWeight: 600 }}>{job.experienceLevel ? job.experienceLevel.toUpperCase() : 'Not specified'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Openings:</span>
                <span style={{ fontWeight: 600 }}>{job.openings || 1} Open position(s)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Deadline:</span>
                <span style={{ fontWeight: 600 }}>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Ongoing'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Category:</span>
                <span style={{ fontWeight: 600 }}>{job.category || 'Engineering'}</span>
              </div>
            </div>
          </div>

          {/* Company Profile Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>About {companyName}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {job.company?.description || 'A verified technology organization utilizing the HireFlow recruitment infrastructure to hire world-class talent.'}
            </p>
            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <Globe size={16} />
                Visit Company Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* APPLICATION MODAL */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Attached Resume (PDF format)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="form-control"
            />
            {user?.resumeUrl && !resumeFile && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '0.35rem' }}>
                ✓ Your profile resume on file will be attached automatically.
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Cover Letter / Intro</label>
            <textarea
              rows={4}
              placeholder="Tell the hiring manager why you are an ideal fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" type="button" onClick={() => setApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={applying}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetails;
