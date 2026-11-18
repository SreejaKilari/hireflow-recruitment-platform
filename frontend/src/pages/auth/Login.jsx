import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Briefcase, Zap, Shield, Users, UserCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const executeLogin = async (credentials) => {
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', credentials);
      if (res?.data?.token && res?.data?.user) {
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);

        if (from) {
          navigate(from, { replace: true });
        } else if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (res.data.user.role === 'recruiter') {
          navigate('/recruiter/dashboard', { replace: true });
        } else {
          navigate('/seeker/dashboard', { replace: true });
        }
      }
    } catch (err) {
      const msg = err.message || 'Invalid email or password. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(formData);
  };

  // 1-Click Quick Demo Login for Reviewers & Recruiters
  const handleQuickDemo = (role) => {
    let creds = {};
    if (role === 'recruiter') {
      creds = { email: 'recruiter@stripe.com', password: 'Password123!' };
    } else if (role === 'admin') {
      creds = { email: 'admin@hireflow.dev', password: 'AdminPassword123!' };
    } else {
      creds = { email: 'seeker@hireflow.dev', password: 'Password123!' };
    }

    setFormData(creds);
    executeLogin(creds);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--navbar-height) - 150px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <Briefcase size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Log in to manage your career or recruitment pipeline.
          </p>
        </div>

        {/* ⚡ 1-CLICK DEMO TESTER BUTTONS (For recruiters/interviewers) */}
        <div
          style={{
            backgroundColor: 'var(--color-primary-light)',
            border: '1px solid var(--color-accent-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
            <Zap size={16} color="var(--color-accent)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              1-Click Demo Accounts (For Recruiters)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('recruiter')}
              style={{
                padding: '0.45rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <Briefcase size={12} /> Recruiter
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('seeker')}
              style={{
                padding: '0.45rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <UserCheck size={12} /> Seeker
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('admin')}
              style={{
                padding: '0.45rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <Shield size={12} /> Admin
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            <p style={{ fontWeight: 600 }}>{error}</p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Want to create a new profile?{' '}
              <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'underline' }}>
                Register here
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Email Address"
            type="email"
            id="email"
            required
            placeholder="you@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail size={18} />}
          />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label htmlFor="password" className="form-label" style={{ marginBottom: 0 }}>
                Password <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              id="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={<Lock size={18} />}
              style={{ marginBottom: 0 }}
            />
          </div>

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In to HireFlow
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
