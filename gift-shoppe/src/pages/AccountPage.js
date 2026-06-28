import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { useAuth } from '../context/AuthContext';
import { getOrdersForUser } from '../services/orderService';
import { updateUserProfile } from '../services/userService';
import { formatPrice } from '../utils/formatPrice';
import './AccountPage.css';

const EMPTY_PROFILE = {
  displayName: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
};

function AccountPage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || user?.displayName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        pincode: profile.pincode || '',
      });
    }
  }, [profile, user]);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      if (!user) return;
      setOrdersLoading(true);
      const userOrders = await getOrdersForUser(user.uid);
      if (!cancelled) {
        setOrders(userOrders);
        setOrdersLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setMessage('');
    setError('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateUserProfile(user.uid, form);
      await refreshProfile();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError('Could not update profile. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="account-page">
      <SeoHead title="Your account" path="/account" noindex />
      <h1>Your account</h1>
      <p className="account-page__greeting">
        Signed in as {user?.email}
      </p>

      <div className="account-page__layout">
        <section className="account-card">
          <h2>Delivery details</h2>
          <form className="account-profile-form" onSubmit={handleSaveProfile}>
            <label>
              Full name
              <input type="text" value={form.displayName} onChange={updateField('displayName')} required />
            </label>
            <label>
              Phone
              <input type="tel" value={form.phone} onChange={updateField('phone')} />
            </label>
            <label>
              Address
              <textarea value={form.address} onChange={updateField('address')} rows={3} />
            </label>
            <div className="account-profile-form__row">
              <label>
                City
                <input type="text" value={form.city} onChange={updateField('city')} />
              </label>
              <label>
                PIN code
                <input type="text" value={form.pincode} onChange={updateField('pincode')} />
              </label>
            </div>

            {message && <p className="account-profile-form__message account-profile-form__message--success">{message}</p>}
            {error && <p className="account-profile-form__message account-profile-form__message--error" role="alert">{error}</p>}

            <div className="account-profile-form__actions">
              <button type="submit" className="account-btn" disabled={saving}>
                {saving ? 'Saving…' : 'Save details'}
              </button>
              <button type="button" className="account-btn account-btn--secondary" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          </form>
        </section>

        <section className="account-card">
          <h2>Order history</h2>
          {ordersLoading ? (
            <p className="account-empty">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="account-empty">You have not placed any orders yet. <Link to="/shop">Start shopping</Link></p>
          ) : (
            <ul className="account-orders">
              {orders.map((order) => (
                <li key={order.id} className="account-order">
                  <div>
                    <strong>{order.id}</strong>
                    <p className="account-order__meta">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items · {order.status}
                    </p>
                  </div>
                  <div className="account-order__total">
                    {formatPrice(order.total)}
                    <div>
                      <Link to={`/order/${order.id}`}>View</Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default AccountPage;
