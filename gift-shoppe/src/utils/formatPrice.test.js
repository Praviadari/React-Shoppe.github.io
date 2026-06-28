import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats INR amounts with two decimal places', () => {
    expect(formatPrice(500)).toBe('₹500.00');
    expect(formatPrice(49.9)).toBe('₹49.90');
  });
});
