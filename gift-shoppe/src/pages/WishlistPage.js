import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/seo/SeoHead';
import ProductCard from '../components/product/ProductCard';
import ProductGridSkeleton from '../components/ui/ProductGridSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './WishlistPage.css';

function WishlistPage() {
  const { items, loading } = useWishlist();
  const { user } = useAuth();

  return (
    <div className="wishlist-page">
      <SeoHead title="Wishlist" path="/wishlist" noindex />
      <h1>Wishlist</h1>
      <p className="wishlist-page__subtitle">
        {loading
          ? 'Loading your saved pieces…'
          : items.length === 0
            ? 'Save pieces you love and return when you are ready.'
            : `${items.length} saved ${items.length === 1 ? 'item' : 'items'}`}
      </p>

      {!loading && !user && items.length > 0 && (
        <p className="wishlist-page__notice">
          Sign in to sync your wishlist across devices. <Link to="/login">Sign in</Link> or <Link to="/signup">create an account</Link>.
        </p>
      )}

      {loading ? (
        <ProductGridSkeleton count={4} className="wishlist-grid" />
      ) : items.length === 0 ? (
        <EmptyState
          icon="favorite_border"
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it for later."
          actionLabel="Explore the shop"
          actionTo="/shop"
        />
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <ProductCard
              key={item.productId}
              product={{
                id: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image,
                category: item.category,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
