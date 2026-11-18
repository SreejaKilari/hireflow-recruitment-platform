import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  className = '',
  icon = null,
  size = 'md',
}) => {
  const variantMap = {
    primary: 'badge-primary',
    accent: 'badge-accent',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    // Job status specific mappings
    active: 'badge-success',
    closed: 'badge-danger',
    draft: 'badge-warning',
    // Application status mappings
    applied: 'badge-info',
    under_review: 'badge-warning',
    shortlisted: 'badge-accent',
    interview_scheduled: 'badge-primary',
    rejected: 'badge-danger',
    hired: 'badge-success',
  };

  const badgeClass = variantMap[variant.toLowerCase()] || 'badge-primary';

  return (
    <span
      className={`badge ${badgeClass} ${className}`}
      style={{
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        padding: size === 'sm' ? '0.15rem 0.45rem' : '0.25rem 0.65rem',
      }}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
