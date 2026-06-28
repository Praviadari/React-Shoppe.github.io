import { getProductSlug, slugify, enrichProduct } from './productHelpers';

describe('productHelpers', () => {
  it('slugify converts names to URL-safe slugs', () => {
    expect(slugify('3D Sphere Frame')).toBe('3d-sphere-frame');
    expect(slugify("Couple's Photo Frame")).toBe('couple-s-photo-frame');
  });

  it('getProductSlug appends id for uniqueness', () => {
    expect(getProductSlug({ id: 'f1', name: 'Infinity Photo Frame' })).toBe(
      'infinity-photo-frame-f1'
    );
  });

  it('enrichProduct adds slug and description', () => {
    const product = enrichProduct({
      id: 'f1',
      name: 'Infinity Photo Frame',
      price: 500,
      image: '/img/Products/f1.jpg',
      category: 'Featured',
    });

    expect(product.slug).toBe('infinity-photo-frame-f1');
    expect(product.description).toBeTruthy();
  });
});
