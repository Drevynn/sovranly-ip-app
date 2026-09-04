import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 3: ONBOARD CONNECTED ACCOUNTS (V2 ACCOUNT LINKS API)
 * ==============================================================================
 * Endpoint: POST /api/stripe/account-link
 *
 * Generates an onboarding link so the creator/merchant can enter their business
 * and identity details directly into Stripe's hosted flow.
 *
 * Requirements:
 * - Use V2 account links API: stripeClient.v2.core.accountLinks.create(...)
 * - Use case type: 'account_onboarding'
 * - Configurations: ['merchant', 'customer']
 */
export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: 'STRIPE_NOT_CONFIGURED',
          message:
            'STRIPE_SECRET_KEY is not configured in your environment. Please configure STRIPE_SECRET_KEY=sk_test_... to generate onboarding links.',
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

    // Determine the base origin URL for refresh and return redirects
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    /**
     * Create V2 Account Link:
     * - account: The connected account ID (acct_...)
     * - use_case: 'account_onboarding' with merchant and customer configurations
     * - refresh_url: Where the user returns if the link expires or needs refresh
     * - return_url: Where the user returns upon finishing the onboarding steps
     */
    // @ts-expect-error Stripe V2 account links typings in current SDK
    const accountLink = await stripeClient.v2.core.accountLinks.create({
      account: accountId,
      use_case: {
        type: 'account_onboarding',
        account_onboarding: {
          configurations: ['merchant', 'customer'],
          refresh_url: `${origin}/connect?accountId=${accountId}&refresh=true`,
          return_url: `${origin}/connect?accountId=${accountId}&returned=true`,
        },
      },
    });

    return NextResponse.json({
      success: true,
      url: accountLink.url,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating Stripe account link:', error);
    return NextResponse.json(
      {
        error: 'ACCOUNT_LINK_FAILED',
        message: error.message || 'Failed to create onboarding account link',
      },
      { status: 500 }
    );
  }
}
