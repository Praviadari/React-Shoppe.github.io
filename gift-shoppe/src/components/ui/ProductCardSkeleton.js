import React from 'react';
import './ProductCardSkeleton.css';

function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton" aria-hidden="true">
      <div className="product-card-skeleton__image" />
      <div className="product-card-skeleton__line product-card-skeleton__line--short" />
      <div className="product-card-skeleton__line product-card-skeleton__line--medium" />
      <div className="product-card-skeleton__line product-card-skeleton__line--price" />
    </div>
  );
}

export default ProductCardSkeleton;
