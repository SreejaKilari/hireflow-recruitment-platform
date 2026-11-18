import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Upload,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import JobCard from '../../components/jobs/JobCard';
import { SAMPLE_JOBS } from '../../utils/sampleData';
import api from '../../services/api';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 20; // Base signup
    if (user?.headline) score += 20;
    if (user?.bio) score += 20;
    if (user?.skills && user.skills.length > 0) score += 20;
    if (user?.resumeUrl) score += 20;
    return Math.min(score, 100);
  };

  const completionPercent = calculateCompletion();

  useEffect(() => {
    const fetchSeekerData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my-applications');
        if (res?.data) {
          setApplications(res.data);
        }
      } catch {
        // Fallback demo applications
        setApplications([
          {
            _id: 'demo_app_1',
            job: SAMPLE_JOBS[0],
            status: 'shortlisted',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'demo_app_2',
            job: SAMPLE_JOBS[1],
            status: 'applied',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeekerData();
  }, []);

  const stats = {
    totalApplied: applications.length,
    underReview: applications.filter((a) => a.status === 'applied' || a.status === 'under_review').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted' || a.status === 'interview_scheduled').length,
    hired: applications.filter((a) => a.status === 'hired').length,
  };

  if (loading) {
    return <Spinner text="Loading candidate portal..." />;
  }

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* WELCOME BANNER */}
      <div
        className="card"
        style={{
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
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
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            Candidate Portal
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p style={{ color: '#e0e7ff', marginTop: '0.25rem', fontSize: '1rem' }}>
            {user?.headline || 'Explore recommendations and track your active job submissions.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/seeker/profile">
            <Button variant="outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Edit Profile
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="primary" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)' }}>
              Browse New Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* PROFILE COMPLETION BAR */}
      {completionPercent < 100 && (
        <div
          className="card"
          style={{
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                Profile Strength: {completionPercent}% Complete
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Recruiters prioritize completed profiles by 3.5x
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${completionPercent}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-accent)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          <Link to="/seeker/profile">
            <Button size="sm" variant="accent" icon={<Upload size={14} />}>
              Complete Resume & Skills
            </Button>
          </Link>
        </div>
      )}

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Total Applications</span>
            <FileText size={20} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.totalApplied}</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>In Review</span>
            <Clock size={20} color="var(--color-warning)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-warning)' }}>{stats.underReview}</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Shortlisted</span>
            <TrendingUp size={20} color="var(--color-accent)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }}>{stats.shortlisted}</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Offers Extended</span>
            <Award size={20} color="var(--color-success)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>{stats.hired}</h2>
        </div>
      </div>

      {/* TWO COLUMN SECTION: RECENT APPLICATIONS & RECOMMENDED JOBS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* RECENT APPLICATIONS */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Applications</h3>
            <Link to="/seeker/applications" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent)' }}>
              View All ({applications.length})
            </Link>
          </div>

          {applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Start applying to jobs to track your progress and interview invitations here."
              actionText="Search Jobs"
              onAction={() => navigate('/jobs')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.slice(0, 4).map((app) => {
                const jobTitle = app.job?.title || 'Engineering Role';
                const compName = app.job?.company?.name || app.job?.companyName || 'Enterprise Co.';

                return (
                  <div
                    key={app._id}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>
                        {jobTitle}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        {compName} • Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>

                    <Badge variant={app.status}>
                      {app.status ? app.status.replace('_', ' ').toUpperCase() : 'SUBMITTED'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RECOMMENDED JOBS */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recommended For You</h3>
            <Link to="/jobs" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent)' }}>
              Explore All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SAMPLE_JOBS.slice(0, 3).map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                className="card-hover"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{job.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {job.companyName || job.company?.name} • {job.location}
                    </p>
                  </div>
                  <Badge variant="accent">{job.workplaceType || 'Remote'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
