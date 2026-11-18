import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Building2, Briefcase, Globe } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'job_seeker';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Recruiter-specific fields:
    companyName: '',
    companyWebsite: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'recruiter' && !formData.companyName.trim()) {
      setError('Company Name is required for Recruiter registration.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        ...(role === 'recruiter' && {
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite,
        }),
      };

      const res = await api.post('/auth/register', payload);
      if (res?.data?.token && res?.data?.user) {
        login(res.data.user, res.data.token);
        toast.success(`Account created! Welcome to HireFlow, ${res.data.user.name}.`);

        if (role === 'recruiter') {
          navigate('/recruiter/dashboard', { replace: true });
        } else {
          navigate('/seeker/dashboard', { replace: true });
        }
      }
    } catch (err) {
      const msg = err.message || 'Registration failed. Please verify your details.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
          maxWidth: '500px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Join HireFlow
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Create an account to start your journey.
          </p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--color-bg-alt)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('job_seeker')}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: role === 'job_seeker' ? '#ffffff' : 'transparent',
              color: role === 'job_seeker' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: role === 'job_seeker' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <User size={16} />
            Job Seeker
          </button>

          <button
            type="button"
            onClick={() => setRole('recruiter')}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: role === 'recruiter' ? '#ffffff' : 'transparent',
              color: role === 'recruiter' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: role === 'recruiter' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Building2 size={16} />
            Recruiter / Employer
          </button>
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
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <Input
            label="Full Name"
            required
            placeholder={role === 'job_seeker' ? 'Jane Doe' : 'Alex Rivers'}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={<User size={18} />}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder={role === 'job_seeker' ? 'jane@example.com' : 'alex@company.com'}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail size={18} />}
          />

          {role === 'recruiter' && (
            <>
              <Input
                label="Company Name"
                required
                placeholder="Acme Technologies"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                icon={<Building2 size={18} />}
              />
              <Input
                label="Company Website"
                placeholder="https://acme.com"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                icon={<Globe size={18} />}
              />
            </>
          )}

          <Input
            label="Password (min 6 characters)"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock size={18} />}
          />

          <Input
            label="Confirm Password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            icon={<Lock size={18} />}
          />

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Create {role === 'job_seeker' ? 'Job Seeker' : 'Recruiter'} Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
