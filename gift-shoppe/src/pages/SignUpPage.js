import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { getAuthErrorMessage } from '../utils/authErrors';
import '../styles/auth.css';

function SignUpPage() {
  const { signUp, signInWithGoogle, isAuthAvailable, user } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signUp({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <SeoHead title="Create account" path="/signup" noindex />
      <h1>Create account</h1>
      <p className="auth-page__subtitle">Join GiftShoppe for faster checkout and order tracking.</p>

      {!isAuthAvailable && (
        <p className="auth-page__notice" role="status">
          Firebase Auth is not configured. Add your Firebase keys to <code>.env.local</code> to create an account.
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <p className="auth-form__error" role="alert">{error}</p>}

        <label>
          Full name
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            required
            disabled={!isAuthAvailable}
          />
        </label>

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
            autoComplete="new-password"
            minLength={6}
            required
            disabled={!isAuthAvailable}
          />
        </label>

        <button type="submit" className="auth-form__submit" disabled={submitting || !isAuthAvailable}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      {isAuthAvailable && (
        <>
          <p className="auth-divider">or</p>
          <GoogleSignInButton onSignIn={signInWithGoogle} disabled={!isAuthAvailable} />
        </>
      )}

      <p className="auth-page__footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default SignUpPage;
