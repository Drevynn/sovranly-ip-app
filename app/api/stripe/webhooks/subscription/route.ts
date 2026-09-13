import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeClient, isStripeConfigured } from '@/lib/stripe';

/**
 * ==============================================================================
 * STEP 10: SUBSCRIPTIONS & BILLING WEBHOOKS (STANDARD SNAPSHOT EVENTS)
 * ==============================================================================
 * Endpoint: POST /api/stripe/webhooks/subscription
 *
 * Listens for lifecycle events for subscriptions, invoices, payment methods,
 * customer tax IDs, and billing portal sessions.
 *
 * CRITICAL RULE FOR V2 CONNECTED ACCOUNTS:
 * Do not use `subscription.customer` for V2 accounts!
 * Instead, extract the connected account ID from `subscription.customer_account`:
 * const accountId = subscription.customer_account; // shape: acct_...
 *
 * HOW TO TEST LOCALLY:
 * stripe listen --forward-to http://localhost:3000/api/stripe/webhooks/subscription
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
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const stripeClient = getStripeClient();
    let event: Stripe.Event;

    // Verify webhook signature if secret is provided
    try {
      if (webhookSecret && signature) {
        event = stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } else {
        // Fallback for local testing before setting STRIPE_WEBHOOK_SECRET
        console.warn(
          '[Stripe Webhook] STRIPE_WEBHOOK_SECRET not set; parsing payload without signature verification for testing.'
        );
        event = JSON.parse(rawBody) as Stripe.Event;
      }
    } catch (err: unknown) {
      console.error('[Stripe Webhook] Signature verification failed:', err);
      return NextResponse.json(
        { error: 'WEBHOOK_SIGNATURE_ERROR', message: (err as Error).message },
        { status: 400 }
      );
    }

    console.log(`[Stripe Webhook] Received event: ${event.type} (ID: ${event.id})`);

    // Handle each event type
    switch (event.type) {
      /**
       * 1. customer.subscription.updated
       * Monitors upgrades, downgrades, quantity changes, pauses, and cancellations
       */
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // Extract the connected account ID (acct_...) using customer_account
        const accountId = subscription.customer_account || subscription.customer;
        const currentPriceId = subscription.items?.data?.[0]?.price?.id;
        const quantity = subscription.items?.data?.[0]?.quantity ?? 1;
        const status = subscription.status; // 'active', 'past_due', 'canceled', etc.
        const cancelAtPeriodEnd = subscription.cancel_at_period_end;
        const pauseCollection = subscription.pause_collection;

        console.log(
          `[Subscription Updated] Account: ${accountId}, Price: ${currentPriceId}, Status: ${status}, CancelAtEnd: ${cancelAtPeriodEnd}`
        );

        if (pauseCollection) {
          console.log(
            `[Subscription Paused] Collection paused until: ${pauseCollection.resumes_at}, behavior: ${pauseCollection.behavior}`
          );
        }

        /**
         * TODO: Update subscription status in your database
         * e.g.,
         * await db.update(subscriptionsTable)
         *   .set({
         *      priceId: currentPriceId,
         *      quantity: quantity,
         *      status: status,
         *      cancelAtPeriodEnd: cancelAtPeriodEnd,
         *      isPaused: Boolean(pauseCollection),
         *      updatedAt: new Date(),
         *   })
         *   .where(eq(subscriptionsTable.stripeAccountId, accountId));
         */
        break;
      }

      /**
       * 2. customer.subscription.deleted
       * Monitors cancellations; revoke access to paid platform features
       */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const accountId = subscription.customer_account || subscription.customer;

        console.log(`[Subscription Deleted] Revoking membership for account: ${accountId}`);

        /**
         * TODO: Mark subscription cancelled and revoke premium perks in database
         * e.g.,
         * await db.update(subscriptionsTable)
         *   .set({ status: 'canceled', canceledAt: new Date() })
         *   .where(eq(subscriptionsTable.stripeAccountId, accountId));
         */
        break;
      }

      /**
       * 3. payment_method.attached & payment_method.detached
       */
      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        console.log(
          `[Payment Method Attached] ID: ${paymentMethod.id} to customer/account: ${paymentMethod.customer}`
        );
        /**
         * TODO: Optionally notify user that their new payment method was registered
         */
        break;
      }

      case 'payment_method.detached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        console.log(`[Payment Method Detached] ID: ${paymentMethod.id}`);
        /**
         * TODO: Prompt customer to add a new payment method if active subscriptions exist
         */
        break;
      }

      /**
       * 4. customer.updated
       * Changes in billing info or default payment method
       */
      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer;
        const defaultPaymentMethod = customer.invoice_settings?.default_payment_method;
        console.log(
          `[Customer Updated] ID: ${customer.id}, Default Payment Method: ${defaultPaymentMethod}`
        );
        /**
         * TODO: Update billing contact info in DB.
         * NOTE: All updates must be treated as billing information changes only.
         * Don't use customer billing email as login credential.
         */
        break;
      }

      /**
       * 5. customer.tax_id.created / updated / deleted
       */
      case 'customer.tax_id.created':
      case 'customer.tax_id.updated':
      case 'customer.tax_id.deleted': {
        const taxIdObj = event.data.object as Stripe.TaxId;
        console.log(`[Tax ID Event] Type: ${event.type}, Tax ID: ${taxIdObj.id}`);
        /**
         * TODO: Record verified VAT/GST/Tax ID records in accounting table
         */
        break;
      }

      /**
       * 6. billing_portal.*
       */
      case 'billing_portal.configuration.created':
      case 'billing_portal.configuration.updated':
      case 'billing_portal.session.created': {
        console.log(`[Billing Portal Event] Type: ${event.type}`);
        break;
      }

      /**
       * 7. invoice.paid & invoice.payment_failed
       */
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(
          `[Invoice Paid] Invoice ID: ${invoice.id}, Total: ${invoice.amount_paid}, Account/Customer: ${invoice.customer}`
        );
        /**
         * TODO: Generate or notarize license receipt on-chain or store transaction in DB
         */
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(
          `[Invoice Payment Failed] Invoice ID: ${invoice.id}, Account/Customer: ${invoice.customer}`
        );
        /**
         * TODO: Send notification to connected account holder regarding failed invoice
         */
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true, eventId: event.id, eventType: event.type });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Stripe Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: 'WEBHOOK_PROCESSING_FAILED', message: error.message },
      { status: 500 }
    );
  }
}
