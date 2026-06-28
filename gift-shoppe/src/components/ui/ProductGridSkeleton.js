import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

function ProductGridSkeleton({ count = 8, className = 'product-grid' }) {
  return (
    <div
      className={className}
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
