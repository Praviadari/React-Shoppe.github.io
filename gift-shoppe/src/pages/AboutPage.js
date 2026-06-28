import React from 'react';
import SeoHead from '../components/seo/SeoHead';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      <SeoHead
        title="Our Story"
        description="Learn how GiftShoppe curates premium global gifts — partnering with artisans to craft meaningful photo frames, watches, and bespoke keepsakes."
        path="/about"
      />
      <h1>Our Story</h1>
      <p className="about-page__lead">
        GiftShoppe was founded on the idea that gifting should be an experience, not just a transaction.
        We travel the globe to source the finest materials and partner with master artisans to create
        bespoke, premium items that carry deep emotional meaning.
      </p>
      <p>
        Whether it&apos;s a personalized 3D photo frame or a classic gold-plated watch, every piece in our
        collection is carefully curated to ensure your loved ones feel truly special. Welcome to the global gifting experience.
      </p>
      <section className="about-page__values" aria-label="Our values">
        <article>
          <h2>Curated with intention</h2>
          <p>Every product is selected for craftsmanship, longevity, and the story it helps you tell.</p>
        </article>
        <article>
          <h2>Bespoke by design</h2>
          <p>Our custom gift builder lets you personalize materials, engraving, and typography in minutes.</p>
        </article>
        <article>
          <h2>Delivered worldwide</h2>
          <p>From India to over 150 countries, we package each order with care and complimentary gift wrapping.</p>
        </article>
      </section>
    </div>
  );
}

export default AboutPage;
