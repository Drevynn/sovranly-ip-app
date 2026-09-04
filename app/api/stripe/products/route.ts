import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 4: CREATE PRODUCTS ON CONNECTED ACCOUNT
 * ==============================================================================
 * Endpoint: POST /api/stripe/products
 *
 * Creates a Stripe product and its default price directly on the connected account
 * by supplying the `stripeAccount` request option (which sends the `Stripe-Account` header).
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
    const { accountId, name, description, priceInCents, currency = 'usd' } = body;

    if (!accountId || !name || priceInCents === undefined) {
      return NextResponse.json(
        {
          error: 'INVALID_INPUT',
          message: 'accountId, name, and priceInCents are required.',
        },
        { status: 400 }
      );
    }

    const stripeClient = getStripeClient();

    /**
     * Creating products on the connected account:
     * We pass { stripeAccount: accountId } as the second argument (RequestOptions).
     * This sets the `Stripe-Account: acct_...` HTTP header.
     */
    const product = await stripeClient.products.create(
      {
        name: name,
        description: description || undefined,
        default_price_data: {
          unit_amount: Math.round(Number(priceInCents)),
          currency: currency.toLowerCase(),
        },
      },
      {
        stripeAccount: accountId, // Sets the Stripe-Account header
      }
    );

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        default_price: product.default_price,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error creating product on connected account:', error);
    return NextResponse.json(
      {
        error: 'PRODUCT_CREATION_FAILED',
        message: error.message || 'Failed to create product on connected account',
      },
      { status: 500 }
    );
  }
}

/**
 * ==============================================================================
 * STEP 5: LIST PRODUCTS FOR CONNECTED ACCOUNT (STOREFRONT)
 * ==============================================================================
 * Endpoint: GET /api/stripe/products?accountId=acct_...
 *
 * Retrieves the catalog of active products owned by a specific connected account.
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
          message: 'STRIPE_SECRET_KEY is not configured in your environment.',
        },
        { status: 503 }
      );
    }

    const stripeClient = getStripeClient();

    /**
     * Retrieve products on the connected account:
     * - Expand default_price to obtain currency & unit_amount
     * - Pass { stripeAccount: accountId } as RequestOptions
     */
    const products = await stripeClient.products.list(
      {
        limit: 20,
        active: true,
        expand: ['data.default_price'],
      },
      {
        stripeAccount: accountId, // Sets the Stripe-Account header
      }
    );

    return NextResponse.json({
      success: true,
      products: products.data.map((p) => {
        const priceObj = typeof p.default_price === 'object' ? p.default_price : null;
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          active: p.active,
          priceId: priceObj ? priceObj.id : null,
          unitAmount: priceObj?.unit_amount ?? 0,
          currency: priceObj?.currency ?? 'usd',
          images: p.images,
        };
      }),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching products for connected account:', error);
    return NextResponse.json(
      {
        error: 'PRODUCT_FETCH_FAILED',
        message: error.message || 'Failed to fetch products for connected account',
      },
      { status: 500 }
    );
  }
}
