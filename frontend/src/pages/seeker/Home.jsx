import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Award,
  Sparkles,
  Shield,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import JobCard from '../../components/jobs/JobCard';
import { SAMPLE_JOBS, SAMPLE_COMPANIES, JOB_CATEGORIES } from '../../utils/sampleData';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loadingRole, setLoadingRole] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  // Instant 1-Click Role Launcher for Recruiters & Reviewers
  const handleLaunchRole = async (role) => {
    let creds = {};
    if (role === 'recruiter') creds = { email: 'recruiter@stripe.com', password: 'Password123!' };
    else if (role === 'admin') creds = { email: 'admin@hireflow.dev', password: 'AdminPassword123!' };
    else creds = { email: 'seeker@hireflow.dev', password: 'Password123!' };

    try {
      setLoadingRole(role);
      const res = await api.post('/auth/login', creds);
      if (res?.data?.token && res?.data?.user) {
        login(res.data.user, res.data.token);
        toast.success(`Welcome to the ${role.replace('_', ' ').toUpperCase()} portal!`);
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'recruiter') navigate('/recruiter/dashboard');
        else navigate('/seeker/dashboard');
      }
    } catch {
      toast.error('Role launcher failed.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', paddingBottom: '4rem' }}>
      {/* 🚀 GRAND HERO SECTION (ABOVE THE FOLD ROLE-BASED COMMAND CENTER) */}
      <section
        className="hero-mesh"
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-border)',
          padding: '3.5rem 0 4.5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
          {/* TOP HEADLINE */}
          <div style={{ maxWidth: '880px', margin: '0 auto 2.5rem auto', textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1.15rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 10px -2px rgba(15, 23, 42, 0.08)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span className="pulse-dot" />
              Engineered by Kilari Sreeja • Full-Stack Recruitment Ecosystem
            </span>

            <h1
              className="gradient-text"
              style={{
                fontSize: 'clamp(2.3rem, 4.5vw, 3.6rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1rem',
                letterSpacing: '-0.025em',
              }}
            >
              Find Your Dream Job. <br />
              <span className="gradient-text-accent">Build Your Future.</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              Explore 3 interactive role-based portals below or search live verified opportunities across top tech organizations.
            </p>
          </div>

          {/* ⭐ 3-ROLE INTERACTIVE ENTRY CARDS (ABOVE THE FOLD - NO SCROLLING NEEDED!) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              maxWidth: '1080px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            {/* ROLE 1: JOB SEEKER (KILARI SREEJA) */}
            <div
              className="card card-glow"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.06)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-accent-subtle)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserCheck size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      backgroundColor: 'var(--color-accent-subtle)',
                      color: 'var(--color-accent-hover)',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Job Seeker
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--color-text-primary)' }}>
                  Candidate Portal
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Explore verified tech jobs, upload PDF resume, and track live application pipeline stages (*Applied* → *Offer*).
                </p>
              </div>

              <Button
                variant="accent"
                size="md"
                style={{ width: '100%', fontWeight: 700 }}
                loading={loadingRole === 'seeker'}
                onClick={() => handleLaunchRole('seeker')}
                icon={<ArrowRight size={16} />}
              >
                Launch Seeker (Kilari Sreeja)
              </Button>
            </div>

            {/* ROLE 2: RECRUITER ATS (STRIPE TALENT) */}
            <div
              className="card card-glow"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--color-primary)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 25px -5px rgba(30, 58, 138, 0.12)',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em',
                }}
              >
                MOST POPULAR FOR REVIEWERS
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Briefcase size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Employer ATS
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--color-primary)' }}>
                  Recruiter ATS Hub
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Post roles, inspect candidate resumes, transition statuses (*Under Review*, *Shortlist*, *Hired*) and add internal notes.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                style={{ width: '100%', fontWeight: 700 }}
                loading={loadingRole === 'recruiter'}
                onClick={() => handleLaunchRole('recruiter')}
                icon={<ArrowRight size={16} />}
              >
                Launch Recruiter (Stripe)
              </Button>
            </div>

            {/* ROLE 3: PLATFORM ADMIN (MASTER CONTROL) */}
            <div
              className="card card-glow"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.06)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Shield size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Governance
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--color-text-primary)' }}>
                  Platform Admin
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Live system metrics, user governance (activate/deactivate accounts), and job posting moderation & approvals.
                </p>
              </div>

              <Button
                variant="outline"
                size="md"
                style={{ width: '100%', fontWeight: 700, borderColor: '#cbd5e1' }}
                loading={loadingRole === 'admin'}
                onClick={() => handleLaunchRole('admin')}
                icon={<ArrowRight size={16} />}
              >
                Launch Admin Control
              </Button>
            </div>
          </div>

          {/* HORIZONTAL UNIFIED SEARCH BAR (CLEAN, NO VERTICAL SQUISHING) */}
          <form
            onSubmit={handleSearch}
            style={{
              backgroundColor: '#ffffff',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.1)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem',
              maxWidth: '880px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            {/* Keyword Input */}
            <div
              style={{
                flex: '1 1 260px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.55rem 0.85rem',
                backgroundColor: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <Search size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Job title, skills (e.g. React, Node.js), or company..."
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
            </div>

            {/* Location Input */}
            <div
              style={{
                flex: '1 1 200px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.55rem 0.85rem',
                backgroundColor: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Location or 'Remote'..."
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
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Search size={16} />}
              style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', height: '42px' }}
            >
              Find Jobs
            </Button>
          </form>

          {/* POPULAR SEARCH PILLS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <span style={{ fontWeight: 600 }}>Quick suggestions:</span>
            {['Full Stack', 'React.js', 'Node.js', 'Remote Roles', 'Product Designer'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setKeyword(term);
                  navigate(`/jobs?keyword=${encodeURIComponent(term)}`);
                }}
                style={{
                  padding: '0.2rem 0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS COUNTER BAR */}
      <section className="app-container">
        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 2.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          <div>
            <h3 style={{ fontSize: '2.25rem', color: 'var(--color-primary)', fontWeight: 800 }}>8,500+</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Live Verified Jobs</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '2.25rem', color: 'var(--color-accent)', fontWeight: 800 }}>1,200+</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Tech Companies Hiring</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '2.25rem', color: 'var(--color-success)', fontWeight: 800 }}>45,000+</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Job Seekers Placed</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '2.25rem', color: 'var(--color-primary)', fontWeight: 800 }}>98.4%</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Candidate Satisfaction</p>
          </div>
        </div>
      </section>

      {/* FEATURED ROLES SECTION */}
      <section className="app-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-badge">Handpicked Opportunities</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>Featured Roles</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Explore high-impact positions at industry-leading companies.</p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" icon={<ArrowRight size={16} />}>
              Explore All Jobs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {SAMPLE_JOBS.slice(0, 3).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section style={{ backgroundColor: 'var(--color-bg-alt)', padding: '5rem 0' }}>
        <div className="app-container">
          <div className="section-header">
            <span className="section-badge">Curated Sectors</span>
            <h2>Popular Career Categories</h2>
            <p>Find openings tailored specifically to your specialized engineering and product skill set.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {JOB_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="card card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                }}
              >
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
                  }}
                >
                  <Briefcase size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{cat.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{cat.openJobs} active openings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW HIREFLOW WORKS */}
      <section className="app-container">
        <div className="section-header">
          <span className="section-badge">Seamless Process</span>
          <h2>How HireFlow Works</h2>
          <p>A streamlined, transparent three-step journey to your next career milestone.</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Create Profile & Upload Resume</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Highlight your technical skills, work experience, education, and upload your verified PDF resume once.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Filter & 1-Click Apply</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Filter by compensation, location, or remote preference. Submit verified applications instantly with no tedious repetition.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Track Live Pipeline</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Never wonder where you stand. Watch status transitions in real time from Screening to Interview and Official Offer.
            </p>
          </div>
        </div>
      </section>

      {/* TOP HIRING COMPANIES */}
      <section className="app-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <span className="section-badge">Enterprise Partners</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>Top Hiring Companies</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Join elite engineering organizations scaling on HireFlow.</p>
          </div>
          <Link to="/companies">
            <Button variant="outline" icon={<ArrowRight size={16} />}>
              View All Companies
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {SAMPLE_COMPANIES.map((company) => (
            <div
              key={company._id}
              className="card card-hover"
              style={{ textAlign: 'center', padding: '2rem 1.5rem' }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-md)',
                  margin: '0 auto 1rem auto',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                }}
              >
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{company.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                {company.industry}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                {company.openJobsCount} Open Jobs
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="app-container">
        <div
          style={{
            backgroundColor: 'var(--color-accent)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2.5rem',
            textAlign: 'center',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
          }}
        >
          <h2 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '1rem', fontWeight: 800 }}>
            Ready to Take the Next Step in Your Career?
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#e0e7ff', maxWidth: '640px', margin: '0 auto 2rem auto' }}>
            Join thousands of developers, designers, and tech innovators advancing their careers with HireFlow.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register?role=job_seeker">
              <Button size="lg" variant="primary" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)' }}>
                Create Free Seeker Account
              </Button>
            </Link>
            <Link to="/register?role=recruiter">
              <Button size="lg" variant="outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
                Hire Talent as Recruiter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
