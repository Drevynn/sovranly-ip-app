import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 8: CUSTOMER BILLING PORTAL FOR CONNECTED ACCOUNT
 * ==============================================================================
 * Endpoint: POST /api/stripe/billing-portal
 *
 * Allows a connected account to manage their platform subscription, update
 * payment methods, view invoices, and cancel or reactivate membership.
 *
 * Requirements:
 * - Use stripeClient.billingPortal.sessions.create({ customer_account, return_url })
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
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'MISSING_ACCOUNT_ID', message: 'accountId is required in request body.' },
        { status: 400 }
      );
    }

    const stripeClient = getStripeClient();

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    /**
     * Create Billing Portal Session:
     * Note: In V2 accounts, `customer_account: accountId` is passed directly.
     */
    // @ts-expect-error customer_account is standard for V2 accounts in modern Stripe
    const session = await stripeClient.billingPortal.sessions.create({
      customer_account: accountId,
      return_url: `${origin}/connect?accountId=${accountId}`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating Stripe billing portal session:', error);
    return NextResponse.json(
      {
        error: 'PORTAL_CREATION_FAILED',
        message: error.message || 'Failed to initialize customer billing portal',
      },
      { status: 500 }
    );
  }
}
