import {
  formatDeliveryDate,
  getMaxDeliveryDate,
  getMinDeliveryDate,
  isValidDeliveryDate,
} from './deliveryDate';

describe('deliveryDate', () => {
  it('returns min date two days ahead', () => {
    const min = getMinDeliveryDate();
    expect(min).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const minDate = new Date(`${min}T12:00:00`);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const diffDays = Math.round((minDate - today) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(2);
  });

  it('accepts empty delivery date', () => {
    expect(isValidDeliveryDate('')).toBe(true);
  });

  it('rejects dates outside the allowed window', () => {
    expect(isValidDeliveryDate('2000-01-01')).toBe(false);
    expect(isValidDeliveryDate(getMinDeliveryDate())).toBe(true);
    expect(isValidDeliveryDate(getMaxDeliveryDate())).toBe(true);
  });

  it('formats delivery dates for display', () => {
    expect(formatDeliveryDate('2026-12-25')).toContain('2026');
  });
});
