import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductGridSkeleton from '../components/ui/ProductGridSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SeoHead from '../components/seo/SeoHead';
import { useProducts } from '../hooks/useProducts';
import { searchProducts } from '../utils/searchProducts';
import { recordSearchQuery } from '../services/searchAnalytics';
import '../styles/content-page.css';
import './SearchPage.css';

function SearchPage() {
  const { products, loading, error, reload } = useProducts();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryFromUrl = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryFromUrl);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (queryFromUrl.trim()) {
      recordSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl]);

  const results = useMemo(
    () => searchProducts(products, queryFromUrl),
    [products, queryFromUrl]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/search');
    }
  };

  if (error) {
    return (
      <EmptyState
        role="alert"
        icon="search"
        title="Search unavailable"
        message="We could not load the catalog. Please try again."
        actionLabel="Go home"
        actionTo="/"
        secondaryLabel="Try again"
        onSecondaryAction={reload}
      />
    );
  }

  return (
    <div className="search-page">
      <SeoHead
        title={queryFromUrl ? `Search: ${queryFromUrl}` : 'Search'}
        description="Search GiftShoppe for photo frames, watches, and curated gifts."
        path="/search"
        noindex={Boolean(queryFromUrl)}
      />

      <div className="search-page__header">
        <p className="content-page__eyebrow">Discover</p>
        <h1>Search the shop</h1>
        <form className="search-page__form" role="search" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="catalog-search">Search products</label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Frames, watches, gifts…"
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {queryFromUrl && (
        <div className="search-page__results" aria-busy={loading}>
          <p className="search-page__summary">
            {loading
              ? 'Searching…'
              : `${results.length} result${results.length === 1 ? '' : 's'} for “${queryFromUrl}”`}
          </p>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : results.length === 0 ? (
            <EmptyState
              icon="search_off"
              title="No matches found"
              message="Try a different keyword or browse our full catalog."
              actionLabel="Browse shop"
              actionTo="/shop"
              secondaryLabel="Gift concierge"
              secondaryTo="/concierge"
            />
          ) : (
            <div className="product-grid">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {!queryFromUrl && (
        <div className="search-page__hints">
          <p>Popular searches:</p>
          <div className="search-page__chips">
            {['photo frame', 'watch', 'engraved', 'custom'].map((term) => (
              <Link key={term} to={`/search?q=${encodeURIComponent(term)}`} className="search-page__chip">
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
