import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';
import ProductCard from '../components/product/ProductCard';
import ProductGridSkeleton from '../components/ui/ProductGridSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SeoHead from '../components/seo/SeoHead';
import { DEFAULT_DESCRIPTION } from '../config/site';
import { useProducts } from '../hooks/useProducts';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '../utils/seo';

function HomePage() {
  const { products, loading, error, reload } = useProducts();

  const featured = useMemo(
    () => products.filter((p) => p.category === 'Featured').slice(0, 8),
    [products]
  );

  const signature = useMemo(
    () => products.filter((p) => p.category === 'Items').slice(0, 8),
    [products]
  );

  if (error) {
    return (
      <EmptyState
        role="alert"
        icon="inventory_2"
        title="Could not load products"
        message="We had trouble loading the catalog. Please check your connection and try again."
        actionLabel="Go home"
        actionTo="/"
        secondaryLabel="Try again"
        onSecondaryAction={reload}
      />
    );
  }

  return (
    <div className="home">
      <SeoHead
        title="GiftShoppe"
        description={DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]}
      />
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
          <h2 className="trust-badge__title">Global Delivery</h2>
          <p>Worldwide shipping to over 150 countries safely.</p>
        </div>
        <div className="trust-badge">
          <div className="trust-badge-icon">
            <span className="material-icons" style={{ fontSize: '2.5rem' }} aria-hidden="true">diamond</span>
          </div>
          <h2 className="trust-badge__title">Premium Quality</h2>
          <p>Curated gifts crafted with unmatched excellence.</p>
        </div>
        <div className="trust-badge">
          <div className="trust-badge-icon">
            <span className="material-icons" style={{ fontSize: '2.5rem' }} aria-hidden="true">support_agent</span>
          </div>
          <h2 className="trust-badge__title">24/7 Concierge</h2>
          <p>Round-the-clock support for your gifting needs.</p>
        </div>
        <div className="trust-badge">
          <div className="trust-badge-icon">
            <span className="material-icons" style={{ fontSize: '2.5rem' }} aria-hidden="true">verified_user</span>
          </div>
          <h2 className="trust-badge__title">Secure Payments</h2>
          <p>Highest level of security for transactions.</p>
        </div>
      </section>

      <section className="builder-cta">
        <h2>Bespoke Gift Studio</h2>
        <p>Design a one-of-a-kind piece with our custom gift builder — choose materials, engraving, and typography.</p>
        <Link to="/build" className="builder-cta__link">Start your custom build</Link>
      </section>

      <section className="product-section" aria-busy={loading}>
        <div className="section-header">
          <h2>Curated For You</h2>
          <p>Discover our exclusive selection of meaningful gifts.</p>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="product-section product-section--muted" aria-busy={loading}>
        <div className="section-header">
          <h2>Signature Collections</h2>
          <p>Elegant timepieces and bespoke mosaic stands.</p>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="product-grid">
            {signature.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section
        className="hero hero--promo"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1549465220-1a8b9238cd28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
        }}
      >
        <div className="hero-content">
          <p className="hero-subtitle hero-subtitle--light">Exclusive Offer</p>
          <h2 className="hero-title hero-title--promo">Up to 50% Off</h2>
          <Link to="/shop" className="hero-button hero-button--light">
            Shop the sale
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
