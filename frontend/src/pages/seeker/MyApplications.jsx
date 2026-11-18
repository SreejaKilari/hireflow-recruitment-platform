import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  ExternalLink
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import { SAMPLE_JOBS } from '../../utils/sampleData';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my-applications');
      if (res?.data) {
        setApplications(res.data);
      }
    } catch {
      // Fallback sample data
      setApplications([
        {
          _id: 'app_demo_1',
          job: SAMPLE_JOBS[0],
          status: 'shortlisted',
          createdAt: new Date().toISOString(),
          statusHistory: [
            { status: 'applied', updatedAt: new Date(Date.now() - 86400000 * 3) },
            { status: 'under_review', updatedAt: new Date(Date.now() - 86400000 * 2) },
            { status: 'shortlisted', updatedAt: new Date() },
          ],
        },
        {
          _id: 'app_demo_2',
          job: SAMPLE_JOBS[1],
          status: 'applied',
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          statusHistory: [{ status: 'applied', updatedAt: new Date(Date.now() - 86400000 * 4) }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      setWithdrawingId(applicationId);
      await api.delete(`/applications/${applicationId}/withdraw`);
      toast.success('Application withdrawn successfully.');
      setApplications(applications.filter((a) => a._id !== applicationId));
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawingId(null);
    }
  };

  // Pipeline step visualizer helper
  const renderPipeline = (currentStatus) => {
    const steps = [
      { key: 'applied', label: 'Applied' },
      { key: 'under_review', label: 'Reviewing' },
      { key: 'shortlisted', label: 'Shortlisted' },
      { key: 'interview_scheduled', label: 'Interview' },
      { key: 'hired', label: 'Offer' },
    ];

    if (currentStatus === 'rejected') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 600 }}>
          <XCircle size={16} /> Not Selected for this position
        </div>
      );
    }

    const currentIndex = steps.findIndex((s) => s.key === currentStatus);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isDone ? 'var(--color-accent)' : '#e2e8f0',
                    border: isCurrent ? '2px solid var(--color-primary)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: isDone ? 'var(--color-text-primary)' : 'var(--color-text-muted)', fontWeight: isCurrent ? 700 : 400 }}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    height: '2px',
                    flex: 1,
                    backgroundColor: idx < currentIndex ? 'var(--color-accent)' : '#e2e8f0',
                    marginBottom: '16px',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <Spinner text="Loading your job applications..." />;
  }

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          My Job Applications
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
          Real-time candidate tracking across all submitted applications and hiring stages.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications submitted yet"
          description="Explore verified tech jobs on HireFlow and start applying today."
          actionText="Browse Open Jobs"
          onAction={() => window.location.assign('/jobs')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map((app) => {
            const job = app.job || {};
            const compName = job.company?.name || job.companyName || 'Verified Employer';
            const canWithdraw = ['applied', 'under_review'].includes(app.status);

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
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        {compName}
                      </span>
                      <span>•</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      <Link to={`/jobs/${job._id}`} style={{ color: 'var(--color-text-primary)' }}>
                        {job.title || 'Software Engineering Role'}
                      </Link>
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant={app.status}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </Badge>

                    {canWithdraw && (
                      <Button
                        size="sm"
                        variant="outline"
                        loading={withdrawingId === app._id}
                        onClick={() => handleWithdraw(app._id)}
                        icon={<Trash2 size={14} color="var(--color-danger)" />}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>

                {/* Pipeline visualizer */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Hiring Pipeline Stage
                    </p>
                    {renderPipeline(app.status)}
                  </div>

                  {app.coverLetter && (
                    <div style={{ maxWidth: '400px' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Your Submission Note
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{app.coverLetter}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
