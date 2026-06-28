import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductImage from '../ui/ProductImage';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!product) return null;

  const productUrl = product.slug ? `/shop/${product.slug}` : `/shop`;
  const saved = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      quantity: 1,
    });
    setIsAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  return (
    <article className="product-card">
      <div className="product-image-container">
        <button
          type="button"
          className={`product-card__wishlist-btn${saved ? ' product-card__wishlist-btn--active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={saved}
        >
          <span className="material-icons" aria-hidden="true">{saved ? 'favorite' : 'favorite_border'}</span>
        </button>
        <Link to={productUrl} className="product-card__image-link">
          <ProductImage src={product.image} alt={product.name} className="product-image" />
        </Link>
        <div className="product-overlay">
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isAdded}
            aria-pressed={isAdded}
            style={{ backgroundColor: isAdded ? '#000' : '', color: isAdded ? '#fff' : '', borderColor: isAdded ? '#000' : '' }}
          >
            {isAdded ? 'Added •' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={productUrl} className="product-card__title-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-price">₹{product.price}</p>
      </div>
    </article>
  );
};

export default ProductCard;
