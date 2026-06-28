import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{
      padding: '8rem 2rem',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <p style={{
        color: 'var(--color-text-secondary)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
        marginBottom: '1rem',
      }}>
        404
      </p>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 300,
        color: 'var(--color-accent)',
        marginBottom: '1rem',
      }}>
        Page not found
      </h1>
      <p style={{
        color: 'var(--color-text-secondary)',
        lineHeight: 1.7,
        marginBottom: '2rem',
      }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/shop"
        style={{
          display: 'inline-block',
          padding: '0.875rem 2rem',
          backgroundColor: 'var(--color-accent)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 500,
        }}
      >
        Browse the shop
      </Link>
    </div>
  );
}

export default NotFoundPage;
