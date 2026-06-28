/**
 * Error reporting hook for GiftShoppe.
 *
 * To enable full Sentry capture in production:
 * 1. npm install @sentry/react
 * 2. Set REACT_APP_SENTRY_DSN in your environment
 * 3. Replace this module with @sentry/react init/capture calls
 */
export function isSentryEnabled() {
  return Boolean(process.env.REACT_APP_SENTRY_DSN);
}

export function initSentry() {
  if (isSentryEnabled() && process.env.NODE_ENV === 'development') {
    console.info('[monitoring] REACT_APP_SENTRY_DSN is set. Install @sentry/react for production capture.');
  }
}

export function captureException(error, context) {
  if (isSentryEnabled()) {
    console.error('[monitoring]', error, context);
    return;
  }
  console.error(error, context);
}
