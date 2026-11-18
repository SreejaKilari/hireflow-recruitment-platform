import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Is HireFlow completely free for Job Seekers?',
      a: 'Yes, 100%! Candidates can create an account, upload their resume, search open roles, and apply to unlimited jobs without any fees or hidden costs.',
    },
    {
      q: 'How does HireFlow verify recruiters and employers?',
      a: 'All recruiter accounts undergo automated domain validation and manual corporate checks before their job postings can be published to candidates.',
    },
    {
      q: 'What format should my uploaded resume be?',
      a: 'We accept standard PDF (.pdf) documents up to 5MB in size for maximum compatibility and ATS parsing reliability.',
    },
    {
      q: 'How do status updates work?',
      a: 'When an employer reviews, shortlists, or updates your application status, you receive an immediate in-app notification and email alert.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Thank you! Your message has been received by our support team.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="app-container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
        <span className="section-badge">Get in Touch</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.5rem' }}>
          We’d Love to Hear From You
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
          Have questions about our enterprise recruitment solutions or platform support? Our team is available 24/7.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', maxWidth: '1000px', margin: '0 auto 4rem auto' }}>
        {/* CONTACT FORM */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Full Name"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Subject"
              required
              placeholder="Question about recruiting or platform..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                required
                rows={4}
                className="form-control"
                placeholder="How can we assist you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <Button type="submit" variant="primary" loading={submitting} icon={<Send size={16} />}>
              Send Inquiry
            </Button>
          </form>
        </div>

        {/* CONTACT INFO & CHANNELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
              Headquarters
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={20} color="var(--color-accent)" />
                <span>500 Howard Street, Suite 400, San Francisco, CA 94105</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={20} color="var(--color-accent)" />
                <span>support@hireflow.dev</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} color="var(--color-accent)" />
                <span>+1 (800) 447-3356</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-accent-subtle)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Enterprise & Custom ATS Integrations
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Looking for dedicated API access, custom webhook triggers, or custom high-volume hiring SLAs? Email our enterprise team directly at <strong>sales@hireflow.dev</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="section-header">
          <span className="section-badge">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="card"
                style={{ padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronUp size={18} color="var(--color-accent)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
                </div>
                {isOpen && (
                  <p style={{ marginTop: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Contact;
