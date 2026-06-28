import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-brand">
          <h2>GiftShoppe</h2>
          <p>The definitive destination for premium,<br />curated global gifting.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Shop</h4>
            <Link to="/collections">Collections</Link>
            <Link to="/shop">All Products</Link>
            <Link to="/build">Custom Gifts</Link>
            <Link to="/shop">New Arrivals</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press</Link>
            <Link to="/sustainability">Sustainability</Link>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/shipping">Shipping & Returns</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/track-order">Track Order</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-social">
          <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true" /></a>
          <a href="#twitter" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true" /></a>
          <a href="#pinterest" aria-label="Pinterest"><i className="fab fa-pinterest" aria-hidden="true" /></a>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} GiftShoppe. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
