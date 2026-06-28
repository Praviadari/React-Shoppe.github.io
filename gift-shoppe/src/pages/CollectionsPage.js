import React, { useMemo } from 'react';
import ProductCard from '../components/product/ProductCard';
import PageLoader from '../components/ui/PageLoader';
import { useProducts } from '../hooks/useProducts';
import '../styles/pages.css';
import '../styles/animations.css';

function CollectionsPage() {
  const { products, loading } = useProducts();

  const curated = useMemo(
    () => products.filter((p) => p.category === 'Featured').slice(0, 8),
    [products]
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="home" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <section
        style={{
          padding: '8rem 2rem 4rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="animate-fade-in-up" style={{ animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.2em',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            Curated Selection
          </p>
          <h1
            style={{
              fontSize: '5rem',
              fontWeight: 300,
              letterSpacing: '-0.04em',
              color: 'var(--color-accent)',
              marginBottom: '1.5rem',
              lineHeight: 1,
            }}
          >
            The Edit.
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A definitive showcase of our most exquisite and sought-after pieces, hand-selected for the modern aesthete.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem 8rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="product-grid" style={{ gap: '5rem 3rem' }}>
          {curated.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animation: `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`, opacity: 0 }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CollectionsPage;
