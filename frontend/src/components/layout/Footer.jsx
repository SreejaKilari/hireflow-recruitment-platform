import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Globe, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-primary-hover)',
        color: '#e2e8f0',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
      }}
    >
      <div className="app-container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '3rem' }}>
          {/* Column 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-accent)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Briefcase size={20} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                Hire<span style={{ color: 'var(--color-accent)' }}>Flow</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              The modern cloud recruitment platform connecting world-class talent with high-growth companies. Automate hiring, streamline pipelines, and build your dream team.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', color: '#94a3b8' }}>
              <Globe size={18} />
              <Shield size={18} />
            </div>
          </div>

          {/* Column 2: Job Seekers */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              For Job Seekers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/jobs" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Browse All Jobs</Link>
              </li>
              <li>
                <Link to="/jobs?jobType=remote" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Remote Opportunities</Link>
              </li>
              <li>
                <Link to="/companies" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Company Directory</Link>
              </li>
              <li>
                <Link to="/register?role=job_seeker" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Create Seeker Profile</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Employers */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              For Employers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/register?role=recruiter" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Post a Job</Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Recruiter ATS</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Hiring Solutions</Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enterprise Inquiries</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--color-accent)" />
                <span>support@hireflow.dev</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-accent)" />
                <span>+1 (800) 447-3356</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-accent)" />
                <span>Tech District, San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <p>© {new Date().getFullYear()} HireFlow • Designed & Developed by <strong>Kilari Sreeja</strong></p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Modern Hiring Teams & Engineering Portfolios.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
