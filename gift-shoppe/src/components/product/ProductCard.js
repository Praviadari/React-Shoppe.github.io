import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!product) return null;

  const productUrl = product.slug ? `/shop/${product.slug}` : `/shop`;

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

  return (
    <article className="product-card">
      <div className="product-image-container">
        <Link to={productUrl} className="product-card__image-link">
          <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
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
