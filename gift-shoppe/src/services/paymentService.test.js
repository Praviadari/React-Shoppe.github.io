import { amountToPaise, isRazorpayConfigured } from './paymentService';

describe('paymentService', () => {
  const originalKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

  afterEach(() => {
    process.env.REACT_APP_RAZORPAY_KEY_ID = originalKey;
  });

  it('detects when Razorpay key is configured', () => {
    process.env.REACT_APP_RAZORPAY_KEY_ID = 'rzp_test_abc';
    expect(isRazorpayConfigured()).toBe(true);

    process.env.REACT_APP_RAZORPAY_KEY_ID = '';
    expect(isRazorpayConfigured()).toBe(false);
  });

  it('converts INR amounts to paise', () => {
    expect(amountToPaise(599)).toBe(59900);
    expect(amountToPaise(1999.5)).toBe(199950);
  });
});
