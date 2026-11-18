import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, X, SlidersHorizontal } from 'lucide-react';
import JobCard from '../../components/jobs/JobCard';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { SAMPLE_JOBS, JOB_CATEGORIES } from '../../utils/sampleData';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BrowseJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, isJobSeeker } = useAuth();

  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [loading, setLoading] = useState(false);

  // Filter States initialized from URL params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');
  const [minSalary, setMinSalary] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Quick Apply Modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);

  // Mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch from backend API if available, fallback to SAMPLE_JOBS
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs', {
          params: {
            keyword: keyword || undefined,
            location: location || undefined,
            category: category || undefined,
            jobType: jobType || undefined,
            experienceLevel: experienceLevel || undefined,
          },
        });
        if (res?.data?.jobs && res.data.jobs.length > 0) {
          setJobs(res.data.jobs);
        } else {
          setJobs(SAMPLE_JOBS);
        }
      } catch {
        // Fallback to sample jobs
        setJobs(SAMPLE_JOBS);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category, jobType, experienceLevel]);

  // Client-side filtering & sorting
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (keyword) {
        const query = keyword.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDesc = job.description?.toLowerCase().includes(query);
        const matchesSkills = (job.skillsRequired || []).some((s) => s.toLowerCase().includes(query));
        const matchesCompany = (job.company?.name || job.companyName || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSkills && !matchesCompany) return false;
      }

      if (location) {
        const locQuery = location.toLowerCase();
        const matchesLoc = job.location.toLowerCase().includes(locQuery);
        const matchesWorkplace = job.workplaceType?.toLowerCase().includes(locQuery);
        if (!matchesLoc && !matchesWorkplace) return false;
      }

      if (category && job.category && job.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      if (jobType && job.jobType?.toLowerCase() !== jobType.toLowerCase()) {
        return false;
      }

      if (experienceLevel && job.experienceLevel?.toLowerCase() !== experienceLevel.toLowerCase()) {
        return false;
      }

      if (minSalary && job.maxSalary && job.maxSalary < Number(minSalary)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salaryHigh') {
        return (b.maxSalary || 0) - (a.maxSalary || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [jobs, keyword, location, category, jobType, experienceLevel, minSalary, sortBy]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in as a Job Seeker to submit an application');
      return;
    }
    if (!isJobSeeker) {
      toast.error('Only registered Job Seekers can apply for positions');
      return;
    }

    try {
      setApplying(true);
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await api.post(`/applications/${selectedJobForApply._id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`Application successfully submitted for ${selectedJobForApply.title}!`);
      setSelectedJobForApply(null);
      setCoverLetter('');
      setResumeFile(null);
    } catch (err) {
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('');
    setJobType('');
    setExperienceLevel('');
    setMinSalary('');
    setSearchParams({});
  };

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Explore Open Opportunities
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
          Discover verified roles across industry-leading tech startups and enterprises.
        </p>
      </div>

      {/* UNIFIED PREMIUM SEARCH BAR */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: '0.65rem 0.75rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* Keyword Search Section */}
        <div
          style={{
            flex: '1 1 300px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.95rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Search size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search job title, skills (React, Node, etc.), or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              backgroundColor: 'transparent',
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)',
            }}
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Location Search Section */}
        <div
          style={{
            flex: '1 1 240px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.95rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
          }}
        >
          <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Location, city, or 'Remote'..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              backgroundColor: 'transparent',
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)',
            }}
          />
          {location && (
            <button
              type="button"
              onClick={() => setLocation('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {(keyword || location || category || jobType || experienceLevel || minSalary) && (
            <Button
              variant="outline"
              size="md"
              onClick={clearAllFilters}
            >
              Reset
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            icon={<Search size={16} />}
          >
            Find Roles
          </Button>
        </div>
      </div>

      {/* QUICK PRESET FILTER PILLS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          fontSize: '0.85rem',
        }}
      >
        <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Popular filters:</span>
        {[
          { label: '🌐 Remote Roles', apply: () => { setJobType('remote'); setLocation('Remote'); } },
          { label: '💼 Full-Time', apply: () => setJobType('full-time') },
          { label: '🚀 Senior Engineer', apply: () => setExperienceLevel('senior') },
          { label: '🌱 Entry Level', apply: () => setExperienceLevel('entry') },
          { label: '💰 $100k+', apply: () => setMinSalary('100000') },
          { label: '⚛️ React.js', apply: () => setKeyword('React') },
          { label: '🟢 Node.js', apply: () => setKeyword('Node') },
        ].map((tag, i) => (
          <button
            key={i}
            type="button"
            onClick={tag.apply}
            style={{
              padding: '0.3rem 0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* DESKTOP FILTER SIDEBAR */}
        <aside
          className="card"
          style={{
            position: 'sticky',
            top: '90px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={18} color="var(--color-accent)" />
              Filter By
            </h3>
            <button
              onClick={clearAllFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset All
            </button>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="form-label">Employment Type</label>
            <Select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              placeholder="Any Employment Type"
              options={[
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'remote', label: 'Remote' },
                { value: 'internship', label: 'Internship' },
              ]}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="form-label">Specialization</label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="All Specializations"
              options={JOB_CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="form-label">Experience Level</label>
            <Select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              placeholder="All Levels"
              options={[
                { value: 'entry', label: 'Entry Level (0-2 yrs)' },
                { value: 'mid', label: 'Mid Level (2-5 yrs)' },
                { value: 'senior', label: 'Senior Level (5+ yrs)' },
                { value: 'lead', label: 'Lead / Principal' },
              ]}
            />
          </div>

          {/* Minimum Salary */}
          <div>
            <label className="form-label">Minimum Annual Salary</label>
            <Select
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              placeholder="No Minimum"
              options={[
                { value: '50000', label: '$50,000+ / yr' },
                { value: '80000', label: '$80,000+ / yr' },
                { value: '100000', label: '$100,000+ / yr' },
                { value: '140000', label: '$140,000+ / yr' },
              ]}
            />
          </div>
        </aside>

        {/* JOB RESULTS COLUMN */}
        <div>
          {/* Header Bar with Count and Sorting */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Showing <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{filteredJobs.length}</span> positions available
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-primary)',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <option value="latest">Most Recent</option>
                <option value="salaryHigh">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <EmptyState
              title="No matching jobs found"
              description="Try adjusting your keyword, location, or filters to find more relevant career opportunities."
              actionText="Clear All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onQuickApply={(jobToApply) => setSelectedJobForApply(jobToApply)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QUICK APPLY MODAL */}
      <Modal
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        title={`Apply to ${selectedJobForApply?.title}`}
      >
        <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Company: <strong>{selectedJobForApply?.company?.name || selectedJobForApply?.companyName}</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Location: <strong>{selectedJobForApply?.location}</strong>
            </p>
          </div>

          <div>
            <label className="form-label">
              Upload Resume (PDF, max 5MB)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="form-control"
            />
            {user?.resumeUrl && !resumeFile && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '0.35rem' }}>
                ✓ Profile resume on file will be used if no new file is selected.
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Cover Letter / Note to Recruiter</label>
            <textarea
              rows={4}
              placeholder="Highlight relevant experience, achievements, and why you are interested in this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="outline"
              type="button"
              onClick={() => setSelectedJobForApply(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={applying}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BrowseJobs;
