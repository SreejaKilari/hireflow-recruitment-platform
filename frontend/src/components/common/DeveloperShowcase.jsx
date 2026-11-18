import React, { useState } from 'react';
import {
  Code2,
  X,
  Mail,
  Phone,
  Linkedin,
  Github,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Zap,
  Briefcase
} from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DeveloperShowcase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('kilarisreeja.e@gmail.com');
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickLogin = async (role) => {
    let creds = {};
    if (role === 'recruiter') creds = { email: 'recruiter@stripe.com', password: 'Password123!' };
    else if (role === 'admin') creds = { email: 'admin@hireflow.dev', password: 'AdminPassword123!' };
    else creds = { email: 'seeker@hireflow.dev', password: 'Password123!' };

    try {
      const res = await api.post('/auth/login', creds);
      if (res?.data?.token && res?.data?.user) {
        login(res.data.user, res.data.token);
        toast.success(`Logged in as ${res.data.user.name}!`);
        setIsOpen(false);
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'recruiter') navigate('/recruiter/dashboard');
        else navigate('/seeker/dashboard');
      }
    } catch (err) {
      toast.error('Login failed.');
    }
  };

  return (
    <>
      {/* FLOATING ACTION PILL */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 1.15rem',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 700,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 14px 28px -5px rgba(37, 99, 235, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.4)';
          }}
          aria-label="View Developer Profile"
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            KS
          </div>
          <span>Built by Kilari Sreeja</span>
          <span
            style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.5rem',
              backgroundColor: 'rgba(59, 130, 246, 0.25)',
              color: '#93c5fd',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
            }}
          >
            Info
          </span>
        </button>
      </div>

      {/* SHOWCASE MODAL / DRAWER */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl)',
              animation: 'fadeIn 0.2s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                padding: '1.75rem',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                color: '#ffffff',
                borderTopLeftRadius: 'var(--radius-lg)',
                borderTopRightRadius: 'var(--radius-lg)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  KS
                </div>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.6rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.25)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#93c5fd',
                      textTransform: 'uppercase',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Architect & Full-Stack Developer
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                    Kilari Sreeja
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Specialized in MERN Stack, React 19, Node.js & Distributed REST APIs
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* CONTACT DETAILS */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                    <Mail size={16} color="var(--color-accent)" />
                    <span>kilarisreeja.e@gmail.com</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-accent)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy Email'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                  <Phone size={16} color="var(--color-accent)" />
                  <span>+91 90148 53736</span>
                </div>
              </div>

              {/* ARCHITECTURAL HIGHLIGHTS */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                  Engineering Highlights Built into HireFlow:
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle size={15} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Role-Based Access Control (RBAC):</strong> Complete separation of Seeker, Recruiter, and Admin portals.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle size={15} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Duplicate Application Shield:</strong> Compound unique indexes preventing candidate spam.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle size={15} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>ATS Candidate Funnel:</strong> Stage transitions (*Under Review*, *Shortlisted*, *Interview*, *Hired*).</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle size={15} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Stateless JWT & Multi-DB:</strong> Bcrypt salting + auto in-memory fallback for local environments.</span>
                  </li>
                </ul>
              </div>

              {/* RECRUITER 1-CLICK TEST LOGIN */}
              <div
                style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <Zap size={15} color="var(--color-accent)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Recruiter Quick-Test Switcher
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickLogin('recruiter')}
                    icon={<Briefcase size={13} />}
                  >
                    Recruiter
                  </Button>
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => handleQuickLogin('seeker')}
                    icon={<Sparkles size={13} />}
                  >
                    Seeker
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickLogin('admin')}
                    icon={<Shield size={13} />}
                  >
                    Admin
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
                  Back to Platform
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperShowcase;
