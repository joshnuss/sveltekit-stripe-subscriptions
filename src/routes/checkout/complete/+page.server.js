import { stripe } from '$lib/stripe'
import { redirect } from '@sveltejs/kit'

export async function load({ url }) {
  // paymentIntent's id is passed in the URL
  const id = url.searchParams.get('payment_intent')

  // ask Stripe for latest info about this paymentIntent
  const paymentIntent = await stripe.paymentIntents.retrieve(id)

  /* Inspect the PaymentIntent `status` to indicate the status of the payment
   * to your customer.
   *
   * Some payment methods will [immediately succeed or fail][0] upon
   * confirmation, while others will first enter a `processing` state.
   *
   * [0] https://stripe.com/docs/payments/payment-methods#payment-notification
   */
  let message

  switch (paymentIntent.status) {
    case 'succeeded':
      message = 'Success! Payment received.'

      // TODO: provision account here

      break

    case 'processing':
      message = "Payment processing. We'll update you when payment is received."
      break

    case 'requires_payment_method':
      // Redirect your user back to your payment page to attempt collecting
      // payment again
      throw redirect(303, '/checkout/payment')

    default:
      message = 'Something went wrong.'
      break
  }

  return {
    message
  }
}
