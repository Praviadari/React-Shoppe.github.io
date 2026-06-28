import React, { useMemo, useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import ProductGridSkeleton from '../components/ui/ProductGridSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SeoHead from '../components/seo/SeoHead';
import { useProducts } from '../hooks/useProducts';
import { buildBreadcrumbJsonLd } from '../utils/seo';
import '../styles/pages.css';
import './ShopPage.css';
import '../styles/animations.css';

function ShopPage() {
  const { products, loading, error, reload } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Featured', 'New Arrivals', 'Items'];

  const filteredProducts = useMemo(
    () =>
      activeCategory === 'All'
        ? products
        : products.filter((p) => p.category === activeCategory),
    [activeCategory, products]
  );

  if (error) {
    return (
      <EmptyState
        role="alert"
        icon="storefront"
        title="Shop unavailable"
        message="We could not load the catalog right now. Please try again in a moment."
        actionLabel="Back to home"
        actionTo="/"
        secondaryLabel="Try again"
        onSecondaryAction={reload}
      />
    );
  }

  return (
    <div className="home shop-page">
      <SeoHead
        title="Shop"
        description="Browse GiftShoppe's full catalog of curated photo frames, watches, mosaic stands, and bespoke gift ideas."
        path="/shop"
        jsonLd={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
        ])}
      />
      <section className="shop-page__hero">
        <div className="animate-fade-in-up shop-page__hero-inner">
          <p className="shop-page__eyebrow">GiftShoppe Exclusive</p>
          <h1 className="shop-page__title">The Global Shop</h1>
        </div>
      </section>

      <section className="product-section-layout shop-page__layout">
        <aside className="shop-sidebar">
          <h2 className="shop-sidebar__title">Categories</h2>
          <ul className="shop-sidebar__list">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`shop-sidebar__filter${activeCategory === cat ? ' shop-sidebar__filter--active' : ''}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="shop-page__content" aria-busy={loading}>
          <p className="shop-page__results">
            {!loading && filteredProducts.length === 0
              ? 'No products match this filter'
              : loading
                ? 'Loading products…'
                : `Showing ${filteredProducts.length} Results`}
          </p>

          {loading ? (
            <ProductGridSkeleton
              count={6}
              className="product-grid shop-page__grid"
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon="filter_alt"
              title="No matches found"
              message="Try another category or browse our full collection."
              actionLabel="View all products"
              actionTo="/shop"
              secondaryLabel="Clear filters"
              onSecondaryAction={() => setActiveCategory('All')}
            />
          ) : (
            <div className="product-grid shop-page__grid">
              {filteredProducts.map((product) => (
                <div
                  className="animate-fade-in-up"
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
