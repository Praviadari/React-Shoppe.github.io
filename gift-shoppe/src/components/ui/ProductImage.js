import React, { useState } from 'react';
import { getProductImageSources } from '../../utils/imageSources';

const PLACEHOLDER_SRC =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect fill="#f2f2f2" width="400" height="500"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="16">Image unavailable</text></svg>'
  );

function ProductImage({
  src,
  alt,
  className,
  width = 400,
  height = 500,
  eager = false,
  sizes = '(max-width: 768px) 50vw, 280px',
}) {
  const [hasError, setHasError] = useState(false);
  const sources = getProductImageSources(src);
  const imgProps = {
    alt,
    className,
    width,
    height,
    loading: eager ? 'eager' : 'lazy',
    decoding: 'async',
    sizes,
    ...(eager ? { fetchPriority: 'high' } : {}),
    onError: () => setHasError(true),
  };

  if (hasError || !src) {
    return <img src={PLACEHOLDER_SRC} {...imgProps} alt={alt || 'Image unavailable'} />;
  }

  if (sources.hasWebp) {
    return (
      <picture>
        <source srcSet={sources.webp} type="image/webp" sizes={sizes} />
        <img src={sources.fallback} {...imgProps} />
      </picture>
    );
  }

  return <img src={sources.fallback} {...imgProps} />;
}

export default ProductImage;
