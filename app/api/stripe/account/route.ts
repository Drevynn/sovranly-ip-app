import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 1: CREATE CONNECTED ACCOUNT (V2 CORE ACCOUNTS API)
 * ==============================================================================
 * Endpoint: POST /api/stripe/account
 *
 * Creates a Connected Account using Stripe's V2 API.
 * Rules for V2 Accounts:
 * 1. Must use stripeClient.v2.core.accounts.create(...)
 * 2. Never pass 'type' at the top level (no express, standard, or custom).
 * 3. Specifies identity, dashboard, defaults, and configuration for merchant/customer.
 */
export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: 'STRIPE_NOT_CONFIGURED',
          message:
            'STRIPE_SECRET_KEY is not configured in your environment. Please set STRIPE_SECRET_KEY=sk_test_... in .env.local to create connected accounts.',
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { displayName, contactEmail } = body;

    if (!displayName || !contactEmail) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'displayName and contactEmail are required.' },
        { status: 400 }
      );
    }

    // Initialize the Stripe Client
    const stripeClient = getStripeClient();

    /**
     * V2 Account Creation:
     * - Only use the specified properties.
     * - Never pass type: 'express' | 'standard' | 'custom' at the top level.
     */
    // @ts-expect-error Stripe V2 core accounts API in current SDK typings
    const account = await stripeClient.v2.core.accounts.create({
      display_name: displayName,
      contact_email: contactEmail,
      identity: {
        country: 'us',
      },
      dashboard: 'full',
      defaults: {
        responsibilities: {
          fees_collector: 'stripe',
          losses_collector: 'stripe',
        },
      },
      configuration: {
        customer: {},
        merchant: {
          capabilities: {
            card_payments: {
              requested: true,
            },
          },
        },
      },
    });

    /**
     * TODO: Database mapping
     * In a production application with an existing database (e.g. Postgres, Cloud SQL, Firestore),
     * you should persist a mapping between your internal user ID and this Stripe account ID:
     *
     * await db.update(usersTable)
     *   .set({ stripeAccountId: account.id })
     *   .where(eq(usersTable.id, currentUserId));
     */

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        displayName: account.display_name || displayName,
        contactEmail: account.contact_email || contactEmail,
        created: account.created,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating Stripe connected account:', error);
    return NextResponse.json(
      {
        error: 'ACCOUNT_CREATION_FAILED',
        message: error.message || 'Failed to create Stripe connected account',
      },
      { status: 500 }
    );
  }
}

/**
 * ==============================================================================
 * STEP 2: GET CONNECTED ACCOUNT STATUS (DIRECT V2 RETRIEVAL)
 * ==============================================================================
 * Endpoint: GET /api/stripe/account?accountId=acct_...
 *
 * Checks onboarding and payment status directly from the accounts API.
 * Rules:
 * - Always get the account status from the API directly (do not rely on stale DB status).
 * - Includes 'configuration.merchant' and 'requirements' expansions.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'MISSING_ACCOUNT_ID', message: 'accountId query parameter is required.' },
        { status: 400 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: 'STRIPE_NOT_CONFIGURED',
          message: 'STRIPE_SECRET_KEY is not configured. Please set your Stripe test key.',
        },
        { status: 503 }
      );
    }

    const stripeClient = getStripeClient();

    /**
     * Retrieve V2 Account with required expansions:
     * include: ["configuration.merchant", "requirements"]
     */
    // @ts-expect-error Stripe V2 core accounts API in current SDK typings
    const account = await stripeClient.v2.core.accounts.retrieve(accountId, {
      include: ['configuration.merchant', 'requirements'],
    });

    // Evaluate payment processing readiness
    const readyToProcessPayments =
      account?.configuration?.merchant?.capabilities?.card_payments?.status === 'active';

    // Evaluate onboarding completeness based on requirement deadlines
    const requirementsStatus = account.requirements?.summary?.minimum_deadline?.status;
    const onboardingComplete =
      requirementsStatus !== 'currently_due' && requirementsStatus !== 'past_due';

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        displayName: account.display_name,
        contactEmail: account.contact_email,
        readyToProcessPayments,
        onboardingComplete,
        requirementsStatus: requirementsStatus || 'none',
        cardPaymentCapability:
          account?.configuration?.merchant?.capabilities?.card_payments?.status || 'inactive',
        requirements: account.requirements || null,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error retrieving Stripe connected account:', error);
    return NextResponse.json(
      {
        error: 'ACCOUNT_RETRIEVAL_FAILED',
        message: error.message || 'Failed to retrieve connected account',
      },
      { status: 500 }
    );
  }
}
