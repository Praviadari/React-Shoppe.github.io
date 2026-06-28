const crypto = require('crypto');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const { initializeApp } = require('firebase-admin/app');
const Razorpay = require('razorpay');
const catalogPrices = require('./data/catalogPrices.json');
const { getExpectedCustomItemPrice } = require('./customBuildPricing');

initializeApp();
setGlobalOptions({ region: process.env.FUNCTIONS_REGION || 'asia-south1' });

function getCatalogItemPrice(productId) {
  return catalogPrices[productId] ?? null;
}

function getExpectedItemPrice(item) {
  if (item.type === 'custom') {
    return getExpectedCustomItemPrice(item.metadata);
  }
  return getCatalogItemPrice(item.id);
}

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new HttpsError('failed-precondition', 'Razorpay is not configured on the server.');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

exports.validateCartPricing = onCall((request) => {
  const { items } = request.data || {};
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpsError('invalid-argument', 'Cart items are required.');
  }

  let subtotal = 0;

  for (const item of items) {
    const expectedPrice = getExpectedItemPrice(item);
    if (expectedPrice === null) {
      throw new HttpsError('invalid-argument', `Unknown item: ${item.id}`);
    }
    if (item.price !== expectedPrice) {
      throw new HttpsError('failed-precondition', `Price mismatch for ${item.name || item.id}`);
    }
    subtotal += expectedPrice * (item.quantity || 1);
  }

  const shipping = subtotal >= 2000 ? 0 : 99;
  return {
    valid: true,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
});

exports.createRazorpayOrder = onCall(async (request) => {
  const { amountPaise, receipt } = request.data || {};
  if (!amountPaise || amountPaise < 100) {
    throw new HttpsError('invalid-argument', 'A valid amount in paise is required.');
  }

  const razorpay = getRazorpayClient();
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: receipt || `rcpt_${Date.now()}`,
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
});

exports.verifyRazorpayPayment = onCall((request) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = request.data || {};
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new HttpsError('invalid-argument', 'Payment verification fields are required.');
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new HttpsError('failed-precondition', 'Razorpay secret is not configured.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new HttpsError('permission-denied', 'Invalid payment signature.');
  }

  return { verified: true };
});
