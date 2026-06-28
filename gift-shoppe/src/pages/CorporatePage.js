import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { useAuth } from '../context/AuthContext';
import { submitCorporateInquiry } from '../services/inquiryService';
import '../styles/premium.css';

const EMPTY_FORM = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  quantity: '',
  budget: '',
  deliveryDate: '',
  message: '',
};

function CorporatePage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    contactName: profile?.displayName || user?.displayName || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
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
    if (!form.companyName.trim()) next.companyName = 'Company name is required';
    if (!form.contactName.trim()) next.contactName = 'Contact name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Valid email is required';
    }
    if (!form.quantity.trim()) next.quantity = 'Estimated quantity is required';
    if (!form.message.trim()) next.message = 'Tell us about your gifting program';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const inquiry = await submitCorporateInquiry(
        {
          companyName: form.companyName.trim(),
          contactName: form.contactName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          quantity: form.quantity.trim(),
          budget: form.budget.trim(),
          deliveryDate: form.deliveryDate.trim(),
          message: form.message.trim(),
        },
        user?.uid || null
      );
      setSubmittedId(inquiry.id);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error('Corporate inquiry failed', error);
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="premium-page">
        <SeoHead
          title="Corporate Gifting"
          description="Bulk and branded corporate gifts from GiftShoppe."
          path="/corporate"
        />
        <p className="premium-page__eyebrow">Inquiry received</p>
        <h1>We will be in touch</h1>
        <p className="premium-form__success" role="status">
          Reference <strong>{submittedId}</strong>. Our corporate team will contact you within two business days
          with pricing and fulfillment options.
        </p>
        <Link to="/collections" className="hero-button" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
          View collections
        </Link>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <SeoHead
        title="Corporate Gifting"
        description="Bulk gifting, branded packaging, and scheduled delivery for teams and clients."
        path="/corporate"
      />
      <p className="premium-page__eyebrow">For teams & clients</p>
      <h1>Corporate gifting</h1>
      <p className="premium-page__intro">
        Reward employees, thank clients, or celebrate milestones with curated gift boxes at scale.
        We handle personalization, invoicing, and multi-address delivery.
      </p>

      <form className="premium-form" onSubmit={handleSubmit} noValidate>
        {errors.form && <p className="premium-form__error" role="alert">{errors.form}</p>}

        <label>
          Company name
          <input type="text" value={form.companyName} onChange={updateField('companyName')} required />
          {errors.companyName && <span className="premium-form__error">{errors.companyName}</span>}
        </label>

        <div className="premium-form__row">
          <label>
            Contact name
            <input type="text" value={form.contactName} onChange={updateField('contactName')} required />
            {errors.contactName && <span className="premium-form__error">{errors.contactName}</span>}
          </label>
          <label>
            Work email
            <input type="email" value={form.email} onChange={updateField('email')} required />
            {errors.email && <span className="premium-form__error">{errors.email}</span>}
          </label>
        </div>

        <div className="premium-form__row">
          <label>
            Phone (optional)
            <input type="tel" value={form.phone} onChange={updateField('phone')} />
          </label>
          <label>
            Estimated quantity
            <input type="text" value={form.quantity} onChange={updateField('quantity')} placeholder="e.g. 50 gifts" required />
            {errors.quantity && <span className="premium-form__error">{errors.quantity}</span>}
          </label>
        </div>

        <div className="premium-form__row">
          <label>
            Budget per gift (optional)
            <input type="text" value={form.budget} onChange={updateField('budget')} placeholder="e.g. ₹1,500 each" />
          </label>
          <label>
            Target delivery (optional)
            <input type="date" value={form.deliveryDate} onChange={updateField('deliveryDate')} />
          </label>
        </div>

        <label>
          Project details
          <textarea
            value={form.message}
            onChange={updateField('message')}
            rows={4}
            placeholder="Occasion, branding needs, delivery locations…"
            required
          />
          {errors.message && <span className="premium-form__error">{errors.message}</span>}
        </label>

        <button type="submit" className="premium-form__submit" disabled={submitting}>
          {submitting ? 'Sending inquiry…' : 'Request a proposal'}
        </button>
      </form>
    </div>
  );
}

export default CorporatePage;
