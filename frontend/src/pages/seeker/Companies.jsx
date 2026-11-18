import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Globe, MapPin, Briefcase, X } from 'lucide-react';
import { SAMPLE_COMPANIES } from '../../utils/sampleData';
import Button from '../../components/common/Button';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = SAMPLE_COMPANIES.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '720px', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Hiring Companies
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.35rem', fontSize: '1.05rem' }}>
          Explore tech-forward organizations recruiting top talent directly on HireFlow.
        </p>

        <div
          style={{
            marginTop: '1.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: '0.65rem 0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Search size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search companies by name, industry, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company._id}
            className="card card-hover"
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{company.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{company.industry}</p>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {company.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} color="var(--color-accent)" />
                  {company.location}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Briefcase size={15} color="var(--color-primary)" />
                  {company.employeeCount} team members
                </span>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                }}
              >
                <Globe size={15} />
                Visit Website
              </a>

              <Link to={`/jobs?keyword=${encodeURIComponent(company.name)}`}>
                <Button size="sm" variant="outline-primary">
                  View {company.openJobsCount} Open Jobs
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
