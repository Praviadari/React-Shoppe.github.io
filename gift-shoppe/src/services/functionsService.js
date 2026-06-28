import { httpsCallable } from 'firebase/functions';
import { isFirebaseConfigured } from './firebase';
import { getFunctionsInstance } from './firebaseApp';
import { validateCartItems } from '../utils/cartValidation';

export function isCloudFunctionsEnabled() {
  return isFirebaseConfigured() && process.env.REACT_APP_USE_CLOUD_FUNCTIONS === 'true';
}

async function callFunction(name, data) {
  const functions = getFunctionsInstance();
  if (!functions) {
    throw new Error('Cloud Functions are not available.');
  }
  const callable = httpsCallable(functions, name);
  const result = await callable(data);
  return result.data;
}

export async function validateCartPricing(items) {
  if (!isCloudFunctionsEnabled()) {
    return validateCartItems(items);
  }
  return callFunction('validateCartPricing', { items });
}

export async function createRazorpayOrder({ amountPaise, receipt }) {
  return callFunction('createRazorpayOrder', { amountPaise, receipt });
}

export async function verifyRazorpayPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  return callFunction('verifyRazorpayPayment', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
}
