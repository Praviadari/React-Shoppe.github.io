import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import PageLoader from '../components/ui/PageLoader';
import { useCart } from '../context/CartContext';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
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
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="product-detail product-detail--missing">
        <h1>Product not found</h1>
        <p>We could not find that item in our catalog.</p>
        <Link to="/shop" className="product-detail__back-link">Back to shop</Link>
      </div>
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

  return (
    <div className="product-detail">
      <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="product-detail__layout">
        <div className="product-detail__gallery">
          <img src={product.image} alt={product.name} className="product-detail__image" />
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
