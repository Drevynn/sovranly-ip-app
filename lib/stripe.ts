import Stripe from 'stripe';

/**
 * ==============================================================================
 * STRIPE CLIENT INITIALIZATION
 * ==============================================================================
 * We use lazy initialization so that the application dev server does not crash
 * on startup if the STRIPE_SECRET_KEY is not yet configured.
 * 
 * PLACEHOLDER / CONFIGURATION:
 * Add your Stripe Secret Key (e.g. sk_test_...) in your environment or .env.local file:
 * STRIPE_SECRET_KEY=sk_test_...
 *
 * NOTE ON API VERSION:
 * The Stripe SDK automatically negotiates and selects the latest API version
 * (2026-08-26.dahlia), so no manual apiVersion pin is needed.
 */

let stripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (stripeInstance) {
    return stripeInstance;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'MISSING_STRIPE_SECRET_KEY: STRIPE_SECRET_KEY environment variable is not configured. ' +
      'Please add your Stripe Secret Key (e.g., sk_test_...) in your environment variables to enable payments and Connect onboarding.'
    );
  }

  // Initialize the Stripe Client with the secret key
  // All Stripe related requests must use this stripeClient instance
  stripeInstance = new Stripe(secretKey);
  return stripeInstance;
}

/**
 * Helper to check if Stripe has been configured with an API key
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_'));
}
