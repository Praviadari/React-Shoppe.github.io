import { getAuthErrorMessage } from './authErrors';
import { toWishlistItem } from '../services/wishlistService';

describe('authErrors', () => {
  it('maps known Firebase auth codes to friendly messages', () => {
    expect(getAuthErrorMessage({ code: 'auth/invalid-credential' })).toBe(
      'Invalid email or password.'
    );
  });

  it('falls back to a generic message', () => {
    expect(getAuthErrorMessage({ code: 'auth/unknown' })).toBe(
      'Authentication failed. Please try again.'
    );
  });
});

describe('wishlistService', () => {
  it('toWishlistItem normalizes product fields', () => {
    const item = toWishlistItem({
      id: 'f1',
      slug: 'infinity-photo-frame-f1',
      name: 'Infinity Photo Frame',
      price: 500,
      image: '/img/Products/f1.jpg',
      category: 'Featured',
    });

    expect(item.productId).toBe('f1');
    expect(item.slug).toBe('infinity-photo-frame-f1');
    expect(item.name).toBe('Infinity Photo Frame');
    expect(item.addedAt).toBeTruthy();
  });
});
