import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, PlusCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { JOB_CATEGORIES } from '../../utils/sampleData';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    jobType: 'full-time',
    workplaceType: 'remote',
    experienceLevel: 'mid',
    location: '',
    minSalary: '',
    maxSalary: '',
    currency: 'USD',
    openings: 1,
    deadline: '',
    description: '',
    responsibilities: '',
    skillsRequired: '',
    qualifications: '',
    status: 'active',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (!formData.skillsRequired.trim()) {
      toast.error('Please specify required technical skills.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        minSalary: Number(formData.minSalary) || 0,
        maxSalary: Number(formData.maxSalary) || 0,
        openings: Number(formData.openings) || 1,
        skillsRequired: formData.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
        qualifications: formData.qualifications.split('\n').map((q) => q.trim()).filter(Boolean),
      };

      await api.post('/jobs', payload);
      toast.success('Job requisition published successfully!');
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to create job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '840px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Post a New Job Requisition
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Provide complete role criteria to attract targeted, qualified candidates.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="Job Title"
            required
            placeholder="e.g. Senior Full Stack Engineer (MERN)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Select
              label="Specialization / Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={JOB_CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
            />

            <Select
              label="Employment Type"
              required
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              options={[
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'remote', label: 'Remote' },
                { value: 'internship', label: 'Internship' },
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Select
              label="Workplace Arrangement"
              required
              value={formData.workplaceType}
              onChange={(e) => setFormData({ ...formData, workplaceType: e.target.value })}
              options={[
                { value: 'remote', label: 'Fully Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'on-site', label: 'On-site' },
              ]}
            />

            <Select
              label="Experience Level"
              required
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              options={[
                { value: 'entry', label: 'Entry Level (0-2 years)' },
                { value: 'mid', label: 'Mid Level (2-5 years)' },
                { value: 'senior', label: 'Senior Level (5+ years)' },
                { value: 'lead', label: 'Lead / Principal' },
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Input
              label="Location"
              required
              placeholder="e.g. San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input
                label="Min Salary ($/yr)"
                type="number"
                placeholder="100000"
                value={formData.minSalary}
                onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
              />
              <Input
                label="Max Salary ($/yr)"
                type="number"
                placeholder="150000"
                value={formData.maxSalary}
                onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Input
              label="Number of Openings"
              type="number"
              min="1"
              value={formData.openings}
              onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
            />

            <Input
              label="Application Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Role Description <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <textarea
              required
              rows={5}
              className="form-control"
              placeholder="Provide a comprehensive summary of the team, products, and tech stack..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Responsibilities (one per line)</label>
            <textarea
              rows={4}
              className="form-control"
              placeholder="Design and develop scalable microservices&#10;Implement responsive UI components&#10;Maintain 99.99% service uptime"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            />
          </div>

          <Input
            label="Required Skills (comma separated)"
            required
            placeholder="React.js, Node.js, MongoDB, Express.js, TypeScript"
            value={formData.skillsRequired}
            onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
            helperText="Separate multiple skills with commas."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => navigate('/recruiter/dashboard')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting} icon={<PlusCircle size={16} />}>
              Publish Job Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
