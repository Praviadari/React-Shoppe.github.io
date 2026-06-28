import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';

function PressPage() {
  return (
    <div className="content-page">
      <SeoHead
        title="Press"
        description="GiftShoppe press room — media kit, brand assets, and press inquiries."
        path="/press"
      />
      <p className="content-page__eyebrow">Media</p>
      <h1>Press & media</h1>
      <p className="content-page__lead">
        For interviews, brand assets, or partnership announcements, our communications team is happy to help.
      </p>

      <section>
        <h2>About GiftShoppe</h2>
        <p>
          GiftShoppe is a premium online gifting destination offering curated photo frames, watches,
          and bespoke custom builds with worldwide delivery. Founded on the belief that gifting should
          feel personal and intentional.
        </p>
      </section>

      <section>
        <h2>Press contact</h2>
        <p>
          Email <a href="mailto:press@giftshoppe.com">press@giftshoppe.com</a> for media inquiries,
          or use our <Link to="/contact">contact form</Link> and select press in the subject line.
        </p>
      </section>

      <section>
        <h2>Brand assets</h2>
        <ul>
          <li>Logo and wordmark (SVG, PNG) — available on request</li>
          <li>Product photography — high-resolution catalog images</li>
          <li>Founder bio and company fact sheet</li>
        </ul>
      </section>
    </div>
  );
}

export default PressPage;
