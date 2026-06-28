import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';

const COMMITMENTS = [
  {
    title: 'Responsible sourcing',
    body: 'We partner with artisans and suppliers who meet our standards for fair labour and material quality.',
  },
  {
    title: 'Minimal packaging waste',
    body: 'Gift boxes use recycled paper stock and soy-based inks. We avoid plastic filler wherever possible.',
  },
  {
    title: 'Carbon-conscious shipping',
    body: 'We consolidate international shipments and offer carbon-neutral delivery options in select markets.',
  },
  {
    title: 'Product longevity',
    body: 'Our catalog favours durable keepsakes over disposable trends — gifts meant to last for years.',
  },
];

function SustainabilityPage() {
  return (
    <div className="content-page">
      <SeoHead
        title="Sustainability"
        description="GiftShoppe sustainability commitments — responsible sourcing, packaging, and shipping."
        path="/sustainability"
      />
      <p className="content-page__eyebrow">Our planet</p>
      <h1>Sustainability</h1>
      <p className="content-page__lead">
        Luxury gifting and environmental responsibility can coexist. Here is how we are working toward both.
      </p>

      <section aria-label="Sustainability commitments">
        {COMMITMENTS.map((item) => (
          <article key={item.title} className="content-page__faq-item">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <div className="content-page__actions">
        <Link to="/about" className="hero-button">Our values</Link>
        <Link to="/contact" className="hero-button" style={{
          backgroundColor: 'transparent',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
        }}>
          Share feedback
        </Link>
      </div>
    </div>
  );
}

export default SustainabilityPage;
