import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 9: THIN WEBHOOK LISTENER FOR ACCOUNT V2 REQUIREMENTS & CAPABILITIES
 * ==============================================================================
 * Endpoint: POST /api/stripe/webhooks/thin
 *
 * Webhook notifications for V2 Connected Accounts use 'thin' events.
 * Thin events deliver a lightweight notification containing the event ID,
 * prompting the server to retrieve the full event payload via the API.
 *
 * HOW TO SET UP IN STRIPE DASHBOARD:
 * 1. Go to https://dashboard.stripe.com/test/workbench/webhooks
 * 2. Click "+ Add destination".
 * 3. Events from: "Connected accounts".
 * 4. Show advanced options > Payload style: select "Thin".
 * 5. In Events field, type "v2" and select:
 *    - v2.core.account[requirements].updated
 *    - v2.core.account[configuration.merchant].capability_status_updated
 *    - v2.core.account[configuration.customer].capability_status_updated
 * 6. Copy the Webhook Signing Secret into STRIPE_THIN_WEBHOOK_SECRET=whsec_...
 *
 * HOW TO TEST LOCALLY WITH STRIPE CLI:
 * stripe listen \
 *   --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated' \
 *   --forward-thin-to http://localhost:3000/api/stripe/webhooks/thin
 */
export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'STRIPE_NOT_CONFIGURED', message: 'STRIPE_SECRET_KEY is required.' },
        { status: 503 }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_THIN_WEBHOOK_SECRET;

    const stripeClient = getStripeClient();
    let eventId: string | null = null;

    // Parse the thin event notification using Stripe SDK
    try {
      if (webhookSecret && signature) {
        /**
         * In Stripe SDK v22.x, parseEventNotification verifies the thin event signature
         * (aliased from parseThinEvent in earlier revisions).
         */
        const notification = stripeClient.parseEventNotification(rawBody, signature, webhookSecret);
        eventId = notification.id;
      } else {
        // Fallback for development/testing when webhook signing secret is not yet configured
        console.warn(
          '[Stripe Thin Webhook] STRIPE_THIN_WEBHOOK_SECRET is not set; parsing without signature verification for testing.'
        );
        const notification = stripeClient.parseEventNotificationWithoutVerification(rawBody);
        eventId = notification.id;
      }
    } catch (parseErr: unknown) {
      console.error('[Stripe Thin Webhook] Signature verification failed:', parseErr);
      return NextResponse.json(
        { error: 'INVALID_SIGNATURE', message: (parseErr as Error).message },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json({ error: 'MISSING_EVENT_ID' }, { status: 400 });
    }

    /**
     * Retrieve the full event data from Stripe V2 Core API:
     * Using event.type to determine which requirement or capability changed.
     */
    const event = await stripeClient.v2.core.events.retrieve(eventId);

    console.log(`[Stripe Thin Webhook] Processing event type: ${event.type} (ID: ${event.id})`);

    // Handle each event type
    switch (event.type) {
      /**
       * 1. v2.core.account[requirements].updated
       * Occurs when required verification documents or identity fields are due, past due, or cleared.
       */
      case 'v2.core.account[requirements].updated': {
        const accountId = event.related_object?.id;
        console.log(`[Requirements Updated] Account ID: ${accountId}`);

        // Fetch fresh account details directly from V2 API
        if (accountId) {
          const account = await stripeClient.v2.core.accounts.retrieve(accountId, {
            include: ['requirements', 'configuration.merchant'],
          });

          const requirementsStatus = account.requirements?.summary?.minimum_deadline?.status;
          const onboardingComplete =
            requirementsStatus !== 'currently_due' && requirementsStatus !== 'past_due';

          console.log(
            `[Requirements Updated] Account ${accountId} status: ${requirementsStatus}, Onboarding complete: ${onboardingComplete}`
          );

          /**
           * TODO: Update account status in your database
           * e.g.,
           * await db.update(connectedAccountsTable)
           *   .set({
           *      requirementsStatus,
           *      onboardingComplete,
           *      updatedAt: new Date(),
           *   })
           *   .where(eq(connectedAccountsTable.stripeAccountId, accountId));
           */
        }
        break;
      }

      /**
       * 2. v2.core.account[configuration.merchant].capability_status_updated
       * Occurs when merchant processing capabilities (like card_payments) transition
       * between 'inactive', 'pending', and 'active'.
       */
      case 'v2.core.account[configuration.merchant].capability_status_updated': {
        const accountId = event.related_object?.id;
        console.log(`[Merchant Capability Status Updated] Account ID: ${accountId}`);

        if (accountId) {
          const account = await stripeClient.v2.core.accounts.retrieve(accountId, {
            include: ['configuration.merchant'],
          });

          const cardPaymentsStatus =
            account?.configuration?.merchant?.capabilities?.card_payments?.status;
          const readyToProcessPayments = cardPaymentsStatus === 'active';

          console.log(
            `[Merchant Capability] Card payments status for ${accountId}: ${cardPaymentsStatus} (Ready: ${readyToProcessPayments})`
          );

          /**
           * TODO: Update payments active status in your database
           * e.g.,
           * await db.update(connectedAccountsTable)
           *   .set({ readyToProcessPayments, updatedAt: new Date() })
           *   .where(eq(connectedAccountsTable.stripeAccountId, accountId));
           */
        }
        break;
      }

      /**
       * 3. v2.core.account[configuration.customer].capability_status_updated
       * Occurs when customer buying/payout capabilities are updated.
       */
      case 'v2.core.account[configuration.customer].capability_status_updated': {
        const accountId = event.related_object?.id;
        console.log(`[Customer Capability Status Updated] Account ID: ${accountId}`);
        break;
      }

      default:
        console.log(`[Stripe Thin Webhook] Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true, eventId: event.id, eventType: event.type });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Stripe Thin Webhook] Handler error:', error);
    return NextResponse.json(
      { error: 'WEBHOOK_HANDLER_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
