import React from 'react';
import SeoHead from '../components/seo/SeoHead';
import '../styles/content-page.css';

function TermsPage() {
  return (
    <div className="content-page content-page--wide">
      <SeoHead
        title="Terms of Service"
        description="GiftShoppe terms of service for using our website and placing orders."
        path="/terms"
      />
      <p className="content-page__eyebrow">Legal</p>
      <h1>Terms of service</h1>
      <p className="content-page__lead">Last updated: June 28, 2026</p>

      <section>
        <h2>Using GiftShoppe</h2>
        <p>
          By accessing GiftShoppe you agree to these terms. You must provide accurate delivery and contact
          information when placing orders. You are responsible for maintaining the security of your account credentials.
        </p>
      </section>

      <section>
        <h2>Orders & payments</h2>
        <p>
          Prices are listed in Indian Rupees (INR). Payments are processed through Razorpay when configured.
          Orders are confirmed upon successful payment or local checkout simulation in development environments.
        </p>
      </section>

      <section>
        <h2>Custom & personalized items</h2>
        <p>
          Bespoke and engraved products are made to order. These items are non-returnable except in cases of
          manufacturing defect or damage during shipping.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          GiftShoppe is provided as-is. We are not liable for indirect damages arising from use of the service,
          to the maximum extent permitted by applicable law.
        </p>
      </section>
    </div>
  );
}

export default TermsPage;
