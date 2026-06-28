import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { useAuth } from '../context/AuthContext';
import { submitConciergeRequest } from '../services/inquiryService';
import '../styles/premium.css';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  occasion: '',
  budget: '',
  recipient: '',
  preferences: '',
};

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Corporate thank-you',
  'New baby',
  'Just because',
  'Other',
];

function ConciergePage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    fullName: profile?.displayName || user?.displayName || '',
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
    if (!form.fullName.trim()) next.fullName = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Valid email is required';
    }
    if (!form.occasion) next.occasion = 'Please select an occasion';
    if (!form.preferences.trim()) next.preferences = 'Tell us what you are looking for';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const inquiry = await submitConciergeRequest(
        {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          occasion: form.occasion,
          budget: form.budget.trim(),
          recipient: form.recipient.trim(),
          preferences: form.preferences.trim(),
        },
        user?.uid || null
      );
      setSubmittedId(inquiry.id);
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error('Concierge request failed', error);
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="premium-page">
        <SeoHead
          title="Gift Concierge"
          description="Personalized gift recommendations from GiftShoppe's concierge team."
          path="/concierge"
        />
        <p className="premium-page__eyebrow">Request received</p>
        <h1>We are curating your gift</h1>
        <p className="premium-form__success" role="status">
          Reference <strong>{submittedId}</strong>. Our concierge team will email you within one business day
          with tailored recommendations.
        </p>
        <Link to="/shop" className="hero-button" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <SeoHead
        title="Gift Concierge"
        description="Tell us about the recipient and occasion. Our gifting experts will curate a shortlist just for you."
        path="/concierge"
      />
      <p className="premium-page__eyebrow">Personal service</p>
      <h1>Gift concierge</h1>
      <p className="premium-page__intro">
        Not sure what to give? Share a few details and our team will hand-pick gifts from our catalog —
        or design a bespoke build — matched to your budget and occasion.
      </p>

      <form className="premium-form" onSubmit={handleSubmit} noValidate>
        {errors.form && <p className="premium-form__error" role="alert">{errors.form}</p>}

        <label>
          Your name
          <input type="text" value={form.fullName} onChange={updateField('fullName')} required />
          {errors.fullName && <span className="premium-form__error">{errors.fullName}</span>}
        </label>

        <div className="premium-form__row">
          <label>
            Email
            <input type="email" value={form.email} onChange={updateField('email')} required />
            {errors.email && <span className="premium-form__error">{errors.email}</span>}
          </label>
          <label>
            Phone (optional)
            <input type="tel" value={form.phone} onChange={updateField('phone')} />
          </label>
        </div>

        <div className="premium-form__row">
          <label>
            Occasion
            <select value={form.occasion} onChange={updateField('occasion')} required>
              <option value="">Select occasion</option>
              {OCCASIONS.map((occasion) => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
            {errors.occasion && <span className="premium-form__error">{errors.occasion}</span>}
          </label>
          <label>
            Budget (optional)
            <input type="text" value={form.budget} onChange={updateField('budget')} placeholder="e.g. ₹2,000 – ₹5,000" />
          </label>
        </div>

        <label>
          Recipient (optional)
          <input type="text" value={form.recipient} onChange={updateField('recipient')} placeholder="Who is the gift for?" />
        </label>

        <label>
          What are you looking for?
          <textarea
            value={form.preferences}
            onChange={updateField('preferences')}
            rows={4}
            placeholder="Interests, style, dietary needs, delivery city…"
            required
          />
          {errors.preferences && <span className="premium-form__error">{errors.preferences}</span>}
        </label>

        <button type="submit" className="premium-form__submit" disabled={submitting}>
          {submitting ? 'Sending request…' : 'Request recommendations'}
        </button>
      </form>
    </div>
  );
}

export default ConciergePage;
