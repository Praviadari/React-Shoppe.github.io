import {
  createRazorpayOrder,
  isCloudFunctionsEnabled,
  verifyRazorpayPayment,
} from './functionsService';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export function isRazorpayConfigured() {
  return Boolean(process.env.REACT_APP_RAZORPAY_KEY_ID);
}

export function isServerPaymentsEnabled() {
  return isRazorpayConfigured() && isCloudFunctionsEnabled();
}

export function amountToPaise(amountInr) {
  return Math.round(amountInr * 100);
}

function loadRazorpayScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay is only available in the browser.'));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay));
      existing.addEventListener('error', () => reject(new Error('Could not load Razorpay.')));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Could not load Razorpay.'));
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment({
  amount,
  customer,
  orderReference,
  description,
  razorpayOrderId = null,
}) {
  if (!isRazorpayConfigured()) {
    throw new Error('Razorpay is not configured.');
  }

  const Razorpay = await loadRazorpayScript();
  let serverOrderId = razorpayOrderId;

  if (!serverOrderId && isCloudFunctionsEnabled()) {
    const serverOrder = await createRazorpayOrder({
      amountPaise: amountToPaise(amount),
      receipt: orderReference,
    });
    serverOrderId = serverOrder.orderId;
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      name: 'GiftShoppe',
      description: description || 'Gift order',
      prefill: {
        name: customer.fullName,
        email: customer.email,
        contact: customer.phone,
      },
      notes: {
        order_reference: orderReference,
      },
      handler(response) {
        resolve(response);
      },
      modal: {
        ondismiss() {
          reject(new Error('Payment cancelled'));
        },
      },
    };

    if (serverOrderId) {
      options.order_id = serverOrderId;
    } else {
      options.amount = amountToPaise(amount);
      options.currency = 'INR';
    }

    const checkout = new Razorpay(options);
    checkout.on('payment.failed', (response) => {
      reject(new Error(response.error?.description || 'Payment failed'));
    });
    checkout.open();
  });
}

export async function finalizeRazorpayPayment(paymentResponse) {
  if (!isCloudFunctionsEnabled()) {
    return { verified: false, paymentId: paymentResponse.razorpay_payment_id };
  }

  await verifyRazorpayPayment({
    razorpayOrderId: paymentResponse.razorpay_order_id,
    razorpayPaymentId: paymentResponse.razorpay_payment_id,
    razorpaySignature: paymentResponse.razorpay_signature,
  });

  return {
    verified: true,
    paymentId: paymentResponse.razorpay_payment_id,
    orderId: paymentResponse.razorpay_order_id,
  };
}
