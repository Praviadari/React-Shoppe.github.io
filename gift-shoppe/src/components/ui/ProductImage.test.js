import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductImage from './ProductImage';

describe('ProductImage', () => {
  it('renders picture element with webp source for jpeg paths', () => {
    const { container } = render(
      <ProductImage src="/img/Products/f1.jpg" alt="Infinity frame" />
    );

    expect(container.querySelector('picture source[type="image/webp"]')).toHaveAttribute(
      'srcSet',
      '/img/Products/f1.webp'
    );
    expect(screen.getByRole('img', { name: 'Infinity frame' })).toHaveAttribute(
      'src',
      '/img/Products/f1.jpg'
    );
  });

  it('sets fetchpriority high for eager images', () => {
    render(<ProductImage src="/img/Products/f1.jpg" alt="Hero product" eager />);
    expect(screen.getByRole('img', { name: 'Hero product' })).toHaveAttribute('fetchpriority', 'high');
  });
});
