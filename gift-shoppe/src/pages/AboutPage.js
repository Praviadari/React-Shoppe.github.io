import React from 'react';

function AboutPage() {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-accent)', marginBottom: '2rem' }}>Our Story</h1>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        GiftShoppe was founded on the idea that gifting should be an experience, not just a transaction.
        We travel the globe to source the finest materials and partner with master artisans to create
        bespoke, premium items that carry deep emotional meaning.
      </p>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
        Whether it&apos;s a personalized 3D photo frame or a classic gold-plated watch, every piece in our
        collection is carefully curated to ensure your loved ones feel truly special. Welcome to the global gifting experience.
      </p>
    </div>
  );
}

export default AboutPage;
