import { validateCartItems } from './cartValidation';

describe('cartValidation', () => {
  it('rejects empty cart', () => {
    expect(validateCartItems([]).valid).toBe(false);
  });

  it('validates catalog item prices', () => {
    const result = validateCartItems([
      { id: 'f1', name: 'Infinity Photo Frame', price: 500, quantity: 1 },
    ]);
    expect(result.valid).toBe(true);
    expect(result.subtotal).toBe(500);
    expect(result.shipping).toBe(99);
    expect(result.total).toBe(599);
  });

  it('waives shipping for large orders', () => {
    const result = validateCartItems([
      { id: 'f3', name: 'Purse', price: 700, quantity: 3 },
    ]);
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(2100);
  });

  it('rejects tampered catalog prices', () => {
    const result = validateCartItems([
      { id: 'f1', name: 'Infinity Photo Frame', price: 1, quantity: 1 },
    ]);
    expect(result.valid).toBe(false);
  });

  it('validates custom build items from metadata', () => {
    const result = validateCartItems([
      {
        id: 'custom-1',
        type: 'custom',
        name: 'Custom Infinity Photo Frame',
        price: 1000,
        quantity: 1,
        metadata: {
          baseItem: 'infinity-frame',
          material: 'crystal',
          engraving: 'Asha',
        },
      },
    ]);
    expect(result.valid).toBe(true);
    expect(result.subtotal).toBe(1000);
  });
});
