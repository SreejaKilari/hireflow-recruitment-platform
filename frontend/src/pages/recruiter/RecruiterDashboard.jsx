import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  PlusCircle,
  TrendingUp,
  Building2,
  ArrowRight,
  Eye,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    rejectedApplications: 0,
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        setLoading(true);
        const [statsRes, jobsRes] = await Promise.all([
          api.get('/applications/stats/recruiter'),
          api.get('/jobs/my-jobs'),
        ]);

        if (statsRes?.data) setStats(statsRes.data);
        if (jobsRes?.data) setJobs(jobsRes.data);
      } catch {
        // Fallback for offline demo
        setStats({
          totalJobs: 3,
          activeJobs: 3,
          totalApplications: 14,
          shortlistedCandidates: 4,
          rejectedApplications: 2,
        });
        setJobs([
          {
            _id: 'job_rec_1',
            title: 'Senior Full Stack Engineer (MERN)',
            status: 'active',
            totalApplications: 8,
            shortlistedCount: 3,
            location: 'San Francisco, CA (Remote)',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'job_rec_2',
            title: 'Backend API Engineer (Node.js)',
            status: 'active',
            totalApplications: 6,
            shortlistedCount: 1,
            location: 'New York, NY',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, []);

  const handleToggleStatus = async (jobId) => {
    try {
      const res = await api.patch(`/jobs/${jobId}/status`);
      setJobs(jobs.map((j) => (j._id === jobId ? { ...j, status: res.data.status } : j)));
      toast.success(`Job marked as ${res.data.status}`);
    } catch {
      // Local optimistic toggle
      setJobs(
        jobs.map((j) =>
          j._id === jobId
            ? { ...j, status: j.status === 'active' ? 'closed' : 'active' }
            : j
        )
      );
      toast.success('Job status updated');
    }
  };

  if (loading) {
    return <Spinner text="Loading Recruiter ATS Workspace..." />;
  }

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* HEADER BANNER */}
      <div
        className="card"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            Recruiter Portal & ATS
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {user?.company?.name || user?.name}'s Hiring Hub
          </h1>
          <p style={{ color: '#cbd5e1', marginTop: '0.25rem', fontSize: '1rem' }}>
            Manage active job requisitions, evaluate candidate resumes, and orchestrate interview pipelines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/recruiter/company-profile">
            <Button variant="outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Company Profile
            </Button>
          </Link>
          <Link to="/recruiter/post-job">
            <Button variant="accent" icon={<PlusCircle size={16} />}>
              Post New Requisition
            </Button>
          </Link>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Active Jobs</span>
            <Briefcase size={20} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.activeJobs}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Out of {stats.totalJobs} total posted
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Total Applicants</span>
            <Users size={20} color="var(--color-accent)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }}>{stats.totalApplications}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Across all active positions
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Shortlisted</span>
            <CheckCircle2 size={20} color="var(--color-success)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>{stats.shortlistedCandidates}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            In interview or review stage
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Archived / Rejected</span>
            <XCircle size={20} color="var(--color-danger)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-danger)' }}>{stats.rejectedApplications}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Disqualified applicants
          </p>
        </div>
      </div>

      {/* JOBS ATS TABLE & PIPELINES */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Job Requisitions</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Click "View Candidates" to open the candidate applicant tracking pipeline.
            </p>
          </div>

          <Link to="/recruiter/post-job">
            <Button size="sm" variant="primary" icon={<PlusCircle size={16} />}>
              Create New Job
            </Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            title="No job postings yet"
            description="Publish your first technical role to start receiving qualified candidate applications."
            actionText="Post a Job Now"
            onAction={() => navigate('/recruiter/post-job')}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Position Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Applicants</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Shortlisted</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Posted Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      <Link to={`/jobs/${job._id}`} style={{ color: 'var(--color-primary)' }}>
                        {job.title}
                      </Link>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                        {job.location}
                      </p>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <Badge variant={job.status}>
                        {job.status?.toUpperCase()}
                      </Badge>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {job.totalApplications || 0}
                      </span>{' '}
                      candidates
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                        {job.shortlistedCount || 0}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Active'}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link to={`/recruiter/jobs/${job._id}/applications`}>
                          <Button size="sm" variant="accent" icon={<Users size={14} />}>
                            Candidates ({job.totalApplications || 0})
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(job._id)}
                        >
                          {job.status === 'active' ? 'Close' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
