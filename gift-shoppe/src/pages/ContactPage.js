import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { useAuth } from '../context/AuthContext';
import { submitContactMessage } from '../services/inquiryService';
import '../styles/content-page.css';
import '../styles/premium.css';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

function ContactPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    fullName: profile?.displayName || user?.displayName || '',
    email: profile?.email || user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Valid email is required';
    }
    if (!form.subject.trim()) next.subject = 'Subject is required';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const inquiry = await submitContactMessage(
        {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
        user?.uid || null
      );
      setSubmittedId(inquiry.id);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error('Contact form failed', error);
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="content-page">
        <SeoHead title="Contact Us" path="/contact" />
        <p className="content-page__eyebrow">Message sent</p>
        <h1>We will reply soon</h1>
        <p className="premium-form__success" role="status">
          Reference <strong>{submittedId}</strong>. Our support team typically responds within one business day.
        </p>
        <Link to="/faq" className="hero-button" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
          Browse FAQ
        </Link>
      </div>
    );
  }

  return (
    <div className="content-page">
      <SeoHead
        title="Contact Us"
        description="Get in touch with GiftShoppe support for orders, returns, and gifting advice."
        path="/contact"
      />
      <p className="content-page__eyebrow">Support</p>
      <h1>Contact us</h1>
      <p className="content-page__lead">
        Questions about an order, a return, or a bespoke gift? Send us a message and we will get back to you promptly.
      </p>

      <form className="premium-form" onSubmit={handleSubmit} noValidate>
        {errors.form && <p className="premium-form__error" role="alert">{errors.form}</p>}

        <label>
          Your name
          <input type="text" value={form.fullName} onChange={updateField('fullName')} required />
          {errors.fullName && <span className="premium-form__error">{errors.fullName}</span>}
        </label>

        <label>
          Email
          <input type="email" value={form.email} onChange={updateField('email')} required />
          {errors.email && <span className="premium-form__error">{errors.email}</span>}
        </label>

        <label>
          Subject
          <input type="text" value={form.subject} onChange={updateField('subject')} required />
          {errors.subject && <span className="premium-form__error">{errors.subject}</span>}
        </label>

        <label>
          Message
          <textarea value={form.message} onChange={updateField('message')} rows={5} required />
          {errors.message && <span className="premium-form__error">{errors.message}</span>}
        </label>

        <button type="submit" className="premium-form__submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}

export default ContactPage;
