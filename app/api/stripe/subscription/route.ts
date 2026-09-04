import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 7: CHARGE SUBSCRIPTION TO CONNECTED ACCOUNT
 * ==============================================================================
 * Endpoint: POST /api/stripe/subscription
 *
 * For V2 accounts, the connected account ID (acct_...) acts as the customer account!
 * We charge the connected account a subscription to the platform using:
 * customer_account: "acct_..."
 *
 * Requirements:
 * - mode: 'subscription'
 * - customer_account: "acct_..." (The connected account ID)
 * - line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }]
 */
export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: 'STRIPE_NOT_CONFIGURED',
          message: 'STRIPE_SECRET_KEY is not configured in your environment.',
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { accountId, priceId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'MISSING_ACCOUNT_ID', message: 'accountId is required in request body.' },
        { status: 400 }
      );
    }

    const stripeClient = getStripeClient();

    // Determine the subscription price ID from env or request, or dynamically create an example platform plan
    let targetPriceId = priceId || process.env.STRIPE_PRICE_ID;

    // If no price ID was provided or configured, dynamically ensure a sample platform plan exists
    if (!targetPriceId || targetPriceId === 'price_placeholder_id') {
      try {
        // Search or create a standard creator platform membership plan
        const sampleProduct = await stripeClient.products.create({
          name: 'Sovranly IP Pro Creator Membership',
          description: 'Zero Trust verified IP management, unlimited smart licenses, and automated royalty splits',
          default_price_data: {
            unit_amount: 2900, // $29.00 / month
            currency: 'usd',
            recurring: {
              interval: 'month',
            },
          },
        });
        targetPriceId = typeof sampleProduct.default_price === 'string'
          ? sampleProduct.default_price
          : (sampleProduct.default_price as { id: string })?.id;
      } catch (planErr) {
        console.warn('Could not create default subscription product, using placeholder:', planErr);
        targetPriceId = 'price_sample_pro_tier';
      }
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    /**
     * Create Checkout Session for V2 Connected Account Subscription:
     * Note: We specify `customer_account: accountId` (acct_...)
     */
    const session = await stripeClient.checkout.sessions.create({
      customer_account: accountId,
      mode: 'subscription',
      line_items: [
        {
          price: targetPriceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/connect?accountId=${accountId}&subscription_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/connect?accountId=${accountId}&subscription_cancelled=true`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      priceId: targetPriceId,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating subscription checkout session:', error);
    return NextResponse.json(
      {
        error: 'SUBSCRIPTION_CREATION_FAILED',
        message: error.message || 'Failed to initiate platform subscription checkout',
      },
      { status: 500 }
    );
  }
}
