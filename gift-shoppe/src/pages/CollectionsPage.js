import React, { useMemo } from 'react';
import ProductCard from '../components/product/ProductCard';
import ProductGridSkeleton from '../components/ui/ProductGridSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SeoHead from '../components/seo/SeoHead';
import { collectionStories } from '../data/collections';
import { useProducts } from '../hooks/useProducts';
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from '../utils/seo';
import '../styles/pages.css';
import './CollectionsPage.css';
import '../styles/animations.css';

function CollectionsPage() {
  const { products, loading, error, reload } = useProducts();

  const curated = useMemo(
    () => products.filter((p) => p.category === 'Featured').slice(0, 8),
    [products]
  );

  const storiesWithProducts = useMemo(
    () =>
      collectionStories.map((story) => ({
        ...story,
        products: products.filter((product) => product.category === story.category).slice(0, 4),
      })),
    [products]
  );

  if (error) {
    return (
      <EmptyState
        role="alert"
        icon="collections"
        title="Collections unavailable"
        message="We could not load our curated selection. Please try again."
        actionLabel="Back to home"
        actionTo="/"
        secondaryLabel="Try again"
        onSecondaryAction={reload}
      />
    );
  }

  return (
    <div className="home collections-page">
      <SeoHead
        title="Collections"
        description="Explore GiftShoppe collections — signature frames, new arrivals, and timeless watches curated for meaningful gifting."
        path="/collections"
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Collections', path: '/collections' },
          ]),
          !loading && curated.length > 0
            ? buildItemListJsonLd(curated, 'GiftShoppe Featured Collection')
            : null,
        ].filter(Boolean)}
      />

      <section className="collections-page__hero">
        <div className="animate-fade-in-up collections-page__hero-inner">
          <p className="collections-page__eyebrow">Curated Selection</p>
          <h1 className="collections-page__title">The Edit.</h1>
          <p className="collections-page__lead">
            A definitive showcase of our most exquisite and sought-after pieces, hand-selected for the modern aesthete.
          </p>
        </div>
      </section>

      {!loading && (
        <section className="collections-page__stories" aria-label="Collection stories">
          {storiesWithProducts.map((story) => (
            <article key={story.id} className="collection-story">
              <p className="collection-story__eyebrow">{story.eyebrow}</p>
              <h2 className="collection-story__title">{story.title}</h2>
              <p className="collection-story__description">{story.description}</p>
            </article>
          ))}
        </section>
      )}

      <section className="collections-page__grid-section" aria-busy={loading}>
        <h2 className="collections-page__grid-heading">Featured pieces</h2>
        {loading ? (
          <ProductGridSkeleton count={8} className="product-grid collections-page__grid" />
        ) : curated.length === 0 ? (
          <EmptyState
            icon="inventory_2"
            title="No collections yet"
            message="Our curators are preparing the next edit. Explore the full shop in the meantime."
            actionLabel="Browse shop"
            actionTo="/shop"
          />
        ) : (
          <div className="product-grid collections-page__grid">
            {curated.map((product) => (
              <div key={product.id} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {!loading &&
        storiesWithProducts.map(
          (story) =>
            story.products.length > 0 && (
              <section key={`${story.id}-grid`} className="collections-page__collection-section">
                <div className="collections-page__collection-header">
                  <h2>{story.title}</h2>
                  <p>{story.description}</p>
                </div>
                <div className="product-grid collections-page__grid">
                  {story.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )
        )}
    </div>
  );
}

export default CollectionsPage;
