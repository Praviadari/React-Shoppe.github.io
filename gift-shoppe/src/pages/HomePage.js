import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';
import ProductCard from '../components/product/ProductCard';
import PageLoader from '../components/ui/PageLoader';
import { useProducts } from '../hooks/useProducts';

function HomePage() {
  const { products, loading } = useProducts();

  const featured = useMemo(
    () => products.filter((p) => p.category === 'Featured').slice(0, 8),
    [products]
  );

  const signature = useMemo(
    () => products.filter((p) => p.category === 'Items').slice(0, 8),
    [products]
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitle">The Global Experience</p>
          <h1 className="hero-title">GiftShoppe</h1>
          <Link to="/collections" className="hero-button">
            Explore Collections
          </Link>
        </div>
      </section>

      <section className="trust-badges">
        <div className="trust-badge">
          <div className="trust-badge-icon">
            <span className="material-icons" style={{ fontSize: '2.5rem' }} aria-hidden="true">flight_takeoff</span>
          </div>
          <h4>Global Delivery</h4>
          <p>Worldwide shipping to over 150 countries safely.</p>
        </div>
        <div className="trust-badge">
          <div className="trust-badge-icon">
            <span className="material-icons" style={{ fontSize: '2.5rem' }} aria-hidden="true">diamond</span>
          </div>
          <h4>Premium Quality</h4>
          <p>Curated gifts crafted with unmatched excellence.</p>
        </div>
        <div className="trust-badge">
          <div className="trust-badge-icon">
            <span className="material-icons" style={{ fontSize: '2.5rem' }} aria-hidden="true">support_agent</span>
          </div>
          <h4>24/7 Concierge</h4>
          <p>Round-the-clock support for your gifting needs.</p>
        </div>
        <div className="trust-badge">
          <div className="trust-badge-icon">
            <span className="material-icons" style={{ fontSize: '2.5rem' }} aria-hidden="true">verified_user</span>
          </div>
          <h4>Secure Payments</h4>
          <p>Highest level of security for transactions.</p>
        </div>
      </section>

      <section className="builder-cta">
        <h2>Bespoke Gift Studio</h2>
        <p>Design a one-of-a-kind piece with our custom gift builder — choose materials, engraving, and typography.</p>
        <Link to="/build" className="builder-cta__link">Start your custom build</Link>
      </section>

      <section className="product-section">
        <div className="section-header">
          <h2>Curated For You</h2>
          <p>Discover our exclusive selection of meaningful gifts.</p>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="product-section" style={{ backgroundColor: '#fafafa' }}>
        <div className="section-header">
          <h2>Signature Collections</h2>
          <p>Elegant timepieces and bespoke mosaic stands.</p>
        </div>
        <div className="product-grid">
          {signature.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section
        className="hero"
        style={{
          height: '60vh',
          minHeight: '400px',
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1549465220-1a8b9238cd28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
        }}
      >
        <div className="hero-content">
          <p className="hero-subtitle" style={{ color: 'white' }}>Exclusive Offer</p>
          <h2 className="hero-title" style={{ fontSize: '3.5rem' }}>Up to 50% Off</h2>
          <Link
            to="/shop"
            className="hero-button"
            style={{ backgroundColor: 'white', color: 'var(--color-accent)' }}
          >
            Shop the sale
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
