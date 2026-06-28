import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/search': 'Search',
  '/support': '24/7 Support',
  '/track-order': 'Track Order',
  '/track': 'Track Order',
  '/faq': 'FAQ',
  '/shipping': 'Shipping & Returns',
  '/contact': 'Contact Us',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/careers': 'Careers',
  '/press': 'Press',
  '/sustainability': 'Sustainability',
};

function ComingSoonPage() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'This page';

  return (
    <div style={{
      padding: '8rem 2rem',
      textAlign: 'center',
      maxWidth: '560px',
      margin: '0 auto',
    }}>
      <p style={{
        color: 'var(--color-text-secondary)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
        marginBottom: '1rem',
      }}>
        Coming soon
      </p>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 300,
        color: 'var(--color-accent)',
        marginBottom: '1rem',
      }}>
        {title}
      </h1>
      <p style={{
        color: 'var(--color-text-secondary)',
        lineHeight: 1.7,
        marginBottom: '2rem',
      }}>
        We are building this experience as part of our world-class GiftShoppe rollout.
        Browse the shop or design a custom gift in the meantime.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/shop" className="hero-button" style={{ textDecoration: 'none' }}>Shop now</Link>
        <Link to="/build" className="hero-button" style={{
          textDecoration: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
        }}>
          Custom gifts
        </Link>
      </div>
    </div>
  );
}

export default ComingSoonPage;
