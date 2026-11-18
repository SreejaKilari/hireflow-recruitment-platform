import React from 'react';
import { Target, Eye, Shield, Users, Award, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '5rem' }}>
      {/* HERO SECTION */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-border)',
          padding: '4.5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="app-container" style={{ maxWidth: '800px' }}>
          <span className="section-badge">Our Mission</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Empowering Seamless Talent Acquisition
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            HireFlow was built to bridge the gap between talented developers and fast-scaling organizations through intuitive, high-velocity recruitment software.
          </p>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="app-container">
        <div className="section-header">
          <span className="section-badge">Core Pillars</span>
          <h2>What Drives HireFlow</h2>
          <p>Our guiding principles ensure equal opportunity, maximum transparency, and developer-first workflows.</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Target size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Transparency First</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              We mandate realistic compensation bands and eliminate ambiguous job descriptions, empowering job seekers to make informed career decisions.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Speed & Automation</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Automated ATS pipelines, instant resume parsing, and notifications dramatically cut the average time-to-hire from 45 days down to 12.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Shield size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Integrity & Security</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Rigorous verification for all corporate recruiter accounts, encrypted candidate resumes, and full GDPR/data compliance standards.
            </p>
          </div>
        </div>
      </section>

      {/* PLATFORM ARCHITECTURE OVERVIEW */}
      <section style={{ backgroundColor: 'var(--color-bg-alt)', padding: '4.5rem 0' }}>
        <div className="app-container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <span className="section-badge">Technology Stack</span>
            <h2>Architected for High-Concurreny Scale</h2>
            <p>Engineered using the proven MERN stack architecture with clean decoupling and stateless authentication.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="card">
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Modern React.js Client</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                Declarative UI components, custom CSS tokens, React Router DOM v6+, and Context API state management for seamless user flows.
              </p>
            </div>
            <div className="card">
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Express & Node.js Engine</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                Robust RESTful API architecture with JWT authentication, role-based authorization, rate limiting, and centralized error handling.
              </p>
            </div>
            <div className="card">
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>MongoDB & Mongoose ODM</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                Schema enforcement, compound indexes for fast text search, and unique relational safeguards preventing duplicate submissions.
              </p>
            </div>
            <div className="card">
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Enterprise Security</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                Bcrypt password hashing with salts, Helmet HTTP header protection, Multer file sanitization, and Cloudinary media pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CREATOR & ARCHITECT SPOTLIGHT */}
      <section className="app-container" style={{ maxWidth: '840px' }}>
        <div
          className="card"
          style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.3)',
              flexShrink: 0,
            }}
          >
            KS
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-primary-light)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Creator & Lead Engineer
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', marginBottom: '0.25rem' }}>
              Kilari Sreeja
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Designed and built HireFlow from the ground up to solve modern recruitment bottlenecks. Focused on clean system modularity, intuitive UX, and secure multi-role access control.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              <span>✉️ <strong>kilarisreeja.e@gmail.com</strong></span>
              <span>📞 <strong>+91 90148 53736</strong></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
