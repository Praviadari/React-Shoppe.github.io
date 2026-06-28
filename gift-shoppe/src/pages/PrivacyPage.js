import React from 'react';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';

function PrivacyPage() {
  return (
    <div className="content-page content-page--wide">
      <SeoHead
        title="Privacy Policy"
        description="GiftShoppe privacy policy — how we collect, use, and protect your personal information."
        path="/privacy"
      />
      <p className="content-page__eyebrow">Legal</p>
      <h1>Privacy policy</h1>
      <p className="content-page__lead">Last updated: June 28, 2026</p>

      <section>
        <h2>Information we collect</h2>
        <p>
          We collect information you provide when creating an account, placing an order, or contacting support —
          including name, email, phone, delivery address, and payment references processed by Razorpay.
        </p>
      </section>

      <section>
        <h2>How we use your data</h2>
        <ul>
          <li>Fulfill and deliver your orders.</li>
          <li>Send order confirmations and support responses.</li>
          <li>Improve our catalog and shopping experience.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </section>

      <section>
        <h2>Data storage</h2>
        <p>
          Account profiles and wishlists may be stored in Firebase when configured. Order data is stored locally
          in your browser and optionally synced to Firestore for signed-in users. We do not sell your personal data.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For privacy requests, email us through the contact page or write to privacy@giftshoppe.com.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPage;
