import React, { useState } from 'react';
import { getAuthErrorMessage } from '../utils/authErrors';

function GoogleSignInButton({ onSignIn, disabled }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    setError('');
    setSubmitting(true);
    try {
      await onSignIn();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {error && <p className="auth-form__error" role="alert">{error}</p>}
      <button
        type="button"
        className="auth-form__submit auth-form__google"
        onClick={handleClick}
        disabled={disabled || submitting}
      >
        {submitting ? 'Connecting…' : 'Continue with Google'}
      </button>
    </>
  );
}

export default GoogleSignInButton;
