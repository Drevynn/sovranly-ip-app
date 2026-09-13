import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

const DEFAULT_PORTAL_URL = 'https://billing.stripe.com/p/login/9B66oHdl8cplfpq1BV2Ji00';
const DEFAULT_PORTAL_CONFIG_ID = 'bpc_1UE0CpFU8wO4GPzPZS2EnWyL';

/**
 * ==============================================================================
 * CUSTOMER BILLING PORTAL FOR CREATOR ACCOUNTS & SUBSCRIBERS
 * ==============================================================================
 * Endpoint: GET /api/stripe/billing-portal
 * Endpoint: POST /api/stripe/billing-portal
 *
 * Allows a subscriber or creator account to manage their platform subscription,
 * update credit cards/payment methods, view and download invoices, and cancel
 * or reactivate their subscription.
 *
 * Configuration ID: bpc_1UE0CpFU8wO4GPzPZS2EnWyL
 * Direct Portal URL: https://billing.stripe.com/p/login/9B66oHdl8cplfpq1BV2Ji00
 */
export async function GET(req: NextRequest) {
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || DEFAULT_PORTAL_URL;
  const configId = process.env.STRIPE_PORTAL_CONFIGURATION_ID || DEFAULT_PORTAL_CONFIG_ID;

  // Check if client requested a direct redirect
  const redirectParam = req.nextUrl.searchParams.get('redirect');
  if (redirectParam === 'true' || redirectParam === '1') {
    return NextResponse.redirect(portalUrl);
  }

  return NextResponse.json({
    success: true,
    url: portalUrl,
    configurationId: configId,
  });
}

export async function POST(req: NextRequest) {
  const directPortalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || DEFAULT_PORTAL_URL;
  const portalConfigId = process.env.STRIPE_PORTAL_CONFIGURATION_ID || DEFAULT_PORTAL_CONFIG_ID;

  try {
    const body = await req.json().catch(() => ({}));
    const { accountId, customerId } = body;

    // If Stripe API key is not configured or in testing mode, provide direct portal URL
    if (!isStripeConfigured()) {
      return NextResponse.json({
        success: true,
        url: directPortalUrl,
        configurationId: portalConfigId,
        direct: true,
        notice: 'Using direct Stripe customer portal login URL.',
      });
    }

    const stripeClient = getStripeClient();

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const returnUrl = `${origin}/connect${accountId ? `?accountId=${accountId}` : ''}`;

    /**
     * Create Billing Portal Session:
     * - If customerId is provided (standard Stripe Customer), use `customer: customerId`
     * - If accountId is provided, use `customer_account: accountId`
     * - Include portal configuration if available
     */
    const sessionParams: any = {
      return_url: returnUrl,
      ...(portalConfigId ? { configuration: portalConfigId } : {}),
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else if (accountId) {
      sessionParams.customer_account = accountId;
    }

    // Attempt to create session if account or customer provided
    if (sessionParams.customer || sessionParams.customer_account) {
      const session = await stripeClient.billingPortal.sessions.create(sessionParams);
      return NextResponse.json({
        success: true,
        url: session.url,
        configurationId: portalConfigId,
      });
    }

    // Default fallback to direct portal login URL if no specific ID provided
    return NextResponse.json({
      success: true,
      url: directPortalUrl,
      configurationId: portalConfigId,
      direct: true,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('Stripe billing portal session creation note:', error.message);
    
    // Fallback safely to direct portal login link so user is never stranded
    return NextResponse.json({
      success: true,
      url: directPortalUrl,
      configurationId: portalConfigId,
      fallback: true,
      message: error.message,
    });
  }
}
