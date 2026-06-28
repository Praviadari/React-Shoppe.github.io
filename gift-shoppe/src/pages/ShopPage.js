import React, { useMemo, useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import PageLoader from '../components/ui/PageLoader';
import { useProducts } from '../hooks/useProducts';
import '../styles/pages.css';
import '../styles/animations.css';

function ShopPage() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Featured', 'New Arrivals', 'Items'];

  const filteredProducts = useMemo(
    () =>
      activeCategory === 'All'
        ? products
        : products.filter((p) => p.category === activeCategory),
    [activeCategory, products]
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="home" style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <section
        style={{
          padding: '8rem 2rem 4rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="animate-fade-in-up" style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.2em',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            GiftShoppe Exclusive
          </p>
          <h1
            style={{
              fontSize: '4.5rem',
              fontWeight: 300,
              letterSpacing: '-0.04em',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
            }}
          >
            The Global Shop
          </h1>
        </div>
      </section>

      <section
        style={{
          display: 'flex',
          gap: '4rem',
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '2rem 2rem 8rem',
          width: '100%',
        }}
        className="product-section-layout"
      >
        <aside
          style={{
            width: '200px',
            flexShrink: 0,
            position: 'sticky',
            top: '120px',
            height: 'max-content',
          }}
          className="shop-sidebar"
        >
          <h3
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-accent)',
              marginBottom: '1.5rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Categories
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    width: '100%',
                    padding: '0',
                    fontSize: '1rem',
                    fontWeight: activeCategory === cat ? 500 : 400,
                    color: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    textDecoration: activeCategory === cat ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>
              {filteredProducts.length === 0
                ? 'No products match this filter'
                : `Showing ${filteredProducts.length} Results`}
            </p>
          </div>
          {filteredProducts.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '3rem' }}>
              Try another category or{' '}
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'var(--color-accent)' }}
              >
                view all products
              </button>
            </p>
          ) : (
            <div
              className="product-grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '4rem 2rem' }}
            >
              {filteredProducts.map((product) => (
                <div
                  className="animate-fade-in-up"
                  style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards', opacity: 0 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ShopPage;
