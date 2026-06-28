import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import './CheckoutPage.css';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  giftMessage: '',
};

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user || profile) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || profile?.displayName || user?.displayName || '',
        email: prev.email || profile?.email || user?.email || '',
        phone: prev.phone || profile?.phone || '',
        address: prev.address || profile?.address || '',
        city: prev.city || profile?.city || '',
        pincode: prev.pincode || profile?.pincode || '',
      }));
    }
  }, [user, profile]);

  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="checkout-page checkout-page--empty">
        <h1>Checkout</h1>
        <p>Your bag is empty.</p>
        <Link to="/shop" className="checkout-page__cta">Continue shopping</Link>
      </div>
    );
  }

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Valid email is required';
    }
    if (!form.phone.trim() || form.phone.trim().length < 10) {
      next.phone = 'Valid phone number is required';
    }
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.pincode.trim() || form.pincode.trim().length < 6) {
      next.pincode = 'Valid PIN code is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await createOrder({
        items,
        customer: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
        },
        giftMessage: form.giftMessage.trim(),
        userId: user?.uid || null,
      });
      clearCart();
      navigate(`/order/${order.id}`, { replace: true });
    } catch (error) {
      console.error('Checkout failed', error);
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <SeoHead title="Checkout" path="/checkout" noindex />
      <h1>Checkout</h1>
      <div className="checkout-page__layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Delivery details</h2>
          {errors.form && <p className="checkout-form__error" role="alert">{errors.form}</p>}

          <label>
            Full name
            <input type="text" value={form.fullName} onChange={updateField('fullName')} required />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={updateField('email')} required />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Phone
            <input type="tel" value={form.phone} onChange={updateField('phone')} required />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>

          <label>
            Address
            <textarea value={form.address} onChange={updateField('address')} rows={3} required />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </label>

          <div className="checkout-form__row">
            <label>
              City
              <input type="text" value={form.city} onChange={updateField('city')} required />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </label>
            <label>
              PIN code
              <input type="text" value={form.pincode} onChange={updateField('pincode')} required />
              {errors.pincode && <span className="field-error">{errors.pincode}</span>}
            </label>
          </div>

          <label>
            Gift message (optional)
            <textarea value={form.giftMessage} onChange={updateField('giftMessage')} rows={2} maxLength={200} />
          </label>

          <button type="submit" className="checkout-form__submit" disabled={submitting}>
            {submitting ? 'Placing order…' : `Place order — ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul className="checkout-summary__items">
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="checkout-summary__line">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          <p className="checkout-summary__line">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </p>
          <p className="checkout-summary__total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </p>
          <p className="checkout-summary__note">
            Payment integration (Razorpay) arrives in a future release. Orders are confirmed locally for now.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
