import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';
import './SupportPage.css';

const SUPPORT_LINKS = [
  {
    title: 'FAQ',
    description: 'Answers about delivery, returns, personalization, and concierge services.',
    to: '/faq',
    icon: 'help_outline',
  },
  {
    title: 'Contact us',
    description: 'Send a message to our support team for order help or gifting advice.',
    to: '/contact',
    icon: 'mail_outline',
  },
  {
    title: 'Track order',
    description: 'Look up your order status with your confirmation reference.',
    to: '/track-order',
    icon: 'local_shipping',
  },
  {
    title: 'Shipping & returns',
    description: 'Rates, timelines, and our return policy for personalized gifts.',
    to: '/shipping',
    icon: 'inventory_2',
  },
  {
    title: 'Gift concierge',
    description: 'Get curated recommendations from our gifting specialists.',
    to: '/concierge',
    icon: 'support_agent',
  },
  {
    title: 'Corporate gifting',
    description: 'Bulk orders, branded packaging, and multi-address delivery.',
    to: '/corporate',
    icon: 'business',
  },
];

function SupportPage() {
  return (
    <div className="content-page content-page--wide">
      <SeoHead
        title="24/7 Support"
        description="GiftShoppe customer support — FAQ, order tracking, contact, and concierge services."
        path="/support"
      />
      <p className="content-page__eyebrow">We are here to help</p>
      <h1>24/7 Support</h1>
      <p className="content-page__lead">
        Whether you need order updates, return guidance, or help choosing the perfect gift,
        our team is ready to assist.
      </p>

      <div className="support-grid">
        {SUPPORT_LINKS.map((item) => (
          <Link key={item.to} to={item.to} className="support-card">
            <span className="material-icons support-card__icon" aria-hidden="true">{item.icon}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SupportPage;
