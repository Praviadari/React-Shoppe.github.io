import { searchProducts } from './searchProducts';

const products = [
  { id: 'f1', name: 'Infinity Photo Frame', category: 'Featured', description: 'Crystal engraved frame' },
  { id: 'n1', name: 'Clock', category: 'New Arrivals' },
  { id: 'w1', name: 'Gold Watch', category: 'Items', description: 'Premium wristwatch gift' },
];

describe('searchProducts', () => {
  it('returns empty array for blank query', () => {
    expect(searchProducts(products, '')).toEqual([]);
    expect(searchProducts(products, '   ')).toEqual([]);
  });

  it('matches product name', () => {
    expect(searchProducts(products, 'clock')).toHaveLength(1);
    expect(searchProducts(products, 'clock')[0].id).toBe('n1');
  });

  it('matches description and category', () => {
    expect(searchProducts(products, 'crystal')).toHaveLength(1);
    expect(searchProducts(products, 'new arrivals')).toHaveLength(1);
  });

  it('is case insensitive', () => {
    expect(searchProducts(products, 'GOLD')).toHaveLength(1);
  });
});
