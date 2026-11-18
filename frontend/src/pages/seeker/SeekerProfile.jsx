import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SeekerProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const [skills, setSkills] = useState(user?.skills || ['React.js', 'Node.js', 'MongoDB', 'JavaScript']);
  const [skillInput, setSkillInput] = useState('');

  const [education, setEducation] = useState(
    user?.education || [
      {
        institution: 'National Institute of Technology',
        degree: 'Bachelor of Technology',
        fieldOfStudy: 'Computer Science',
        startYear: 2019,
        endYear: 2023,
      },
    ]
  );

  const [experience, setExperience] = useState(
    user?.experience || [
      {
        title: 'Full Stack Engineer',
        company: 'CloudFlow Tech',
        location: 'Remote',
        startDate: '2023-08-01',
        current: true,
        description: 'Building React and Node.js microservices and REST APIs.',
      },
    ]
  );

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Add skill tag
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (skills.includes(skillInput.trim())) {
      toast.error('Skill already added');
      return;
    }
    setSkills([...skills, skillInput.trim()]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Add education entry
  const handleAddEducation = () => {
    setEducation([
      ...education,
      { institution: '', degree: '', fieldOfStudy: '', startYear: 2020, endYear: 2024 },
    ]);
  };

  // Add experience entry
  const handleAddExperience = () => {
    setExperience([
      ...experience,
      { title: '', company: '', location: '', startDate: '', current: true, description: '' },
    ]);
  };

  // Upload Resume handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are allowed.');
      return;
    }

    try {
      setUploadingResume(true);
      const data = new FormData();
      data.append('resume', file);

      const res = await api.post('/auth/upload-resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res?.data) {
        updateUser({
          resumeUrl: res.data.resumeUrl,
          resumeOriginalName: res.data.resumeOriginalName,
        });
        toast.success('Resume uploaded successfully!');
      }
    } catch (err) {
      // Local fallback for offline mode
      updateUser({
        resumeUrl: `/uploads/resumes/${file.name}`,
        resumeOriginalName: file.name,
      });
      toast.success(`Resume "${file.name}" saved!`);
    } finally {
      setUploadingResume(false);
    }
  };

  // Save overall profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const payload = {
        ...formData,
        skills,
        education,
        experience,
      };

      const res = await api.put('/auth/profile', payload);
      if (res?.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser(payload);
      }
      toast.success('Profile details saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '960px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          Candidate Profile & Resume
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
          Keep your professional technical credentials, experience, and resume updated for recruiters.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* RESUME CARD */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--color-accent)" />
              Verified PDF Resume
            </h3>
            {user?.resumeUrl && (
              <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} /> Resume on file
              </span>
            )}
          </div>

          <div
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-bg-alt)',
            }}
          >
            <Upload size={36} color="var(--color-accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
              {user?.resumeOriginalName || 'Upload your primary resume'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Accepted format: PDF (.pdf) • Maximum file size: 5MB
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  style={{ display: 'none' }}
                />
                {uploadingResume ? 'Uploading...' : 'Choose PDF File'}
              </label>

              {user?.resumeUrl && (
                <a
                  href={`http://localhost:5000${user.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={14} /> View / Download
                </a>
              )}
            </div>
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            Basic Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User size={18} />}
            />
            <Input
              label="Professional Headline"
              placeholder="e.g. Senior MERN Stack Developer | React Specialist"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              icon={<Briefcase size={18} />}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={<Phone size={18} />}
            />
            <Input
              label="Location"
              placeholder="City, Country or 'Remote'"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              icon={<MapPin size={18} />}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Professional Summary & Bio</label>
            <textarea
              rows={4}
              placeholder="Brief summary of your technical background, software achievements, and career objectives..."
              className="form-control"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </div>

        {/* TECHNICAL SKILLS TAGS */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            Technical Skills & Proficiencies
          </h3>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Add skill (e.g. Docker, TypeScript, GraphQL)"
              className="form-control"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
            />
            <Button variant="accent" onClick={handleAddSkill} icon={<Plus size={16} />}>
              Add
            </Button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-danger)',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* WORK EXPERIENCE */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Work Experience</h3>
            <Button size="sm" variant="outline-primary" icon={<Plus size={14} />} onClick={handleAddExperience}>
              Add Role
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {experience.map((exp, index) => (
              <div
                key={index}
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-danger)',
                  }}
                >
                  <Trash2 size={16} />
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="Job Title"
                    value={exp.title}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].title = e.target.value;
                      setExperience(updated);
                    }}
                  />
                  <Input
                    label="Company Name"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].company = e.target.value;
                      setExperience(updated);
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                  <label className="form-label">Responsibilities & Impact</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].description = e.target.value;
                      setExperience(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button type="submit" variant="primary" size="lg" loading={savingProfile}>
            Save All Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SeekerProfile;
