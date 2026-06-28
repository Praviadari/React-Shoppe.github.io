import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductImage from '../components/ui/ProductImage';
import EmptyState from '../components/ui/EmptyState';
import SeoHead from '../components/seo/SeoHead';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import { buildBreadcrumbJsonLd, buildProductJsonLd } from '../utils/seo';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const found = await getProductBySlug(slug);
      if (cancelled) return;

      setProduct(found);
      if (found) {
        const relatedProducts = await getRelatedProducts(found);
        if (!cancelled) {
          setRelated(relatedProducts);
        }
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail" aria-busy="true" aria-label="Loading product">
        <div className="product-detail__layout product-detail__layout--skeleton">
          <div className="product-detail__skeleton-image" />
          <div className="product-detail__skeleton-info">
            <div className="product-detail__skeleton-line product-detail__skeleton-line--short" />
            <div className="product-detail__skeleton-line product-detail__skeleton-line--title" />
            <div className="product-detail__skeleton-line product-detail__skeleton-line--medium" />
            <div className="product-detail__skeleton-line" />
            <div className="product-detail__skeleton-line" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon="search_off"
        title="Product not found"
        message="We could not find that item in our catalog."
        actionLabel="Back to shop"
        actionTo="/shop"
      />
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const saved = isInWishlist(product.id);

  return (
    <div className="product-detail">
      <SeoHead
        title={product.name}
        description={product.description}
        path={`/shop/${product.slug}`}
        image={product.image}
        type="product"
        jsonLd={[
          buildProductJsonLd(product),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
            { name: product.name, path: `/shop/${product.slug}` },
          ]),
        ]}
      />
      <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="product-detail__layout">
        <div className="product-detail__gallery">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="product-detail__image"
            eager
          />
        </div>

        <div className="product-detail__info">
          <p className="product-detail__category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__actions">
            <label className="product-detail__qty">
              Quantity
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </label>
            <button
              type="button"
              className="product-detail__add-btn"
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? 'Added to bag' : 'Add to bag'}
            </button>
            <button
              type="button"
              className={`product-detail__wishlist-btn${saved ? ' product-detail__wishlist-btn--active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-pressed={saved}
            >
              {saved ? 'Saved to wishlist' : 'Save to wishlist'}
            </button>
            <Link to="/cart" className="product-detail__view-cart">
              View bag
            </Link>
          </div>

          <ul className="product-detail__trust">
            <li>Complimentary gift wrapping</li>
            <li>Secure checkout</li>
            <li>Worldwide delivery available</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="product-detail__related">
          <h2>You may also like</h2>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
