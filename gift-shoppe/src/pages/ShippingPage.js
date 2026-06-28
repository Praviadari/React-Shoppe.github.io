import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';

function ShippingPage() {
  return (
    <div className="content-page">
      <SeoHead
        title="Shipping & Returns"
        description="GiftShoppe shipping rates, delivery timelines, international orders, and return policy."
        path="/shipping"
      />
      <p className="content-page__eyebrow">Delivery</p>
      <h1>Shipping & returns</h1>
      <p className="content-page__lead">
        We ship worldwide with tracked carriers and complimentary gift wrapping on every order.
      </p>

      <section>
        <h2>Shipping rates</h2>
        <ul>
          <li>Free standard shipping on orders ₹2,000 and above within India.</li>
          <li>₹99 flat rate for orders below ₹2,000.</li>
          <li>International rates calculated at checkout based on destination.</li>
        </ul>
      </section>

      <section>
        <h2>Delivery timelines</h2>
        <ul>
          <li>India metro cities: 3–5 business days.</li>
          <li>India non-metro: 5–7 business days.</li>
          <li>International: 7–14 business days.</li>
          <li>Scheduled delivery: choose a preferred date at checkout (2–90 days ahead).</li>
        </ul>
      </section>

      <section>
        <h2>Returns & exchanges</h2>
        <p>
          Non-personalized items in original packaging may be returned within 14 days of delivery.
          Custom engraved or bespoke builds are final sale unless the item arrives damaged.
          Contact our support team to initiate a return — we will provide a prepaid label where applicable.
        </p>
      </section>

      <div className="content-page__actions">
        <Link to="/track-order" className="hero-button">Track an order</Link>
        <Link to="/faq" className="hero-button" style={{
          backgroundColor: 'transparent',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
        }}>
          Read FAQ
        </Link>
      </div>
    </div>
  );
}

export default ShippingPage;
