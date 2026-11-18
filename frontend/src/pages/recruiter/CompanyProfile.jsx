import React, { useState } from 'react';
import { Building2, Globe, MapPin, Upload, Briefcase, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CompanyProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.company?.name || '',
    industry: user?.company?.industry || 'Technology & Software',
    location: user?.company?.location || '',
    website: user?.company?.website || '',
    employeeCount: user?.company?.employeeCount || '50-250',
    description: user?.company?.description || '',
  });

  const [logoUrl, setLogoUrl] = useState(user?.company?.logoUrl || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const data = new FormData();
      data.append('logo', file);

      const res = await api.post('/companies/logo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res?.data?.logoUrl) {
        setLogoUrl(res.data.logoUrl);
        updateUser({
          company: { ...user.company, logoUrl: res.data.logoUrl },
        });
        toast.success('Company logo updated!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/companies/profile', formData);
      if (res?.data) {
        updateUser({
          company: res.data,
        });
      }
      toast.success('Company profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save company profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Company Profile & Branding
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
          This information is displayed publicly on your job listings and company page.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {/* LOGO UPLOAD SECTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-md)',
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
                src={logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`}
                alt="Company Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Building2 size={36} color="var(--color-primary)" />
            )}
          </div>

          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Company Logo
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              PNG, JPG, or WebP. Square aspect ratio recommended (max 2MB).
            </p>
            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              {uploadingLogo ? 'Uploading...' : 'Upload New Logo'}
            </label>
          </div>
        </div>

        {/* PROFILE FIELDS */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Company Legal Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={<Building2 size={18} />}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Input
              label="Corporate Website"
              placeholder="https://company.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              icon={<Globe size={18} />}
            />
            <Input
              label="Headquarters Location"
              placeholder="San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              icon={<MapPin size={18} />}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Input
              label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
            <Select
              label="Company Size"
              value={formData.employeeCount}
              onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
              options={[
                { value: '1-10', label: '1 - 10 employees (Early Startup)' },
                { value: '11-50', label: '11 - 50 employees' },
                { value: '51-200', label: '51 - 200 employees (Scaleup)' },
                { value: '201-1000', label: '201 - 1,000 employees' },
                { value: '1000+', label: '1,000+ employees (Enterprise)' },
              ]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">About the Company / Mission</label>
            <textarea
              rows={4}
              className="form-control"
              placeholder="Describe your company culture, technology stack, mission, and benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="submit" variant="primary" loading={saving}>
              Save Company Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
