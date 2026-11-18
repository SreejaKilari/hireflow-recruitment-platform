import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected candidate modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/applications/job/${jobId}`);
      if (res?.data) {
        setJob(res.data.job);
        setApplications(res.data.applications);
      }
    } catch {
      // Fallback sample data
      setJob({
        _id: jobId,
        title: 'Senior Full Stack Engineer (MERN)',
        location: 'San Francisco, CA (Remote)',
      });
      setApplications([
        {
          _id: 'app_1',
          applicant: {
            _id: 'usr_1',
            name: 'Sreeja Sharma',
            email: 'seeker@hireflow.dev',
            phone: '+91 98765 43210',
            location: 'Bengaluru, India',
            headline: 'Senior Full Stack MERN Developer',
            skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs'],
          },
          status: 'shortlisted',
          resumeUrl: '/uploads/resumes/sample-resume.pdf',
          resumeOriginalName: 'Sreeja_Sharma_Resume.pdf',
          coverLetter: 'I am excited to apply for this Senior Full Stack position. With 4+ years building high scale React and Node SaaS platforms...',
          notes: 'Excellent candidate with strong MERN background.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        notes: internalNotes,
      });

      setApplications(
        applications.map((a) =>
          a._id === appId ? { ...a, status: newStatus, notes: internalNotes } : a
        )
      );

      if (selectedApp && selectedApp._id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus, notes: internalNotes });
      }

      toast.success(`Candidate status transitioned to ${newStatus.replace('_', ' ').toUpperCase()}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update candidate status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const applicant = app.applicant || {};
    const matchesSearch =
      applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.skills || []).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Spinner text="Loading candidate submissions..." />;
  }

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <button
        onClick={() => navigate('/recruiter/dashboard')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Recruiter Dashboard
      </button>

      {/* HEADER CARD */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
            Applicant Tracking Pipeline
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
            {job?.title}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {job?.location} • {applications.length} Total Candidate Submissions
          </p>
        </div>

        <Link to={`/jobs/${jobId}`}>
          <Button variant="outline" size="sm" icon={<ExternalLink size={14} />}>
            View Public Posting
          </Button>
        </Link>
      </div>

      {/* SEARCH & STATUS FILTER BAR */}
      <div
        className="card"
        style={{
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search candidate by name, email, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <option value="">All Candidates</option>
            <option value="applied">Applied</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      </div>

      {/* CANDIDATES LIST */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title="No candidates match your filter"
          description="Try clearing search keywords or selecting all pipeline statuses."
          actionText="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('');
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredApps.map((app) => {
            const applicant = app.applicant || {};

            return (
              <div
                key={app._id}
                className="card card-hover"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        flexShrink: 0,
                      }}
                    >
                      {applicant.name ? applicant.name[0].toUpperCase() : 'C'}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2px' }}>
                        {applicant.name || 'Candidate Name'}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>
                        {applicant.headline || 'Software Engineer'}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={14} /> {applicant.email}
                        </span>
                        {applicant.phone && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Phone size={14} /> {applicant.phone}
                          </span>
                        )}
                        {applicant.location && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} /> {applicant.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant={app.status}>
                      {app.status?.replace('_', ' ').toUpperCase()}
                    </Badge>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedApp(app);
                        setInternalNotes(app.notes || '');
                      }}
                    >
                      Evaluate Candidate
                    </Button>
                  </div>
                </div>

                {/* Candidate Skills */}
                {applicant.skills && applicant.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                    {applicant.skills.map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: 'var(--color-bg-alt)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* EVALUATION & STATUS UPDATE MODAL */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Candidate Evaluation: ${selectedApp?.applicant?.name}`}
        maxWidth="650px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Cover Letter / Candidate Note:</h4>
            <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {selectedApp?.coverLetter || 'No cover letter provided.'}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Attached Resume:</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <FileText size={18} color="var(--color-accent)" />
                <span>{selectedApp?.resumeOriginalName || 'Candidate_Resume.pdf'}</span>
              </div>
              <a
                href={selectedApp?.resumeUrl ? `http://localhost:5000${selectedApp.resumeUrl}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                <Download size={14} /> View / Download
              </a>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Internal Recruiter Notes (Confidential)</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Add feedback from hiring manager, interview scores, salary alignment notes..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            />
          </div>

          {/* Transition Pipeline Status Buttons */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>
              Transition Candidate Pipeline Stage:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Button
                size="sm"
                variant={selectedApp?.status === 'under_review' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(selectedApp._id, 'under_review')}
                disabled={updatingStatus}
              >
                Under Review
              </Button>
              <Button
                size="sm"
                variant={selectedApp?.status === 'shortlisted' ? 'accent' : 'outline'}
                onClick={() => handleStatusChange(selectedApp._id, 'shortlisted')}
                disabled={updatingStatus}
              >
                Shortlist
              </Button>
              <Button
                size="sm"
                variant={selectedApp?.status === 'interview_scheduled' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(selectedApp._id, 'interview_scheduled')}
                disabled={updatingStatus}
              >
                Schedule Interview
              </Button>
              <Button
                size="sm"
                variant={selectedApp?.status === 'hired' ? 'primary' : 'outline'}
                style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                onClick={() => handleStatusChange(selectedApp._id, 'hired')}
                disabled={updatingStatus}
              >
                Extend Offer (Hire)
              </Button>
              <Button
                size="sm"
                variant={selectedApp?.status === 'rejected' ? 'danger' : 'outline'}
                onClick={() => handleStatusChange(selectedApp._id, 'rejected')}
                disabled={updatingStatus}
              >
                Reject Candidate
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="outline" onClick={() => setSelectedApp(null)}>
              Close Evaluation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobApplications;
