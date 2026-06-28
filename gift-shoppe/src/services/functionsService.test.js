import { validateCartItems } from '../utils/cartValidation';

jest.mock('./firebaseApp', () => ({
  getFunctionsInstance: jest.fn(() => null),
}));

jest.mock('./firebase', () => ({
  isFirebaseConfigured: jest.fn(() => false),
}));

describe('functionsService', () => {
  const originalFlag = process.env.REACT_APP_USE_CLOUD_FUNCTIONS;

  afterEach(() => {
    process.env.REACT_APP_USE_CLOUD_FUNCTIONS = originalFlag;
    jest.resetModules();
  });

  it('uses client-side validation when cloud functions are disabled', async () => {
    process.env.REACT_APP_USE_CLOUD_FUNCTIONS = 'false';
    const { validateCartPricing, isCloudFunctionsEnabled } = await import('./functionsService');

    expect(isCloudFunctionsEnabled()).toBe(false);
    const result = await validateCartPricing([
      { id: 'f1', name: 'Infinity Photo Frame', price: 500, quantity: 1 },
    ]);
    expect(result.valid).toBe(true);
    expect(result.subtotal).toBe(500);
  });

  it('validateCartItems rejects tampered prices locally', () => {
    const result = validateCartItems([
      { id: 'f1', name: 'Infinity Photo Frame', price: 1, quantity: 1 },
    ]);
    expect(result.valid).toBe(false);
  });
});
