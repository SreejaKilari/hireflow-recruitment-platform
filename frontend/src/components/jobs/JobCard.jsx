import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Briefcase, Building2, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const JobCard = ({ job, onQuickApply }) => {
  const navigate = useNavigate();
  const companyName = job.company?.name || job.companyName || 'Verified Employer';
  const logoUrl = job.company?.logoUrl || job.logoUrl;

  const formatSalary = () => {
    if (!job.minSalary && !job.maxSalary) return 'Competitive';
    const currency = job.currency === 'USD' ? '$' : job.currency || '$';
    const min = (job.minSalary / 1000).toFixed(0);
    const max = (job.maxSalary / 1000).toFixed(0);
    return `${currency}${min}k - ${currency}${max}k / yr`;
  };

  const getWorkplaceBadgeVariant = (type) => {
    switch (type?.toLowerCase()) {
      case 'remote': return 'accent';
      case 'hybrid': return 'primary';
      default: return 'info';
    }
  };

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div>
        {/* Header: Company Logo & Basic Meta */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
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
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <Building2 size={24} color="var(--color-primary)" />
              )}
            </div>

            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                {companyName}
              </p>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3 }}>
                <Link
                  to={`/jobs/${job._id}`}
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {job.title}
                </Link>
              </h3>
            </div>
          </div>

          {job.workplaceType && (
            <Badge variant={getWorkplaceBadgeVariant(job.workplaceType)}>
              {job.workplaceType}
            </Badge>
          )}
        </div>

        {/* Location & Compensation */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={15} color="var(--color-accent)" />
            {job.location}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <DollarSign size={15} color="var(--color-success)" />
            {formatSalary()}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={15} color="var(--color-primary)" />
            {job.jobType ? job.jobType.replace('-', ' ') : 'Full-time'}
          </span>
        </div>

        {/* Job Brief Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {job.description}
        </p>

        {/* Required Skills tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {(job.skillsRequired || []).slice(0, 4).map((skill, index) => (
            <span
              key={index}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
              }}
            >
              {skill}
            </span>
          ))}
          {(job.skillsRequired || []).length > 4 && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                padding: '0.2rem 0.3rem',
                alignSelf: 'center',
              }}
            >
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} />
          {job.createdAt ? 'Recently posted' : 'Active'}
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/jobs/${job._id}`)}
          >
            Details
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onQuickApply ? onQuickApply(job) : navigate(`/jobs/${job._id}`)}
            icon={<ArrowRight size={14} />}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
