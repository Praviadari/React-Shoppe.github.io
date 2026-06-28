import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';
import '../styles/auth.css';

function LoginPage() {
  const { signIn, isAuthAvailable, user } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signIn({ email: email.trim(), password });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <SeoHead title="Sign in" path="/login" noindex />
      <h1>Sign in</h1>
      <p className="auth-page__subtitle">Access your orders, saved addresses, and wishlist.</p>

      {!isAuthAvailable && (
        <p className="auth-page__notice" role="status">
          Firebase Auth is not configured. Add your Firebase keys to <code>.env.local</code> to enable sign-in.
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <p className="auth-form__error" role="alert">{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={!isAuthAvailable}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={!isAuthAvailable}
          />
        </label>

        <button type="submit" className="auth-form__submit" disabled={submitting || !isAuthAvailable}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-page__footer">
        New to GiftShoppe? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default LoginPage;
