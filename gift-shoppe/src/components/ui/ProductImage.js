import React, { useState } from 'react';

const PLACEHOLDER_SRC =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect fill="#f2f2f2" width="400" height="500"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="16">Image unavailable</text></svg>'
  );

function ProductImage({ src, alt, className, width = 400, height = 500, eager = false }) {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError || !src ? PLACEHOLDER_SRC : src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}

export default ProductImage;
