import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';

const FAQ_ITEMS = [
  {
    question: 'How long does delivery take?',
    answer: 'Standard India delivery is 3–5 business days. International orders typically arrive within 7–14 business days. Scheduled delivery lets you pick a preferred date at checkout.',
  },
  {
    question: 'Can I personalize any product?',
    answer: 'Many items support engraving and custom packaging. Use our Custom Gifts builder for bespoke photo frames, or add a gift message at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Non-personalized items may be returned within 14 days in original condition. Custom engraved pieces are final sale unless damaged in transit.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes — complimentary premium gift wrapping is included on every order. Corporate clients can request branded packaging through our corporate gifting program.',
  },
  {
    question: 'How does the gift concierge work?',
    answer: 'Share the occasion, budget, and recipient details on our concierge page. A specialist curates a shortlist within one business day.',
  },
];

function FaqPage() {
  return (
    <div className="content-page">
      <SeoHead
        title="FAQ"
        description="Frequently asked questions about GiftShoppe delivery, returns, personalization, and concierge services."
        path="/faq"
      />
      <p className="content-page__eyebrow">Support</p>
      <h1>Frequently asked questions</h1>
      <p className="content-page__lead">
        Everything you need to know about ordering, delivery, and our premium gifting services.
      </p>

      <section aria-label="FAQ list">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="content-page__faq-item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <div className="content-page__actions">
        <Link to="/contact" className="hero-button">Contact us</Link>
        <Link to="/shipping" className="hero-button" style={{
          backgroundColor: 'transparent',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
        }}>
          Shipping & returns
        </Link>
      </div>
    </div>
  );
}

export default FaqPage;
