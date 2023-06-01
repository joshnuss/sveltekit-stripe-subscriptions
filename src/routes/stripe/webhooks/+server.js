import { stripe } from '$lib/stripe'
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

// endpoint to handle incoming webhooks
export async function POST({ request }) {
  // extract body
  const body = await request.text()

  // get the signature from the header
  const signature = request.headers.get('stripe-signature')

  // var to hold event data
  let event

  // verify it
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.SECRET_STRIPE_WEBHOOK_KEY)
  } catch (err) {
    // signature is invalid!
    console.warn('⚠️  Webhook signature verification failed.', err.message)

    // return, because it's a bad request
    throw error(400, 'Invalid request')
  }

  /* Signature has been verified, so we can process events
   * Review important events for Billing webhooks
   * https://stripe.com/docs/billing/webhooks
   * Remove comment to see the various objects sent for this sample
   */
  switch (event.type) {
    case 'customer.subscription.created':
      // Subscription was created
      break
    case 'customer.subscription.updated':
      // Subscription has been changed
      break
    case 'invoice.paid':
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      break
    case 'invoice.payment_failed':
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break
    case 'customer.subscription.deleted':
      if (event.request != null) {
        // handle a subscription canceled by your request
        // from above.
      } else {
        // handle subscription canceled automatically based
        // upon your subscription settings.
      }
      break
    default:
    // Unexpected event type
  }

  // return a 200 with an empty JSON response
  return json()
}
