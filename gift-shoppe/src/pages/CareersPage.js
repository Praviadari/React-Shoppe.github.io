import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';

const OPEN_ROLES = [
  {
    title: 'E-commerce Operations Associate',
    location: 'Bengaluru · Hybrid',
    type: 'Full-time',
  },
  {
    title: 'Gift Concierge Specialist',
    location: 'Remote · India',
    type: 'Full-time',
  },
  {
    title: 'Product Photographer',
    location: 'Mumbai · On-site',
    type: 'Contract',
  },
];

function CareersPage() {
  return (
    <div className="content-page">
      <SeoHead
        title="Careers"
        description="Join GiftShoppe — build premium gifting experiences with a passionate team."
        path="/careers"
      />
      <p className="content-page__eyebrow">Join us</p>
      <h1>Careers at GiftShoppe</h1>
      <p className="content-page__lead">
        We are a small team obsessed with craftsmanship, thoughtful design, and making every gift feel personal.
      </p>

      <section>
        <h2>Open roles</h2>
        <ul>
          {OPEN_ROLES.map((role) => (
            <li key={role.title}>
              <strong>{role.title}</strong> — {role.location} · {role.type}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Don&apos;t see a fit? Email <a href="mailto:careers@giftshoppe.com">careers@giftshoppe.com</a> with your portfolio.
        </p>
      </section>

      <div className="content-page__actions">
        <Link to="/about" className="hero-button">Our story</Link>
        <Link to="/contact" className="hero-button" style={{
          backgroundColor: 'transparent',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
        }}>
          Contact us
        </Link>
      </div>
    </div>
  );
}

export default CareersPage;
