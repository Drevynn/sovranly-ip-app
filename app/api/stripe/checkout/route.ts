import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 6: DIRECT CHARGE TO CONNECTED ACCOUNT (WITH APPLICATION FEE)
 * ==============================================================================
 * Endpoint: POST /api/stripe/checkout
 *
 * Direct Charges:
 * - The customer transacts directly with the connected account (their statement descriptor appears).
 * - The platform collects a fee by specifying `payment_intent_data.application_fee_amount`.
 * - The Stripe Checkout session is created on the connected account via { stripeAccount: accountId }.
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
    const {
      accountId,
      productId,
      productName,
      productDescription,
      priceInCents,
      applicationFeeAmount = 150, // Default platform monetization fee: $1.50
      quantity = 1,
    } = body;

    if (!accountId || (!productId && !priceInCents)) {
      return NextResponse.json(
        {
          error: 'INVALID_INPUT',
          message: 'accountId and product information (productId or priceInCents) are required.',
        },
        { status: 400 }
      );
    }

    const stripeClient = getStripeClient();

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    // Line items configuration for Hosted Checkout
    const lineItems = productId
      ? [
          {
            price: productId, // or pre-created price ID
            quantity: quantity,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName || 'Digital IP Asset License',
                description: productDescription || 'Purchased via Sovranly IP Creator Storefront',
              },
              unit_amount: Math.round(Number(priceInCents)),
            },
            quantity: quantity,
          },
        ];

    /**
     * Create Checkout Session with Direct Charge:
     * - mode: 'payment'
     * - payment_intent_data.application_fee_amount: Platform cut in cents
     * - stripeAccount: RequestOption targeting the connected account
     */
    const session = await stripeClient.checkout.sessions.create(
      {
        line_items: lineItems,
        payment_intent_data: {
          // Platform fee kept from the transaction
          application_fee_amount: Math.min(
            Math.round(Number(applicationFeeAmount)),
            Math.round(Number(priceInCents || 1000) * 0.5) // Cap platform fee to max 50%
          ),
        },
        mode: 'payment',
        success_url: `${origin}/storefront/${accountId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/storefront/${accountId}?cancelled=true`,
      },
      {
        stripeAccount: accountId, // Connected account is the seller of record
      }
    );

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      {
        error: 'CHECKOUT_CREATION_FAILED',
        message: error.message || 'Failed to initialize Stripe checkout',
      },
      { status: 500 }
    );
  }
}
